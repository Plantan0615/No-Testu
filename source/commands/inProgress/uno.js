const cardDealer = require("card-dealer");
const Discord = require("discord.js");
module.exports.run = async(client, message, args) => {
//filter
const filter = m=> m.content.includes("playing");
//ask for number of players
var num;
if (args.length == 0) {
    // Error with no number of players
    let msg = await message.reply("You must provide a number of players.")
    await message.delete({timeout: 3000})
    await msg.delete({timeout: 2000})
    return;
}
else {
    num = parseInt(args)
    if(num <= 10){
    //reply to starting message to fetch IDS
    const promptMsg = new Discord.MessageEmbed();
    promptMsg.setTitle("Welcome to Uno!")
    promptMsg.setDescription(`You have choosen ${num} players. All of you need to reply with "playing" to continue.`)
        await message.channel.send(promptMsg);
        //get userIDs
        let data = null
        let collected = await message.channel.awaitMessages(filter, {max: num, time: 30000, errors: ["time"]}).catch(er => {
            data = er
        })
        if (collected != undefined) {
            data = collected
        }
        const userArr = []
        let collectArr = data.array();
        for(let i = 0; i < collectArr.length; i++){
            userArr.push(collectArr[i].author.id)
        }
        //dm players
        for(let j = 0; j < userArr.length; j++){
        const user = client.users.cache.get(`${userArr[j]}`)
        user.send("testing")
        }
    }
    // Error with too many players
    else{
        let msg = await message.reply("Too many players (max: 10).")
        await message.delete({timeout: 3000})
        await msg.delete({timeout: 2000})
        return;
    }
}
}
//GAME START
    //get uno deck
    //minimum 2 shuffles
    //shuffle deck
        //give each player 7 cards
        //create draw and discard piles
            //if wild/ wild draw 4- return to draw pile
            //if draw 2- assign player 1 2 cards
            //if reverse card- order of play has changed to -1
            //if skip card-player 1 loses turn and player 2 plays
//PLAY GAME
    //fetch card on top of discard pile information- colour, number, word
    //does player play the hand?
        //if played- check if card matches at least one value of top card in discard pile
            //update number of cards in hand and score
                //if draw 2- assign next player 2 cards
                //if reverse card- order of play has changed to -1
                //if skip card- player loses turn and next player plays
                //if wild- change colour to any colour
                //if wild draw 4- change colour and have next player draw 4
        //if not- draw card and move onto the next player
            //update number of cards in hand and score
                //if draw 2- assign next player 2 cards
                //if reverse card- order of play has changed to -1
                //if skip card- player loses turn and next player plays
                //if wild- change colour to any colour
                //if wild draw 4- change colour and have next player draw 4
//END GAME
    //if a player is on last card-
        //need to figure out alternative way to get around "saying" uno
            //if player says uno- play last round
            //if player doesn't say uno and is caught- draw 4 cards
            //if player doesn't say uno and isn't caught- play last round
                //when someone has 0 cards- they win
                    //if last card played is draw 2- next player draws 2
                    //if last card plated is wild draw 4- next player draws 4
                    //end game
                        //scoring- player with lowest points wins
                            //number cards- face value
                            //draw 2, reverse, skip- 20
                            //wild, wild draw 4- 50

module.exports.help = {
    name: "uno",
    category: "blackjack",
    usage: `PREFIXuno number-of-players\n PREFIXuno 3`,
    description: "Uno is a game where you try to get rid of all your cards first. You discard cards that matche the top of the discard pile (in terms of number, colour, or word)."
};