const cardDealer = require("card-dealer");
const Shuffle = require("shuffle");
const Discord = require("discord.js");
module.exports.run = async(client, message, args) => {
//filter and variables
const filter = (m) => {
    return ["playing", "plays", "play", "player"].includes(m.content.toLowerCase())
};
var num;
var players = [];
const userArr = []
const nameArr = []
const playArr = [];
const discardPile = [];
var orderArr = [];
var playerName, currentPID, posi;
//ask for number of players
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
    //if players provided
    else {
        num = parseInt(args[0])
        //if players and points are within limits
        if (num <= 10) {
            //send starting message
            const promptMsg = new Discord.MessageEmbed();
            promptMsg.setTitle("Welcome to Uno!")
            promptMsg.setDescription(`You have choosen ${num} players. \nAll of you need to reply with "playing" to continue. \nAfter you all reply you should each receive a DM, and a message will be sent to this channel. \nBetween turns the relevant messages will either be edited or deleted.`)
            await message.channel.send(promptMsg);
            //get userIDs of players
            //collect messages
            let data = null
            let collected = await message.channel.awaitMessages(filter, {
                max: num,
                time: 300000,
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
        }
    }
    //call variables function
    createVariables();
    //get uno deck
    const getdeck = cardDealer.unoDeck
    const dealer = new cardDealer.Dealer(getdeck)
    const unoDeck = dealer._deck
    //shuffle deck
    var deck = Shuffle.shuffle({
        deck: unoDeck
    });
    //deal 7 cards
    deck.deal(7, playArr)
    //call structure function
    createStructure();
    //get first card
    var firstDiscard = deck.draw();
    //check first discard
    checkFirstCard();
    //check player
    checkPlayer();
    //send cards via DM
    var cDM = [];
    for (let i = 0; i < players.length; i++) {
        if (players[i].playing === false) {
            var cardconcat;
            var handEmbed = new Discord.MessageEmbed;
            handEmbed.setTitle(`Uno!`);
            handEmbed.setDescription(`You are ${players[i].playerNum}. It is ${playerName}'s turn.`);
            for (let j = 0; j < players[i].hand.length; j++) {
                let fName = "Card " + (j + 1).toString()
                if (players[i].hand[j].rank != undefined) {
                    cardconcat = players[i].hand[j].color + " " + players[i].hand[j].rank
                } else {
                    cardconcat = players[i].hand[j].color 
                }
                handEmbed.addField(fName, cardconcat)
            }
        } else {
            var cardconcat;
            var handEmbed = new Discord.MessageEmbed;
            handEmbed.setTitle(`Uno!`);
            handEmbed.setDescription(`You are ${players[i].playerNum}. It is your turn.`);
            for (let j = 0; j < players[i].hand.length; j++) {
                let fName = "Card " + (j + 1).toString()
                if (players[i].hand[j].rank != undefined) {
                    cardconcat = players[i].hand[j].color + " " + players[i].hand[j].rank
                } else {
                    cardconcat = players[i].hand[j].color
                }
                handEmbed.addField(fName, cardconcat)
            }
        }
        let user = client.users.cache.get(`${userArr[i]}`)
        cDM[i] = await user.send({
            embed: handEmbed
        })
    }
    //send message with top discard
    const discardEmbed = new Discord.MessageEmbed();
    discardEmbed.setTitle(`Uno!`);
    discardEmbed.setDescription(`It is ${playerName}'s turn (they are ${currentPNum}). \n The top card in the discard pile is:`)
    if (discardPile[0].rank != undefined) {
        discardEmbed.addFields(
            {name: `Colour:`, value: `${discardPile[0].color}`}, 
            {name: `Number/Type:`, value: `${discardPile[0].rank}`}, 
            {name: `What would you like to do?`, value: `React with 📤 to play a card (get one out of your hand). \n React with 📥 to draw a card (put another one in your hand).`}
        )
    }
    else {
        discardEmbed.addFields(
            {name: `Colour:`, value: `N/A`},
            {name: `Number/Type:`, value: `${discardPile[0].color}`}, 
            {name: `What would you like to do?`, value: `React with 📤 to play a card (get one out of your hand). \n React with 📥 to draw a card (put another one in your hand).`}
        )
    }
    //send embed
    let msg = await message.channel.send({embed: discardEmbed})
    //react to message
    await msg.react("📤")
    await msg.react("📥")
//FUNCTIONS
    //create player variables
    function createVariables() {
        for (var i = 0; i < userArr.length; i++) {
            var str = "player" + (i + 1).toString() + "= []"; //creates string per player
            playArr[i] = eval(str) //creates variable from string
        }
    }
    //players structure
    function createStructure() {
        for (var i = 0; i < userArr.length; i++) {
            players[i] = {
                playerNum: "player" + (i + 1).toString(),
                username: nameArr[i],
                userID: userArr[i],
                hand: playArr[i],
                playing: false
            };
        } 
    }
    //check first card
    function checkFirstCard() {
        if (firstDiscard.color === "wild") { //if colour is wild- return to draw pile
            deck.putOnBottomOfDeck(firstDiscard); //return to deck
            firstDiscard = deck.draw(); //draw another card
            checkFirstCard(); //check card
        } 
        else if (firstDiscard.rank === "draw-two"){  //if rank is draw 2 - assign player1 2 more cards
            let draw2 = deck.draw(2)//returns array of card objects
            for(let i = 0; i < draw2.length; i++){
                players[0].hand.push(draw2[i]); //assign player 1 two cards
            }
            discardPile.unshift(firstDiscard) //add to discard
            firstDiscard = deck.draw(); //draw another card
            checkFirstCard(); //check card
        } 
        else if (firstDiscard.rank === "reverse") { //if reverse card- order reversed
            discardPile.unshift(firstDiscard)//add to discard
            let pos = players.length - 1 //position is -1
            return players[pos].playing = true //last player's playing value is true
        } 
        else if (firstDiscard.rank === "skip") { //if skip card- player 2 starts true
            discardPile.unshift(firstDiscard) //add to discard
            return players[1].playing = true //player2's playing value is true
        } 
        else { //else assign player 1 playing status
            discardPile.unshift(firstDiscard) //add to discard
            return players[0].playing = true //player 
        }
    }
    //check player function
    function checkPlayer() {
        for (var i = 0; i < players.length; i++) {
            orderArr[i] = players[i].playing //gets player value of player at position i and populates array
        }
        if (orderArr.includes(true)) {
            posi = orderArr.indexOf(true)//gets index of true in player arr
            currentPNum = players[posi].playerNum //gets player number
            playerName = players[posi].username //gets username of current player (at true index)
            currentPID = players[posi].userID //user ID of current player (at true index)
        }
    }

do {
//LOOP STARTS HERE
var lengthArr = [];
var orderArr = [];
var playerName, currentPID, posi;
var turnTaken;
var newRank, newColour;
var newCDM = []
var mess, promptMess, cardExMess, cardExErr, cardExErr2;
    //filter
    function filterReact(reaction, user) { 
        if (user.bot) return; 
        return ["📤", '📥'].includes(reaction.emoji.name) && user.id === currentPID;
    }
    //await reactions
    let collectedReact = await msg.awaitReactions(filterReact, {
        max: 1, 
        time: 300000, 
        errors: ["time"]
    }) 
    .catch(er => {
        data = er
    })
    if (collectedReact != undefined) {
        data = collectedReact
    }
    let collectRArr = data.array();
    var emojiNameArr = [];
    for (let i = 0; i < collectRArr.length; i++) {
        emojiNameArr.push(collectRArr[i].emoji.name)
    }
  
    var emojiName = emojiNameArr[0]
    if (emojiName === "📥") {// if drawing a card
        let newCard = deck.draw(1)
        let player = players.find(item => item.userID === currentPID)
        player.hand.push(newCard)
        newColour = discardPile[0].color
        newRank = discardPile[0].rank
        turnTaken = false
       mess = await message.channel.send("You have chosen to draw another card. Moving on... \nDeleting input message, updating game message, and removing user reaction... Please wait until this is done before continuing.")
    } else if (emojiName === "📤") { //if playing a card
        //send prompt message
        promptMess =  await message.channel.send("You have chosen to play a card. \nType the colour followed by the number/type (draw-two and draw-four need to have dashes as shown). \nIf playing a wild (or wild draw-four) the card colour should be what you want to assign.")
        //filter
        var cardArr
        var colours = ["red", "yellow", "blue", "green"]
        var typesNums = ["wild", "draw-four", "draw-two", "skip", "reverse", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
        const cardFilter = (msg) => {
            cardArr = msg.content.toLowerCase().split(" ");
            return colours.includes(cardArr[0]) && cardArr.length === 2 && typesNums.includes(cardArr[1]) && currentPID === msg.author.id
        };
        //await message with card
        let collectedM = await message.channel.awaitMessages(cardFilter, {
            max: 1,
            time: 300000,
            errors: ["time"]
        }).catch(er => {
            data = er
        })
        if (collectedM != undefined) {
            data = collectedM
        }
        let collectMArr = data.array();
        //get user input in array
        var inputArr = collectMArr[0].content.toLowerCase().split(" ");
        let chosenColour = inputArr[0]
        let chosenTypesNums = inputArr[1]
        //find user hand
        let player = players.find(item => item.userID === currentPID)
        let hand = player.hand
        var cardArr = [];
        var userDiscard;
        turnTaken = true
        checkifCardExists();
        //check if card exists in current player's hand
        function checkifCardExists() {
            for (i = 0; i < hand.length; i++) { //create array of cards that match (colour only)
                if (chosenTypesNums === "wild" || chosenTypesNums === "draw-four" && hand[i].color === "wild") { //check if card is a wild
                    cardArr.push(hand[i]) //push card into new array
                } else if (hand[i].color === chosenColour) {
                    cardArr.push(hand[i]) //push card into new array
                } 
            }
            if (cardArr.length >= 1) { //if length is greater than or equal to 1 look for matching rank
                for (i = 0; i < hand.length; i++) { //loop through user hand
                    if (chosenTypesNums === "wild" || chosenTypesNums === "draw-four" && cardArr.includes(hand[i]) && hand[i].color === "wild") { 
                        userDiscard = player.hand.splice(i, 1)
                    } else if (hand[i].rank === chosenTypesNums && cardArr.includes(hand[i])) { //if colour and rank match
                        userDiscard = player.hand.splice(i, 1) //remove from user's hand
                    }
                }
                if(userDiscard !== undefined) {
                    cardExMess = message.channel.send("At least one match found. Checking if card matches discard...")
                    checkifCardsMatch();
                    
                } else if (userDiscard === undefined) { //if no matches
                    message.channel.send ("No matches found. Drawing one card. \nDeleting input messages in five seconds, updating game message, and removing user reaction... Please wait until this is done before continuing.")
                    let newCard = deck.draw(1)
                    player = players.find(item => item.userID === currentPID)
                    player.hand.push(newCard)
                }
            } else { //if no matching card (colour)- draw a card
                message.channel.send ("No matches found. Drawing one card. \nDeleting input messages in five seconds, updating game message, and removing user reaction... Please wait until this is done before continuing.")
                let newCard = deck.draw(1)
                player = players.find(item => item.userID === currentPID)
                player.hand.push(newCard)
            } 
        }
        //check if card matches current discard
        var colour, rank, userRank, userColour;
        var wildMsg, bothMatchMsg, colourMatchMsg, rankMatchMsg, matchErrMsg
        function checkifCardsMatch() {
                //get user input
                let chosenColour = inputArr[0]
                let chosenTypesNums = inputArr[1]
                //get discard info
                if (userDiscard === undefined) {
                    colour = discardPile[0].color
                    rank = discardPile[0].rank
                } else if (discardPile[0].rank === "draw-four") { // if wild (has only colour), user input should be colour
                    colour = newColour
                    rank = discardPile[0].rank
                } else if (discardPile[0].color === "wild") { //if wild draw-four- rank is rank, colour is user input
                    colour = newColour
                    rank = discardPile[0].color
                } else { //else colour is colour, rank is rank
                    colour = discardPile[0].color
                    rank = discardPile[0].rank
                }
                //set up comparisons
                if (userDiscard === undefined) {
                userColour = discardPile[0].color
                userRank = discardPile[0].rank
                } else if (chosenTypesNums === "wild") { // if wild (has only colour), user input should be colour
                userColour = discardPile[0].color
                userRank = discardPile[0].rank
                } else if (chosenTypesNums === "draw-four") { //if wild draw-four- rank is rank, colour is user input
                userColour = discardPile[0].color
                userRank = userDiscard[0].rank
                } else { //else colour is colour, rank is rank
                userColour = userDiscard[0].color
                userRank = userDiscard[0].rank
                }
            //if both match/exist- do actual checks
            if (chosenTypesNums === "wild" || chosenTypesNums === "draw-four") {
                discardPile.unshift(userDiscard[0])
                wildMsg = message.channel.send (`Card is a wild card! ${chosenColour} is the new colour. \nDeleting input messages in five seconds, updating game message, and removing user reaction... Please wait until this is done before continuing.`)
            }             
            else if (colour === userColour && rank === userRank) {
                discardPile.unshift(userDiscard[0])
                bothMatchMsg = message.channel.send ("Card colours and numbers/types match! \nDeleting input messages in five seconds, updating game message, and removing user reaction... Please wait until this is done before continuing.")
            }
            else if(colour === userColour) { //if colours match
                discardPile.unshift(userDiscard[0])
                colourMatchMsg = message.channel.send ("Card colours match! \nDeleting input messages in five seconds, updating game message, and removing user reaction... Please wait until this is done before continuing.")
            }
            else if(rank === userRank){ //if ranks match
                discardPile.unshift(userDiscard[0])
                rankMatchMsg = message.channel.send ("Card numbers/types match! \nDeleting input messages in five seconds, updating game message, and removing user reaction... Please wait until this is done before continuing.")
            }
            //if neither match
            else {
                matchErrMsg = message.channel.send ("Card does not match discard. \nReplacing current card, and drawing another card. \nDeleting input messages in five seconds, updating game message, and removing user reaction... Please wait until this is done before continuing.")
                let oldCard = userDiscard[0]
                let newCard = deck.draw(1)
                player = players.find(item => item.userID === currentPID)
                player.hand.push(oldCard, newCard)
            }
        }
        //create variable for valid card
        var newDiscard = discardPile[0]
        //check new card (for assigning cards to players/ getting info for embed)
        checkNewCard();
        //check the new top of discard pile (for creating message embed)
        function checkNewCard() {
            let chosenColour = inputArr[0]
            if (newDiscard.color === "wild") { // if wild (has only colour), user input should be colour
                newColour = chosenColour
                newRank = newDiscard.color
            } else if (newDiscard.rank === "draw-four") { //if wild draw-four- rank is rank, colour is user input, next player draws 4
                newColour = chosenColour
                newRank = newDiscard.rank
            } else if (newDiscard.rank === "draw-two"){  //if rank is draw 2 - colour is colour, rank is rank, next player draws 2
                newRank = newDiscard.rank
                newColour = newDiscard.color
            } else if (newDiscard.rank === "reverse") { //if reverse card- order reversed (current - 1), colour is colour, rank is rank
                newRank = newDiscard.rank
                newColour = newDiscard.color
            } else if (newDiscard.rank === "skip") { //if skip card- next player skipped- colour is colour, rank is rank
                newRank = newDiscard.rank
                newColour = newDiscard.color
            } else { //else colour is colour, rank is rank
                newColour = newDiscard.color
                newRank = newDiscard.rank
            }
        }
    }
    //check number of cards left in hands of all players
    checkPoints();
    //check if order is reversed
    var reverseArr = []
    var status;
    checkReversed();
    statusArr = [];
    var newPos;
    if (turnTaken === true) { //if card has been played
        if (status === false) {//if reverse status is false
            if (discardPile[0].rank === "skip") { //if skip card
                changeNum = 2
                assignPlaying();
                removePlayer();

            } else { //if any other card
                changeNum = 1
                assignPlaying();
                removePlayer();
            }
        } else {//if reverse status is true
            if (discardPile[0].rank === "skip") { //if skip card
                changeNum = -2
                assignPlaying();
                removePlayer();
            } else { //if any other card
                changeNum = -1
                assignPlaying();
                removePlayer();
            }
        }
    } else if (turnTaken === false) { //if another card has been drawn
        if (status === false) {//if reverse status is false
            changeNum = 1
            assignPlaying();
            removePlayer();
        } else { //if reverse status is true
            changeNum = -1
            assignPlaying();
            removePlayer();
        }
    } console.log (players)
    //remove user reaction
    const userReactions = msg.reactions.cache.filter(react => {
        return react.users.cache.has(currentPID)
      })
    const userReact = userReactions.first()
      if (userReact != undefined) {
        await userReact.users.remove(currentPID)
      }
    //delete unneeded messages
    //            userDiscard === undefined
    //            cardArr.length >= 1
    if (turnTaken === false) {//if drawing a card 
        mess.delete({ timeout: 5000 })//delete drawing card message
    } else if (turnTaken === true) {//if playing a card
        if (promptMess && cardArr.length === 0){ //if card doesn't exist- prompt message, user message, card doesn't exist message
            promptMess.delete({ timeout: 5000 })//delete prompt message
            setTimeout(deleteMessages, 5000) //delete other messages (2)
        } else if (promptMess && userDiscard === undefined) { //if card doesn't match- prompt message, user message, card exists message, card doesn't match message
            promptMess.delete({ timeout: 5000 })//delete prompt message
            setTimeout(deleteMessages, 5000)//delete other messages (3)
        } else if (promptMess) { //if card exists and matches- prompt message, user message, card exists message, card matches message
            promptMess.delete({ timeout: 5000 })//delete prompt message
            setTimeout(deleteMessages, 5000)//delete all other messages
        } else {
            console.log("trouble deleting messages.")
        }
    }
//delete messages
function deleteMessages() {
    if (promptMess && cardArr.length === 0){
        message.channel.bulkDelete(2)
    } else if (promptMess && userDiscard === undefined){
        message.channel.bulkDelete(3)
    } else if (promptMess){
        message.channel.bulkDelete(3)
    }
}
//check card again
    //create variable for valid card
    var newDiscard = discardPile[0]
    //check new card (for assigning cards to players/ getting info for embed)
    checkNewCard();
    //check player again
    checkPlayer(); //updates currentPID, currentPNum, and playerName
    //edit message in channel
    const oldEmbed = msg.embeds.length >= 1 ? msg.embeds[0] : null
    const newEmbed = oldEmbed != null ? new Discord.MessageEmbed(oldEmbed) : new Discord.MessageEmbed()
    newEmbed.fields = []
    //embed details
    newEmbed.setTitle(`Uno!`);
    newEmbed.setDescription(`It is ${playerName}'s turn (they are ${currentPNum}). \n The top card in the discard pile is:`)
    if (newColour !== undefined && newRank !== undefined){
        newEmbed.addFields(
            {name: `Colour:`, value: `${newColour}`},
            {name: `Number/Type:`, value: `${newRank}`}, 
            {name: `What would you like to do?`, value: `React with 📤 to play a card (get one out of your hand). \n React with 📥 to draw a card (put another one in your hand).`}
        )
    }     
    else if (discardPile[0].rank !== undefined) {
        newEmbed.addFields(
            {name: `Colour:`, value: `${discardPile[0].color}`}, 
            {name: `Number/Type:`, value: `${discardPile[0].rank}`}, 
            {name: `What would you like to do?`, value: `React with 📤 to play a card (get one out of your hand). \n React with 📥 to draw a card (put another one in your hand).`}
        )
    } 
    else {
        newEmbed.addFields(
            {name: `Colour:`, value: `N/A`}, 
            {name: `Number/Type:`, value: `${discardPile[0].color}`}, 
            {name: `What would you like to do?`, value: `React with 📤 to play a card (get one out of your hand). \n React with 📥 to draw a card (put another one in your hand).`}
        )
    }
    let newCurrent = await msg.edit({embed: newEmbed});
    //edit DMs
    for (let i = 0; i < players.length; i++) {
        const oldDM = cDM[i].embeds.length >= 1 ? cDM[i].embeds[0] : null
        const newDM= oldDM != null ? new Discord.MessageEmbed(oldDM) : new Discord.MessageEmbed()
        newDM.fields = []
        if (players[i].playing === false) {
            var cardconcat;
            var handEmbed = new Discord.MessageEmbed;
            newDM.setTitle(`Uno!`);
            newDM.setDescription(`You are ${players[i].playerNum}. It is ${playerName}'s turn.`);
            for (let j = 0; j < players[i].hand.length; j++) {
                let fName = "Card " + (j + 1).toString()
                if (players[i].hand[j].rank != undefined) {
                    cardconcat = players[i].hand[j].color + " " + players[i].hand[j].rank
                } else {
                    cardconcat = players[i].hand[j].color 
                }
                newDM.addField(fName, cardconcat)
            }
        } else {
            var cardconcat;
            var handEmbed = new Discord.MessageEmbed;
            newDM.setTitle(`Uno!`);
            newDM.setDescription(`You are ${players[i].playerNum}. It is your turn.`);
            for (let j = 0; j < players[i].hand.length; j++) {
                let fName = "Card " + (j + 1).toString()
                if (players[i].hand[j].rank != undefined) {
                    cardconcat = players[i].hand[j].color + " " + players[i].hand[j].rank
                } else {
                    cardconcat = players[i].hand[j].color
                }
                newDM.addField(fName, cardconcat)
            }
        }
        newCDM[i] = await cDM[i].edit({embed: newDM});
    }
    //FUNCTIONS
    //check player function
    function checkPlayer() {
        for (var i = 0; i < players.length; i++) {
            orderArr[i] = players[i].playing //gets player value of player at position i and populates array
        }
        if (orderArr.includes(true)) {
            posi = orderArr.indexOf(true)//gets index of true in player arr
            currentPNum = players[posi].playerNum //gets player number
            playerName = players[posi].username //gets username of current player (at true index)
            currentPID = players[posi].userID //user ID of current player (at true index)
        }
    }
    //check number of cards in each hand
    function checkPoints () {
        for(i = 0; i < players.length; i++) {
            let num = players[i].hand.length
            lengthArr.push(num)
        } 
    }
    //check if reverse is true- for assigning next player
    function checkReversed(){
        for (let i = 0; i < discardPile.length; i++) { //populate reverseArr with booleans
            if (discardPile[i].rank === "reverse") {
                reverseArr[i] = true
            } else {
                reverseArr[i] = false
            }
        } var result = 0;
        for(let i = 0; i < reverseArr.length; i++){ //increment result each time there is an instance of true
            if (reverseArr[i] === true) {
                result++;
                return result;
            }
        } 
        if (result % 2 === 0) {//check if result is even (if even, status is false bc one cancels out the other)
            return status = false;
        } else {
            return status = true;
        }
    }
    //assign next player
    var newCards = [];
    function assignPlaying() {
        for (var i = 0; i < players.length; i++) {
            statusArr[i] = players[i].playing //gets status value of player at position i and populates array
        }   
        if (statusArr.includes(true)) {
            posi = statusArr.indexOf(true)//gets index of true in status arr
            newPos = posi + changeNum //add current index and changenum (2 or -2 for skip, 1 or -1 otherwise)
             if (status === false && newPos > statusArr.length && discardPile[0].rank === "skip") { //normal order- num > length- skip
                newPos = 1 //new position is 1
                newPlayer = players[newPos] //get player object at new position
                 if (newPlayer.playing === false) { //if playing is false
                    return players[newPos].playing = true //changes playing to true for next player
                } 
            } else if (status === true && newPos < -1 && discardPile[0].rank === "skip") { //reverse order- num > length - skip
                newPos = statusArr.length-2 //new position is length -2
                newPlayer = players[newPos] //get player object at new position
                if (newPlayer.playing === false) { //if playing is false
                    return players[newPos].playing = true //changes playing to true for next player
                }
            } else if (status === false && newPos === statusArr.length && discardPile[0].rank === "skip") { //normal order- num = length- skip
                newPos = 0 //new position is 0
                newPlayer = players[newPos] //get player object at new position
                if (newPlayer.playing === false) { //if playing is false
                    return players[newPos].playing = true //changes playing to true for next player
                } 
            }  else if (status === true && newPos === -1 && discardPile[0].rank === "skip") { //reverse order- num = length - skip
                newPos = statusArr.length-1 //new position is length-1
                newPlayer = players[newPos] //get player object at new position
                if (newPlayer.playing === false) { //if playing is false
                    return players[newPos].playing = true //changes playing to true for next player
                } 
            } else if (status === false && newPos >= statusArr.length){ //normal order- num >= length- normal
                newPos = 0  //new position is 0
                newPlayer = players[newPos] //get player object at new position
                if (discardPile[0].rank === "draw-two" || discardPile[0].rank === "draw-four") {
                    assignCards();
                } if (newPlayer.playing === false) { //if playing is false
                    return players[newPos].playing = true //changes playing to true for next player
                } 
            } else if (status === true && newPos === -1 || newPos < -1) { //reverse order- num >= length - normal
                newPos = statusArr.length-1 //new position is length -1
                newPlayer = players[newPos] //get player object at new position
                if (discardPile[0].rank === "draw-two" || discardPile[0].rank === "draw-four") {
                    assignCards();
                } if (newPlayer.playing === false) { //if playing is false
                    return players[newPos].playing = true //changes playing to true for next player
                } 
            } else { //if normal and in middle of array
                newPlayer = players[newPos]//gets player obj of next player otherwise
                if (discardPile[0].rank === "draw-two" || discardPile[0].rank === "draw-four") {
                    assignCards();
                } if (newPlayer.playing === false) {//if new player's player value is false
                    return players[newPos].playing = true //changes player to true for next player
                }
            }
        }
    }
    function assignCards() {
        if (discardPile[0].rank === "draw-two") {
            newCards = deck.draw(2)
            for(let i = 0; i < newCards.length; i++){
                players[newPos].hand.push(newCards[i]); //assign player 1 two cards
            }
        } else if (discardPile[0].rank === "draw-four") {
            newCards = deck.draw(4)
            for(let i = 0; i < newCards.length; i++){
                players[newPos].hand.push(newCards[i]); //assign next player 4 cards
            }
        }
    }
    function removePlayer(){
        for (var i = 0; i < players.length; i++) {
            statusArr[i] = players[i].playing //gets playing value of player at position i and populates array
        }
        for(let i = 0; i < statusArr.length; i++){
            if(statusArr.indexOf(true) !== statusArr.lastIndexOf(true)){ //if the first index of true doesn't match the last index of true
                result = true; //return true
            } else {
                result = false;//return false
            }
        break;//end loop
        }  
        //&& newPos !== undefined
        if(result === true){
            if (status === false && newPos > statusArr.length && discardPile[0].rank === "skip") {//if skip, noraml order, new position larger than length
                oldPos = statusArr.length -1 //new position is -1
                oldPlayer = players[oldPos] //get player object at new position
                 if (oldPlayer.playing === true) { //if playing is false
                    return players[oldPos].playing = false //changes playing to true for next player
                }
            } else if (status === true && newPos < -1 && discardPile[0].rank === "skip") { //if skip, reverse order, new position less than minus 1
                oldPos = 0 //new position is 0
                oldPlayer = players[oldPos] //get player object at new position
                 if (oldPlayer.playing === true) { //if playing is false
                    return players[oldPos].playing = false //changes playing to true for next player
                }
            } else if (status === false && newPos === statusArr.length && discardPile[0].rank === "skip") {//if skip, normal order, new position === length
                oldPos = statusArr.length -2 //new position is -2
                oldPlayer = players[oldPos] //get player object at new position
                 if (oldPlayer.playing === true) { //if playing is false
                    return players[oldPos].playing = false //changes playing to true for next player
                }
            } else if (status === true && newPos === -1 && discardPile[0].rank === "skip") { //if skip, reverse order, new position === -1
                oldPos = 1 //new position is 1
                oldPlayer = players[oldPos] //get player object at new position
                 if (oldPlayer.playing === true) { //if playing is false
                    return players[oldPos].playing = false //changes playing to true for next player
                }
            } else if (status === false && newPos >= statusArr.length){ //normal order, end of array
                oldPos = statusArr.length -1 //new position is -1
                oldPlayer = players[oldPos] //get player object at new position
                if (oldPlayer.playing === true) { //if playing is false
                    return players[oldPos].playing = false //changes playing to true for next player
                }
            } else if (status === true && newPos <= -1) {//reverse order, end of array
                oldPos = 0 //new(old) position is new position 0
                oldPlayer = players[oldPos] //get player objec at new position
                if (oldPlayer.playing === true) { //if playing is false
                    return players[oldPos].playing = false //changes playing to true for next player
                }
            } else if (newPos !== 0) {
                oldPos = newPos -1 //new(old) position is new position -1
                oldPlayer = players[oldPos] //get player objec at new position
                if (oldPlayer.playing === true) { //if playing is false
                    return players[oldPos].playing = false //changes playing to true for next player
                }
            } else if (newPos === 0) {
                oldPos = statusArr.length -1 //new(old) position is new position -1
                oldPlayer = players[oldPos] //get player objec at new position
                if (oldPlayer.playing === true) { //if playing is false
                    return players[oldPos].playing = false //changes playing to true for next player
                }
            }
        }
    }

    //check the new top of discard pile (for creating message embed)
    function checkNewCard() {
        if (turnTaken === true) {
            let chosenColour = inputArr[0]
            if (newDiscard.rank === "draw-four") { //if wild draw-four- rank is rank, colour is user input, next player draws 4
                newColour = chosenColour
                newRank = newDiscard.rank
            } 
            else if (newDiscard.color === "wild") { // if wild (has only colour), user input should be colour
                newColour = chosenColour
                newRank = newDiscard.color
            }
            else if (newDiscard.rank === "draw-two"){  //if rank is draw 2 - colour is colour, rank is rank, next player draws 2
                newRank = newDiscard.rank
                newColour = newDiscard.color
            } 
            else if (newDiscard.rank === "reverse") { //if reverse card- order reversed (current - 1), colour is colour, rank is rank
                newRank = newDiscard.rank
                newColour = newDiscard.color
            } 
            else if (newDiscard.rank === "skip") { //if skip card- next player skipped- colour is colour, rank is rank
                newRank = newDiscard.rank
                newColour = newDiscard.color
            } 
            else { //else colour is colour, rank is rank
                newColour = newDiscard.color
                newRank = newDiscard.rank
            }
        } else {
            newColour = discardPile[0].color
            newRank = discardPile[0].rank
        }
    }
} while (!lengthArr.includes(1))
    if (lengthArr.includes(1)) {
        message.channel.send(`Someone has one card left!! Game ending...`) // CHANGE THIS LATER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }
}

//NEW PLANS
//GAME START
    //user sends command message- done
    //get number of players from args- done
        //if no args send error message- done
    //check less than 10 players- done
        //if valid player number- done
            //send prompt message- done
            //have users send playing- await/collect messages - done
            //create user and name arrays- done
        //if too many players send error message and return - done
    //create variables- done
    //get uno deck- done
    //shuffle uno deck - done
    //deal each player 7 cards- done
    //create playersArr with user objects -done
    //draw first discard -done
    //check if first card is valid/set playing to true for first round/create discard pile- done
        //if wild/ wild draw 4- return to draw pile- done
        //if draw 2- assign player 1 2 cards and draw another- done
        //if reverse card- order of play has changed to -1 - done
        //if skip card-player 1 loses turn and player 2 plays- done
    //check player (look for instance of true) and get username/playernum/userID- done
    //send cards via DM- done
    //send message with first discard to channel- done
    //react to message (bot) - done
//LOOP STARTS HERE
    //await reaction from current player - done
    //convert emoji to array- done
    //get emoji name- done
        //if emoji name is inbox draw a card- done
            //draw a card- done
            //find player hand- done
            //push card into hand array- done
        //if emoji name is outbox play a card - done
            //send prompt message- done
            //await user response - done
            //find player hand - done
            //check that card is in player hand - done
                //remove card from player hand- done
            //check that card matches discard in some way - done
            //add card to discard pile - done
        //check number of cards in everyone's hands- done
        //check top discard (gets cards for draws and gets info for embed)- done
                //if draw 2- assign next player 2 cards- done
                //if reverse card- order of play has changed to -1 - done
                //if skip card- player loses turn and next player plays -done
                //if wild- change colour to any colour - done
                //if wild draw 4- change colour and have next player draw 4- done
        //check if order is reversed or not- done
    //if reverse status is false- done
        //assign next player- done
            //if skip- done
            //if draw cards (2 or 4)- done
            //if anything else- done
        //remove first player- done
    //if reverse status is true- done
        //assign next player- done
            //if skip- done
            //if draw cards (2 or 4)-done
            //if anything else- done
        //remove first player - done
        //remove reactions- done
        //delete -done
        //check player again -done
        //edit message in channel -done
        //edit DMs -done
//LOOP ENDS HERE -done
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
    usage: `Command Template: PREFIXuno number-of-players\n Command Example: PREFIXuno 3 \n Card Example (number card): red 9 \n Card Example (draw two): red draw-two \n Card Example (reverse): red reverse\n Card Example (skip): red skip \n Card Example (wild): red wild \n Card Example (wild draw four): red wild-draw-four`,
    description: "Uno is a game where you try to get rid of all your cards first. You discard cards that matche the top of the discard pile (in terms of number, colour, or word)."
};