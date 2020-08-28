const cardDealer = require("card-dealer");
const Discord = require("discord.js")

module.exports.run = async(client, message, args) => {
    if (args.length == 0) {
        // Error with no bet
        let msg = await message.reply("You must place a bet")
        await message.delete({timeout: 3000})
        await msg.delete({timeout: 2000})
        return
    }
    // UNO may be another option :)
    const standardDeck = cardDealer.standardDeck
    const dealer = new cardDealer.Dealer(standardDeck);

    const randomize = Math.floor(Math.random() * 10) + 2 // minimum: 2 time shuffle
    // Reset Deck
    dealer.reset()
    
    // Shuffle the deck x times
    for(let i = 0; i < randomize; i++) {
        dealer.shuffle()
    }
    let game = new BlackJack(message, dealer)

    await game.start()
}

module.exports.help = {
    name: "blackjack",
    category: "blackjack",
    usage: "PREFIXblackjack 5",
    description: "Blackjack is a game that you play against the dealer, trying to get your total cards to 21"
}

class BlackJack {

    constructor(_message, _system) {
        this.message = _message
        this.prompt = null
        this.player = {cards: [], total: 0}
        this.dealer = {cards: [], total: 0}
        this.system = _system
        this.collector = null
        this.filter = null
        this.winner = null
    }

    toCapitalize(input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }

    getRemainingDeck() {
        return this.system.remainingCards()
    }

    async start() {
        const promptMsg = new Discord.MessageEmbed();
        this.starterDeck()

        const isPlayerWinner = this.isBlackJack("player")
        const isDealerWinner = this.isBlackJack("dealer")

        const playerBusted = this.hasBusted("player")
        const dealerBusted = this.hasBusted("dealer")

        const playerCardEmoji = this.toEmoji("player", true)
        const dealerCardEmoji = this.toEmoji("dealer", true)

        const playerDetails = isPlayerWinner ? "\nYou haven't even played and you already won! Congrats!" : null;
        promptMsg.setTitle("Welcome to Blackjack!")
        if (playerDetails != null) {
            promptMsg.setDescription(`The game has started! Would you like to hit or stand?\nType \`hit\` to hit, \`stand\` to stand.\n${playerDetails}`)
        } else {
            promptMsg.setDescription(`The game has started! Would you like to hit or stand?\nType \`hit\` to hit, \`stand\` to stand.`)
        }
        promptMsg.addField("Player", `${playerCardEmoji.result.join("\n")}\nTotal: ${playerCardEmoji.total}`, true)
        promptMsg.addField("Dealer", `${dealerCardEmoji.result.join("\n")}\nTotal: ${dealerCardEmoji.total}`, true)

        this.prompt = await this.message.channel.send({embed: promptMsg})

        if (!isPlayerWinner) {
            // Filter
            let user = this.message.author.id
            this.filter = (msg) => {
                return ["hit", "stand"].includes(msg.content.toLowerCase()) && msg.author.id == user
            }
            let hasError = false
            // Trigger flow
            this.collector = await this.message.channel.awaitMessages(this.filter, {max: 1, timeout: 10000, errors: ['time']}).catch(collected => {
                hasError = true
            })
            if (hasError) {
                // did not meet requirements
                await this.message.reply("Time is up!");
                await this.message.delete({timeout: 1000})
                await this.prompt.delete()
                return
            }
            await this.run(this.collector.first(), "player")
        } else {
            // Player wins, give money
            await this.message.reply("You have won money!");
        }
    }

    wait(seconds = 1) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, seconds * 1000)
        })
    }

    async run(msg, who, action = null) {
        who = who.toLowerCase()
        let machine = {}
        
        machine.updateEmbed = async (input, hasFinished = false) => {
            if (!hasFinished) {
                await msg.delete({timeout: 1000});
            }

            let playerEmoji = null, dealerEmoji = null
            if (input == "dealer") {
                playerEmoji = this.toEmoji("player")
                dealerEmoji = this.toEmoji("dealer")
            } else {
                playerEmoji = this.toEmoji(input)
                dealerEmoji = this.toEmoji("dealer", true)
            }
            
            // Update Bot
            let oldEmbed = this.prompt.embeds[0]
            let newEmbed = new Discord.MessageEmbed(oldEmbed)
            newEmbed.fields = []
            const hasHit = ["hit"].includes(msg.content.toLowerCase());
            const checkIf = await this.getChecks(input)

            const getAnyTrue = Object.keys(checkIf).filter(v => {
                return checkIf[v] == true
            }).map(v => {
                let obj = {}
                obj[v] = checkIf[v]
                return obj
            })
            console.log(`WHO: ${input}`)
            let hasCompute = false
            if (!hasFinished) {
                if (hasHit && getAnyTrue.filter(v => v.busted == true || v.isBlackJack == true).length == 0) {
                    // Prompt
                    newEmbed.setDescription(`${this.toCapitalize(input)}, You have ${msg.content.toLowerCase()}!\nAre you going to **hit** or **stand** agian?`)
                } else if (getAnyTrue.length != 0 && getAnyTrue.filter(v => v.busted == true || v.isBlackJack == true).length >= 1) {
                    newEmbed.setDescription(`Dealer is computing the winner now!`)
                    hasCompute = true
                } else {
                    newEmbed.setDescription(`${this.toCapitalize(input)}, You have ${msg.content.toLowerCase()}!  Dealer is going!`)

                }
            } else {
                this.determineWinner()
                newEmbed.setDescription(`Winner: ${this.getWinner()}`)
            }
            newEmbed.addField("Player", `${playerEmoji.result.join("\n")}\nTotal: ${playerEmoji.total}`, true)
            newEmbed.addField("Dealer", `${dealerEmoji.result.join("\n")}\nTotal: ${dealerEmoji.total}`, true)

            this.prompt = await this.prompt.edit({embed: newEmbed})

            if (hasCompute) {
                return await machine["updateEmbed"](input, true)
            }
            const hasLostOrNot = getAnyTrue.filter(v => v.busted == true || v.isBlackJack == true)
            console.log(`hasHit: ${hasHit}`, hasLostOrNot, `Has Finished: ${hasFinished}`)
            if (hasLostOrNot.length >= 1 && !hasFinished) {
                console.log("SOMEONE LOST")
                this.determineWinner()
                return await machine["updateEmbed"](input, true)
            }
            if(hasHit) {
                let hasError = false
                // Trigger flow
                this.collector = await this.message.channel.awaitMessages(this.filter, {max: 1, timeout: 10000, errors: ['time']}).catch(collected => {
                    hasError = true
                })
                if (hasError) {
                    // did not meet requirements
                    await this.message.reply("Time is up!");
                    await this.message.delete()
                    await this.prompt.delete()
                    return
                }
                return await this.run(this.collector.first(), input)
            } else {
                if (!hasFinished) {
                    console.log(hasHit, getAnyTrue)
                    this.determineWinner()
                    return await machine["updateEmbed"](input, true)
                }
                return null
            }
        }

        machine.hit = async (input) => {
            console.log(`Who Hit: ${input}`)
            this.add2Deck(input)

            await machine.updateEmbed(input);
            return undefined
        }

        machine.check = async (input) => {
            const checks = {
                busted: this.hasBusted(input),
                isBlackJack: this.isBlackJack(input),
                isUnder: this.isUnder(input),
                isUnder17: this.isUnder17(input)
            }

            console.log(input, checks)
            if (input == "dealer") {
                if (checks.isUnder17) {
                    return await this.run(msg, input, "hit")
                }
                return await this.run(msg, input, "compute")
            }
            if (input == "player") {
                if (checks.busted) {
                    return {
                        who: input,
                        action: "lost"
                    }
                }
                if (checks.isBlackJack) {
                    return {
                        who: input,
                        action: "won"
                    }
                }
                return null
            }
        }

        machine.compute = async () => {
            let determineWinner = this.determineWinner()

            console.log("WE ARE COMPUTING WINNER!")
            console.log(this.getWinner())
        }

        machine.stand = async (input) => {
            console.log(input)
            if (input == "player") {
                console.log("Dealer will now check and either hit, stand, or win / lose")
                await this.run(msg, "dealer", "check")
                return undefined
            } else {
                return null
            }
        }

        if (action != null) {
            console.log(`Action: ${action.toLowerCase()}`)
            return await machine[action.toLowerCase()](who)
        }
        if (who == "player") {
            console.log(`${who} is going to ${msg.content.trim().toLowerCase()}`)
            return await machine[msg.content.trim().toLowerCase()](who)
        } else {
            if (action != null) {
                console.log(`Action: ${action.toLowerCase()}`)
                return await machine[action.toLowerCase()](who)
            } else {
                console.log("Action was NULL")
            }
        }
    }

    getChecks(input) {
        const checks = {
            busted: this.hasBusted(input),
            isBlackJack: this.isBlackJack(input),
            isUnder: this.isUnder(input),
            isUnder17: this.isUnder17(input)
        }
        return checks
    }

    getWinner() {
        return this.winner
    }

    determineWinner() {
        const player = this.player
        const dealer = this.dealer
        const result = {
            player: this.getChecks("player"),
            dealer: this.getChecks("dealer")
        }
        if (result.player.busted) {
            this.winner = "dealer"
            return
        }
        if (result.player.isBlackJack) {
            this.winner = "player"
            return
        }
        if (result.dealer.busted) {
            this.winner = "player"
            return
        }
        if (result.dealer.isBlackJack) {
            this.winner = "dealer"
            return
        }
        this.winner = (player.total > dealer.total ? "player" : player.total == dealer.total ? "None" : "dealer")
        return
    }

    getTotal(input) {
        return this[input].cards
    }

    isBlackJack(input) {
        return this[input].total == 21
    }

    hasBusted(input) {
        return this[input].total > 21
    }

    isUnder(input) {
        return this[input].total < 21
    }

    isUnder17(input) {
        return this[input].total <= 16
    }

    toEmoji(who, isInit = false) {
        let dealerTotal = 0
        let result = this[who].cards.map((v, index) => {
            if (isInit) {
                if (who != "dealer") {
                    return `${this.convertCardToValue(v, this[who].cards, who)} :${v.suit.toLowerCase()}:`
                } else {
                    if (index == 0) {
                        dealerTotal += parseInt(this.convertCardToValue(v, this[who].cards, who))
                        return `${this.convertCardToValue(v, this[who].cards, who)} :${v.suit.toLowerCase()}:`
                    } else {
                        return `:skull_crossbones:`
                    }
                }
            } else {
                return `${this.convertCardToValue(v, this[who].cards, who)} :${v.suit.toLowerCase()}:`
            }
        })
        return {
            result,
            total: dealerTotal == 0 ? this[who].total : dealerTotal
        }
    }

    convertCardToValue(card, cards = [], user = null) {
        let rank = card.rank
        let data = user != null ? this[user] : null
        if (["jack", "queen", "king"].includes(rank.toLowerCase())) {
            return '10'
        }
        console.log("CONVERTING!")
        console.log(data, data != null ? data.total : null)
        console.log(["ace"].includes(rank.toLowerCase()), cards.filter(v => v.rank.toLowerCase() == "ace"), cards.filter(v => v.rank.toLowerCase() == "ace").length)
        if (data != null && data.total >= 11 && ["ace"].includes(rank.toLowerCase()) && cards.filter(v => v.rank.toLowerCase() == "ace").length == 0) {
            return '1'
        }
        if (["ace"].includes(rank.toLowerCase()) && cards.filter(v => v.rank.toLowerCase() == "ace").length > 1) {
            return '1';
        }
        if (["ace"].includes(rank.toLowerCase())) {
            return '11'
        }
        return rank
    }

    add2Deck(input) {
        let card = this.system.draw(1)
        this.system.discard(1)
        let offCard = card[0]
        this[input].cards.push(offCard)
        let result = this.convertCardToValue(offCard, this[input].cards, input)
        this[input].total += parseInt(result)
    }

    starterDeck() {
        // ORDER: Player -> skip 1 -> dealer face up -> player -> skip 1 -> dealer face down
        this.add2Deck("player")
        this.add2Deck("dealer")
        this.add2Deck("player")
        this.add2Deck("dealer")
    }
}