let emojis = require("node-emoji")
let emojiMissing = (name) => {
  return `${name}`
}

let msgCollectorFilter = (newMsg, originalMsg) => {
    let { cache } = originalMsg.guild.emojis;
    if(newMsg.author.id !== originalMsg.author.id) {return false};
    return true;
}
module.exports = {
    run: async(client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR")){
        message.channel.bulkDelete(2).catch(err => console.log(err));
        let noAccess = await message.channel.send("You cannot set up role menus");
        await noAccess.delete({ timeout: 3500 }).catch(err => console.log(err));
        return;
    }
        if (args == undefined) { 
            await message.channel.send("Too many arguments, provide only 1 message ID").then((msg) => {
                msg.delete({timeout: 5000}).catch(err => {
                console.log(err)
                })
            })
            return
        }
        if (Array.isArray(args) && args.length != 1) {
            await message.channel.send("Too many arguments, provide only 1 message ID").then((msg) => {
                msg.delete({timeout: 5000}).catch(err => {
                console.log(err)
                })
            })
            return
        }
        const element = args.shift()
        let isNum = /^\d+$/.test(element);
    
        if (!isNum) {
            await message.channel.send("Missing snowflake").then((msg) => {
            msg.delete({timeout: 5000}).catch(err => {
                console.log(err)
            })
            })
            return
        }
        console.log("Fetching....")
        let fetchChannel = await message.channel.fetch()
        let fetchedMessage = await fetchChannel.messages.fetch(element)
        if (fetchedMessage == undefined) {
            console.log(fetchedMessage)
            return message.reply("Unable to find message ID")
        }
        let isValid = fetchedMessage != undefined ? fetchedMessage.author.id == message.author.id : false
        if (fetchedMessage != undefined && isValid == true) {
            let optNumMsg = await message.channel.send("Please provide the number of role menu options you wish to have.");
                optNumMsg.delete({ timeout: 10000});
            let filterMsg = (msg) => {
                return message.author.id == msg.author.id && msg.content.length >= 1 && msg.content.length <= 2 && (!isNaN(msg.content) && parseInt(msg.content) >= 1 && parseInt(msg.content) <= 20)
            }
            let isError = false
            let optNum = await message.channel.awaitMessages(filterMsg, {max: 1, time: 10000}).catch(err => {console.log(err); isError = true})
            if(isError) {
                message.reply("You did not reply in time. try again")
                return
            }
            // Opt Number will return a collection
            let optMsg = optNum.first()
            if (optMsg != undefined)
            {
                let convertedNum = parseInt(optMsg.content)
                let emojiArr = []

                for (let i = 0; i < convertedNum; i++) {
                   let optMsg = await message.channel.send(`Please provide an emoji for role menu option ${(i + 1)}, one emoji please`);
                    optMsg.delete({ timeout: 2000});
                    let msgCollectorFilter = async m => {
                        const result = m.cleaContent
                        let regex = /:([a-zA=Z_]+):/g
                        let emojiSplit = m.content.replace("<", "").replace(">", "").split(":").filter(v => v.length != 0)
                        let emojiInfo = {
                            animated: emojiSplit.length == 3 ? emojiSplit[0].toLowerCase() == "a" ? true : false : false,
                        }
                        emojiInfo.name = emojiSplit.length == 3 ? emojiSplit[1] : emojiSplit[0]
                        emojiInfo.id = emojiSplit.length == 3 ? emojiSplit[2] : emojiSplit[1]

                        let emojiCache = m.guild.emojis.cache.find(e => e.name == emojiInfo.name)
                        if (emojiCache == undefined) {
                            return false
                        }
                        return m.author.id == message.author.id && !emojiArr.includes(m.content) && (emojis.emojify(m.cleanContent, emojiMissing) == m.cleanContent || emojiCache != undefined)
                    }
                    let collector = await message.channel.awaitMessages(msgCollectorFilter, {time: 10000, max: 1}).catch(e => {isError = true});
                    if (isError) {
                        message.reply("You did not finish in time")
                        return
                    }
                    let collectMsg = collector.first()
                    if (collectMsg == undefined) {
                        message.reply("You did not finish in time")
                        return
                    }
                    emojiArr.push({emoji: collectMsg.content, message: collectMsg, content: ""})
                }
                // we can now make and/or edit the message
                for ( let i = 0; i < emojiArr.length; i++ ) {
                    const emojiReact = emojiArr[i]

                    let emojiSplit = emojiReact.message.content.replace("<", "").replace(">", "").split(":").filter(v => v.length != 0)
                    let emojiInfo = {
                        animated: emojiSplit.length == 3 ? emojiSplit[0].toLowerCase() == "a" ? true : false : false,
                    }
                    emojiInfo.name = emojiSplit.length == 3 ? emojiSplit[1] : emojiSplit[0]
                    emojiInfo.id = emojiSplit.length == 3 ? emojiSplit[2] : emojiSplit[1]

                    let emojiCache = emojiReact.message.guild.emojis.cache.find(e => e.name == emojiInfo.name)
                    if (emojiCache == undefined) {
                        const convertEmoji = emojis.emojify(emojiReact.emoji, emojiMissing)
                        console.log(convertEmoji)
                        await fetchedMessage.react(convertEmoji).catch(async e => {
                            console.log(e)
                            let emojiMsg = await message.channel.send(`\\${emojiReact.emoji}`)
                            await fetchedMessage.react(emojiMsg.content).catch(e2 => {
                                console.log(e2)
                            })
                            await emojiMsg.delete({timeout: 1000})
                        })
                    } else {
                        await fetchedMessage.react(emojiCache)
                    } 
                } await message.channel.bulkDelete(emojiArr.length + 2).catch(err => console.log(err))
            }
        }
    },
}
module.exports.help = {
    name: "emoji",
    category: "admin",
    usage: `Template: PREFIXemoji messageID\nExample: PREFIXemoji 744291706031177799 (this is a random messageID)`,
    description: "For setting up role menus. Works similarly to poll. Type ~help poll if you need help there."
}