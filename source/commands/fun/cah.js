const Shuffle = require("shuffle");
const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {
//filter and input variables
const filter = m => m.content.includes("playing");
var num;
var pts;
var players = [];
const userArr = []
const nameArr = []
const playArr = [];
//ask for number of players and points
    // Error with no number of players
    if (args.length == 0) {
        let msg = await message.reply("You must provide a number of players.")
        await message.delete({
            timeout: 3000
        })
        await msg.delete({
            timeout: 2000
        })
        return;
    }
    // Error with no points
    if (args.length == 1) {
        let msg = await message.reply("You must provide a number of points to play to (i.e. the first player to reach this number wins).")
        await message.delete({
            timeout: 3000
        })
        await msg.delete({
            timeout: 2000
        })
        return;
    }
    //if players and points provided
    else {
        num = parseInt(args[0])
        pts = parseInt(args[1])
        //if players and points are within limits
        if (num <= 10 && pts <= 12) {
            //send starting message
            const promptMsg = new Discord.MessageEmbed();
            promptMsg.setTitle("Welcome to Cards Against Humanity!")
            promptMsg.setDescription(`You have choosen ${num} players and ${pts} points. All of you need to reply with "playing" to continue.`)
            await message.channel.send(promptMsg);
            //get userIDs of players
            //collect messages
            let data = null
            let collected = await message.channel.awaitMessages(filter, {
                max: num,
                time: 60000,
                errors: ["time"]
            }).catch(er => {
                data = er
            })
            if (collected != undefined) {
                data = collected
            }
            //create array of user IDs
            let collectArr = data.array(); //converts collected player ID's into collectArr
            for (let i = 0; i < collectArr.length; i++) {
                userArr.push(collectArr[i].author.id)
                nameArr.push(collectArr[i].author.username)
            }
        }
        //too many players error
        else if (num > 10) {
            let msg = await message.reply("Too many players (max: 10).")
            await message.delete({
                timeout: 3000
            })
            await msg.delete({
                timeout: 2000
            })
            return;
        } //too many points error
        else if (pts > 12) {
            let msg = await message.reply("Too many points (max: 12).")
            await message.delete({
                timeout: 3000
            })
            await msg.delete({
                timeout: 2000
            })
            return;
        }
    }
    //reference db
    let prepareStatement = client.sql.prepare("SELECT * FROM cah WHERE type = ?");
    //get white cards
    var wCards = prepareStatement.all(`white`);
    //shuffle white deck
    var wdeck = Shuffle.shuffle({
        deck: wCards
    });
    //get black cards
    var bCards = prepareStatement.all(`black`);
    //shuffle black deck
    var bDeck = Shuffle.shuffle({
        deck: bCards
    });
//deal 10 white cards to each player
    //create player variables
    function createVariables() {
        for (var i = 0; i < userArr.length; i++) {
            var str = "player" + (i + 1).toString() + "= []"; //creates string per player
            playArr[i] = eval(str) //creates variable from string
        }
    }
    //call function
    createVariables();
    //deal cards
    wdeck.deal(10, playArr);
    //create structure of players
    for (var i = 0; i < userArr.length; i++) {
        // IF PLAYER 1
        if (i === 0) {
            players[i] = {
                playerNum: "player" + (i + 1).toString(),
                username: nameArr[i],
                userID: userArr[i],
                hand: playArr[i],
                points: 0,
                czar: true
            };
        }
        // IF ANY OTHER PLAYER
        else if (i >= 1) {
            players[i] = {
                playerNum: "player" + (i + 1).toString(),
                username: nameArr[i],
                userID: userArr[i],
                hand: playArr[i],
                points: 0,
                czar: false
            };
        }
    }
    //send cards via dm
    var handEmbed;
    var cDM = [];
    for (let i = 0; i < players.length; i++) {
        if (players[i].czar === false) {
            handEmbed = new Discord.MessageEmbed()
                .setTitle(`Cards Against Humanity`)
                .setDescription(`You are ${players[i].playerNum}. You have ${players[i].points} points.`)
            for (let j = 0; j < players[i].hand.length; j++) {
                let fName = "Card " + (j + 1).toString()
                handEmbed.addField(fName, players[i].hand[j].content)
            }
        } else {
            handEmbed = new Discord.MessageEmbed()
                .setTitle(`Cards Against Humanity`)
                .setDescription(`You are ${players[i].playerNum}. You have ${players[i].points} points. You are the czar this round!`)
            for (let j = 0; j < players[i].hand.length; j++) {
                let fName = "Card " + (j + 1).toString()
                handEmbed.addField(fName, players[i].hand[j].content)
            }
        }
        let user = client.users.cache.get(`${userArr[i]}`)
        cDM[i] = await user.send({
           embed: handEmbed
        })
    }
//loop starts here
do {
//variables
const newUserArr = []
const cardNums = []
var cardsArr = []
var player, value, pCard;
var czarArr = [];
var ptsArr = [];
var discard;
var currentPts, newPts
var posi, czName, currentCzID;
var newCard;
    //get random black card
    const bDealt = bDeck.draw(1);
    //czar function
    checkCzar();
    //send black card to channel
    const bCardEmbed = new Discord.MessageEmbed()
    bCardEmbed.setTitle(`Cards Against Humanity. ${czName} is the czar this round.`)
    bCardEmbed.setDescription(`${bDealt.content}`)
    let currentEmbed = await message.channel.send({
        embed: bCardEmbed
    })
    //await white card selection for all players except czar
    const cardFilter = (msg) => {
        return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].includes(msg.content.toLowerCase()) && currentCzID !== msg.author.id
    };
    //collect messages
    let data = null
    let newNum = num - 1
    let collected = await message.channel.awaitMessages(cardFilter, {
        max: newNum,
        time: 60000,
        errors: ["time"]
    }).catch(er => {
        data = er
    })
    if (collected != undefined) {
        data = collected
    }
    //create array of user responses and ids
    let collectArr2 = data.array();
    for (let i = 0; i < collectArr2.length; i++) {
        newUserArr.push(collectArr2[i].author.id);
        cardNums.push(collectArr2[i].content);
    }
    findPlayerCard(); // we now have array of all the chosen cards, player hand has been edited

    //send new black/white combo embed
    const oldEmbed = currentEmbed.embeds.length >= 1 ? currentEmbed.embeds[0] : null
    const comboEmbed = oldEmbed != null ? new Discord.MessageEmbed(oldEmbed) : new Discord.MessageEmbed()
    comboEmbed.fields = []
    for (let i = 0; i < cardsArr.length; i++) {
        let fName = "Card " + (i + 1).toString()
        comboEmbed.addField(fName, cardsArr[i].content)
    }
    let newCurrent = await currentEmbed.edit({embed: comboEmbed});
    await message.channel.bulkDelete(newNum);
//let czar pick best card
    //check if czar is true
    const czarFilter = (msg) => {
        return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].includes(msg.content.toLowerCase()) && currentCzID === msg.author.id
    };
    //await czar message
        //collect messages
        let data2 = null
        let collected2 = await message.channel.awaitMessages(czarFilter, {
            max: 1,
            time: 60000,
            errors: ["time"]
        }).catch(er => {
            data2 = er
        })
        if (collected != undefined) {
            data2 = collected2
        }
        //get userID and content of the card
        let collectArr3 = data2.array();//array of collected message
        let winCNum = parseInt(collectArr3[0].content) //content of collected message
        //create index num
        let winINum = winCNum - 1
        //user index number to find userID
        let winUser = players.find(item => item.userID === newUserArr[winINum])
        let winUname = winUser.username
        //user index number to get card
        let winCard = cardsArr[winINum].content
        //add points
        assignPts();
        let winPts = winUser.points
    //send win embed (for the round)
    const oldEmbed1 = newCurrent.embeds.length >= 1 ? newCurrent.embeds[0] : null
    const comboEmbed1 = oldEmbed != null ? new Discord.MessageEmbed(oldEmbed1) : new Discord.MessageEmbed()
    comboEmbed1.setTitle(`Cards Against Humanity` )
    comboEmbed1.setDescription(`${winUname} won this round. They have ${winPts} Points.`)
    comboEmbed1.fields = []
    comboEmbed1.addField("Black Card:", `${bDealt.content}`)
    comboEmbed1.addField("White Card:", `${winCard}`)
    await currentEmbed.edit({embed: comboEmbed1});
    await message.channel.bulkDelete(1);
    //put discarded black card on bottom of black deck   
    bdeck.putOnBottomOfDeck(bDealt)
    //check points
    checkPoints();
    //assign czar to next player
    assignCzar();
    //change czar to false
    removeCzar();
    //assign players a new card
    assignNewCards();
    //send new hand embeds
    var newCDM = []
    for (let i = 0; i < players.length; i++) {
        const oldDM = cDM[i].embeds.length >= 1 ? cDM[i].embeds[0] : null
        const newDM= oldDM != null ? new Discord.MessageEmbed(oldDM) : new Discord.MessageEmbed()
        newDM.fields = []
        if (players[i].czar === false) {
                newDM.setTitle(`Cards Against Humanity`)
                newDM.setDescription(`You are ${players[i].playerNum}. You have ${players[i].points} points.`)
            for (let j = 0; j < players[i].hand.length; j++) {
                let fName = "Card " + (j + 1).toString()
                newDM.addField(fName, players[i].hand[j].content)
            }
        } else if (players[i].czar === true) {
                newDM.setTitle(`Cards Against Humanity`)
                newDM.setDescription(`You are ${players[i].playerNum}. You have ${players[i].points} points. You are the czar this round!`)
            for (let j = 0; j < players[i].hand.length; j++) {
                let fName = "Card " + (j + 1).toString()
                newDM.addField(fName, players[i].hand[j].content)
            }
        }
        newCDM[i] = await cDM[i].edit({embed: newDM});
    }
    //send new black card- begin loop again
//FUNCTIONS
    function checkPoints() {
        for (var i = 0; i < players.length; i++) {
            ptsArr[i] = players[i].points //creates array of points
        }
    }

    function checkCzar() {
        for (var i = 0; i < players.length; i++) {
            czarArr[i] = players[i].czar //gets czar value of player at position i and populates array
        }
        if (czarArr.includes(true)) {
            posi = czarArr.indexOf(true)//gets index of true in czar arr
            czName = players[posi].username //gets username of current czar (at true index)
            currentCzID = players[posi].userID //user ID of current czar (at true index)
        }
    }
var newCz;
    function assignCzar() {
        for (var i = 0; i < players.length; i++) {
            czarArr[i] = players[i].czar //gets czar value of player at position i and populates array
        }   
        if (czarArr.includes(true)) {
            posi = czarArr.indexOf(true)//gets index of true in czar arr
            newPos = posi + 1 //add one to make index increase by 1 (to get next player obj)
            if (newPos >= czarArr.length){ //if newPos is > = length of czar arr
                newPos = 0 //reset new position (because we are back at 0)
                newCz = players[newPos] //gets player obj of next czar at end of array (position 0)
                if (newCz.czar === false) { //if czar is false
                    return players[newPos].czar = true //changes czar to true for next player
                } 
            } else {
                newCz = players[newPos]//gets player obj of next czar otherwise
                if (newCz.czar === false) {//if new player's czar value is false
                    return players[newPos].czar = true //changes czar to true for next player
                } 
            }
        }
    }
var result;
    function removeCzar() {
        for (var i = 0; i < players.length; i++) {
            czarArr[i] = players[i].czar //gets czar value of player at position i and populates array
        }   
        if (czarArr.includes(true)) {
            posi = czarArr.indexOf(true)//gets index of true in czar arr
            if(posi === 0) {//if posi is 0 then check for multiple instances of true
                for(let i = 0; i < czarArr.length; i++){
                    if(czarArr.indexOf(true) !== czarArr.lastIndexOf(true)){ //if the first index of true doesn't match the last index of true
                        result = true; //return true
                    } else {
                        result = false;//return false
                    }
                break;//end loop
                }
                if(result === true){//if multiple exist
                    if(newCz === players[0]){ //if new czar is player at 0
                        posi = czarArr.length - 1 //position -1 is the one to be removed
                        currentCz = players[posi]//player obj of current czar (at set index)
                        if (currentCz.czar === true) {//if czar value is true
                            return players[posi].czar = false//changes czar to false
                        }
                    } else {//if new czar is anyone but player 1/position 0
                        posi = 0 //position 0 is the one to be removed
                        currentCz = players[posi]//player obj of current czar (at true index)
                        if (currentCz.czar === true) {
                            return players[posi].czar = false//changes czar to false
                        }
                    }
                } else {
                //otherwise remove it from posi
                currentCz = players[posi]//player obj of current czar (at true index)
                    if (currentCz.czar === true) {
                        return players[posi].czar = false//changes czar to false
                    }
                }
            } else {  //otherwise remove from players at first index of true
            currentCz = players[posi]//player obj of current czar (at true index)
            if (currentCz.czar === true) {
                return players[posi].czar = false//changes czar to false
                }
            } 
        }
    }

    function findPlayerCard() {
        for (var i = 0; i < newUserArr.length; i++) {
            player = players.find(item => item.userID === newUserArr[i]); //finds the player's userID
            value = parseInt(cardNums[i]) - 1 //parses user input into index num
            pCard = player.hand[value] //gets the index number of that card in the players hand
            cardsArr.push(player.hand[value]) //creates array of chosen cards
            discard = player.hand.splice(value, 1)//creates discard pile and removes from hand
            wdeck.putOnBottomOfDeck(discard)//puts discard on bottom of deck
        }
    }

    function assignNewCards(){
        for(i = 0; i < (players.length); i++) {
            newCard = wdeck.draw(1);//draws new card
            players[i].hand.push(newCard)//adds card to player's hand
        }
    }

    function assignPts(){
        currentPts = winUser.points //gets current points
        newPts = currentPts + 1 //adds another point
        return winUser.points = newPts //updates current points to new
        }  
} while(!ptsArr.includes(pts));
    if (ptsArr.includes(pts)) {
        var pos = ptsArr.indexOf(pts)//gets index of where pts = points earned
        let plNum = players[pos].playerNum//gets player number of player at that index
        let plName = players[pos].username//gets username of player at that index
        let finalEmbed = new Discord.MessageEmbed()
        finalEmbed.setTitle("Cards Against Humanity")
        finalEmbed.setDescription(`${plNum} (aka ${plName}) has won!`)
        message.channel.send(finalEmbed);
        return;
    }
}

module.exports.help = {
    name: "cah",
    category: "fun",
    usage: `Template: PREFIXcah number-of-players number-of-points\n Example (3 players, 6 points): PREFIXcah 3 6`,
    description: "Cards Against Humanity. A party game where everyone completes a sentence or answers a question, with a card from their hand. With the card czar picking the best card each round. The first to get to the points set out wins."
};