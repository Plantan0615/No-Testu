const sql = require("better-sqlite3")("/Users/chase/Desktop/Coding/No Testu/source/userInfo.db");
const discord = require("discord.js");
module.exports.run = async(client, message, args) => {
    console.log("it runs")
// roulette functions
//wheel
var wheel ={
    0: "green", 
    1: "black", 
    2: "red"
};
//pick colour
function pickColour() {
    return(wheel [Object.keys(wheel)[Math.floor(Math.random() * Object.keys(wheel).length)]])
};
var colour = pickColour();
    //declare nums
    var greenNums = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    var blackNums = [16, 5, 3, 18, 7, 14, 12, 9, 11, 25, 34, 21, 32, 23, 30, 29, 36, 27]
    var redNums = [33, 20, 22, 26, 35, 28, 37, 31, 24, 6, 17, 2, 15, 10, 19, 8, 13, 4]
        //pick black num
        if (colour === "black") {
            function pickBlackNum () {
                return blackNums[Math.floor(Math.random() * blackNums.length)]
            };
        var num = pickBlackNum();
        }
        //pick red num
        else if (colour === "red") {
            function pickRedNum () {
                return redNums[Math.floor(Math.random() * redNums.length)]
            };
        var num = pickRedNum();
        }
        //pick green num
        else if (colour === "green") {
            function pickGreenNum () {
                return greenNums[Math.floor(Math.random() * greenNums.length)]
            };
        var num = pickGreenNum();
        }
        //check if number is even
        function isEven() {
            if (num % 2 == 0)
                return ("even");
            else 
                return ("odd");
            }
        var compare = isEven();
        //check what group number is in
        function numGroup(){
            if (num <= 18)
                return ("low");
            else
                return ("high");
            }
        var group = numGroup();
//user input
let msgArray = args // sets up array
console.log(msgArray)
let guessType = msgArray[0]; //colour number even/odd- black, red, green
console.log(guessType)
let guess = msgArray[1]; //black/red even/odd low/high- a single number
console.log(guess)
let wager = msgArray [2]; //5, 10, Moneys
console.log(wager)
//valid guessType check
let isValidType = ["color", "colour", "even/odd", "numbers", "number", "black", "red", "green"]
let validType = isValidType.includes(guessType)
console.log(validType)
    //if no guess type
    if(!guessType) {
        message.delete({ timeout: 4000 })
            message.channel.send("No Guess Type Provided. Please type colour, even/odd, numbers or the colour you want to bet on (green, black, or red) after the roulette command.")
                .then(msg => msg.delete({timeout: 4000}))
                .catch(err => console.log(err));
        return;
    }
    //if no guess
    else if(!guess) {
        message.delete({ timeout: 4000 })
        message.channel.send("No Betting Option Provided. Please type red, black, even, odd, low (for numbers 1-18), high (for numbers 19-37), or the specific number you want to bet on after the guess type.")
            .then(msg => msg.delete({timeout: 4000}))
            .catch(err => console.log(err));
        return;
    }
    //if no wager
    else if(!wager) {
        message.delete({ timeout: 4000 })
        message.channel.send("No wager provided. Please type the amount of Moneys you would like to bet (after the Roulette Wheel Number/Betting Option).")
            .then(msg => msg.delete({timeout: 4000}))
            .catch(err => console.log(err));
        return;
    }
    //if invalid guess type
    else if(validType === false) {
        message.delete({ timeout: 4000 })
            message.channel.send("Invalid Guess Type. Please type colour, even/odd, numbers, or the colour you want to bet on (green, black, or red) after the roulette command.")
                .then(msg => msg.delete({timeout: 4000}))
                .catch(err => console.log(err));
        return;
    }
    //check if valid guess- if guessType is valid and guess exists
    else if(validType === true && guess) {
    var valid; //true/false variable to be assigned to
    //valid variables based on guess type
    let isValidColour = ["black", "red"]
    let isValidEvenOdd = ["even", "odd"]
    let isValidGroup = ["low", "high"]
    let isValidRed = ["33", "20", "22", "26", "35", "28", "37", "31", "24", "6", "17", "2", "15", "10", "19", "8", "13", "4"]
    let isValidBlack = ["16","5", "3", "18", "7", "14", "12", "9", "11", "25", "34", "21", "32", "23", "30", "29", "36", "27"]
    let isValidGreen = ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"]
        //check if message content is in array based on guess type
        if(guessType === "colour" || guessType === "color"){valid = isValidColour.includes(guess)} //compares guess to isValidColour returns true or false
        else if(guessType === "even/odd"){valid = isValidEvenOdd.includes(guess)}                       //checks if user input is correct
        else if(guessType === "numbers" || guessType === "number"){valid = isValidGroup.includes(guess)} //and compares it to the array of "the wheel" (more like the groups on the wheel)
        else if(guessType === "black"){valid = isValidBlack.includes(guess)}
        else if(guessType === "red"){valid = isValidRed.includes(guess)}
        else if(guessType === "green"){valid = isValidGreen.includes(guess)}
        console.log(valid);
        //if invalid guess for groups
        let groups = ["colour", "color", "number", "numbers", "even/odd"]
        if (valid === false && groups.includes(guessType)) {
            message.delete({ timeout: 4000 })
            message.channel.send("Invalid Betting Option. Please type red, black, even, odd, low (for numbers 1-18), or high (for numbers 19-37) after the guess type.")
                .then(msg => msg.delete({timeout: 4000}))
                .catch(err => console.log(err));
            return;
        }
        //if invalid num for single
        else if(valid === false){
            message.delete({timeout: 4000})
            message.channel.send("Number/Colour combination does not exist. (If you need help- Look at a Roulette Wheel and add 1 to the number you want to bet on.)")
                .then(msg => msg.delete({timeout: 4000}))
                .catch(err => console.log(err));
            return;
        }
    }
    //if all is well
    else {
        //get user moneys
        let userID = message.author.id
        let prepareStatement = sql.prepare("SELECT * FROM data WHERE userID = ?")//select all(*) from the table called data (based on the column called userID)
        let userXpObject= prepareStatement.get(`${userID}`) //creates object with * (all) the user info in, on the row with the matching userID
            let newMoneys = parseInt(wager);// parseInt turns strings into integers- we are turning the user input into a usable number
            let currentMoneys = userXpObject["userMoneys"];
            //if wager is NAN
            if(isNaN(newMoneys)){
                message.delete({ timeout: 2000 })
                message.channel.send("Your wager must be a number!")
                    .then(msg => msg.delete({timeout: 2000}))
                    .catch(err => console.log(err));
                return;
            }
            //if wager > moneys
            if (wager > currentMoneys){
                message.delete({ timeout: 2000 })
                message.channel.send("Your wager is higher than the Moneys you have!")
                    .then(msg => msg.delete({timeout: 2000}))
                    .catch(err => console.log(err));
                return;
            }
        //SINGLE GUESS
        let single = ["green", "red", "black"]
        if (single.includes(guessType)) {
            let numGuess = parseInt(msgArray[1]); //number guess
            //if numGuess is NaN
            if(isNaN(numGuess)){
                message.delete({ timeout: 2000 })
                message.channel.send("Your guess must be a number!")
                    .then(msg => msg.delete({timeout: 2000}))
                    .catch(err => console.log(err));
                return;
            }
            else {
            //if colour is right
                if (guessType === colour) {
                //win case
                    if (numGuess === num) {
                    let finalMoneys = newMoneys + currentMoneys
                    let prepareUpdate = sql.prepare(`UPDATE data SET userMoneys = ? WHERE userID = ?`)
                    prepareUpdate.run(finalMoneys, userID);

                    const winEmbed = new discord.MessageEmbed()
                    .setTitle("The ball landed on " + colour + " " + num )
                    .setDescription("You Win " + wager + " Moneys!")
                    .setColor("#0f5718")
                    message.channel.send(winEmbed)
                    }
                //lose case
                    else if(numGuess !== num){
                        let finalMoneys = currentMoneys - newMoneys;
                        let prepareUpdate = sql.prepare(`UPDATE data SET userMoneys = ? WHERE userID = ?`)
                        prepareUpdate.run(finalMoneys, userID);

                        const loseEmbed = new discord.MessageEmbed()
                        .setTitle("The ball landed on " + colour + " " + num )
                        .setDescription("You Lost " + wager + " Moneys!")
                        .setColor("#ec2727")
                        message.channel.send(loseEmbed)
                    }
                }
            //if colour is wrong- lose case
                else if (guessType !== colour){
                    let finalMoneys = currentMoneys - newMoneys;
                    let prepareUpdate = sql.prepare(`UPDATE data SET userMoneys = ? WHERE userID = ?`)
                    prepareUpdate.run(finalMoneys, userID);

                    const loseEmbed = new discord.MessageEmbed()
                    .setTitle("The ball landed on " + colour + " " + num )
                    .setDescription("You Lost " + wager + " Moneys!")
                    .setColor("#ec2727")
                    message.channel.send(loseEmbed)
                }
            }
        }
        //GROUP GUESSES
        else {
            //if colour guess
            if (guessType === "colour" || guessType === "color"){
                //win case
                if (guess === colour){
                    let finalMoneys = newMoneys + currentMoneys
                    let prepareUpdate = sql.prepare(`UPDATE data SET userMoneys = ? WHERE userID = ?`)
                    prepareUpdate.run(finalMoneys, userID);

                    const winEmbed = new discord.MessageEmbed()
                    .setTitle("The ball landed on " + colour + " " + num )
                    .setDescription("You Win " + wager + " Moneys!")
                    .setColor("#0f5718")
                    message.channel.send(winEmbed)
                }
                //lose case
                else {
                    let finalMoneys = currentMoneys - newMoneys;
                    let prepareUpdate = sql.prepare(`UPDATE data SET userMoneys = ? WHERE userID = ?`)
                    prepareUpdate.run(finalMoneys, userID);

                    const loseEmbed = new discord.MessageEmbed()
                    .setTitle("The ball landed on " + colour + " " + num )
                    .setDescription("You Lost " + wager + " Moneys!")
                    .setColor("#ec2727")
                    message.channel.send(loseEmbed)
                }
            }
            //if even odd guess
            if(guessType === "even/odd"){
                //win case
                if (guess === compare){
                    let finalMoneys = newMoneys + currentMoneys
                    let prepareUpdate = sql.prepare(`UPDATE data SET userMoneys = ? WHERE userID = ?`)
                    prepareUpdate.run(finalMoneys, userID);

                    const winEmbed = new discord.MessageEmbed()
                    .setTitle("The ball landed on " + colour + " " + num )
                    .setDescription("You Win " + wager + " Moneys!")
                    .setColor("#0f5718")
                    message.channel.send(winEmbed)
                }
                //lose case
                else{
                    let finalMoneys = currentMoneys - newMoneys;
                    let prepareUpdate = sql.prepare(`UPDATE data SET userMoneys = ? WHERE userID = ?`)
                    prepareUpdate.run(finalMoneys, userID);

                    const loseEmbed = new discord.MessageEmbed()
                    .setTitle("The ball landed on " + colour + " " + num )
                    .setDescription("You Lost " + wager + " Moneys!")
                    .setColor("#ec2727")
                    message.channel.send(loseEmbed)
                }
            }
            //if number guess
            if(guessType === "number" || guessType === "numbers"){
                //win case
                if (guess === group){
                    let finalMoneys = newMoneys + currentMoneys
                    let prepareUpdate = sql.prepare(`UPDATE data SET userMoneys = ? WHERE userID = ?`)
                    prepareUpdate.run(finalMoneys, userID);

                    const winEmbed = new discord.MessageEmbed()
                    .setTitle("The ball landed on " + colour + " " + num )
                    .setDescription("You Win " + wager + " Moneys!")
                    .setColor("#0f5718")
                    message.channel.send(winEmbed)
                }
                //lose case
                else{
                    let finalMoneys = currentMoneys - newMoneys;
                    let prepareUpdate = sql.prepare(`UPDATE data SET userMoneys = ? WHERE userID = ?`)
                    prepareUpdate.run(finalMoneys, userID);

                    const loseEmbed = new discord.MessageEmbed()
                    .setTitle("The ball landed on " + colour + " " + num )
                    .setDescription("You Lost " + wager + " Moneys!")
                    .setColor("#ec2727")
                    message.channel.send(loseEmbed)
                }
            }
        }
    }  
}

module.exports.help = {
    name: "roulette",
    category: "fun",
    usage: `Template for Groups: PREFIXroulette guess-type betting-option wager\n Example (black): PREFIXroulette colour black 5 \nExample (red): PREFIXroulette colour red 5 \n Example (even): PREFIXroulette even/odd even 5 \nExample (odd): PREFIXroulette even/odd odd 5 \nExample (numbers 1-18):PREFIXroulette numbers low 5 \nExample (numbers 19-37):PREFIXroulette numbers high 5 \nTemplate for Single Number: PREFIXroulette colour number wager \n Example (red): PREFIXroulette red 17 5 \n Example (black): PREFIXroulette black 16 5 \n Example (green): PREFIXroulette green 1 5`,
    description: "This command allows you to bet either on a single number/colour combination, or on a group of the roulette wheel. Type the roulette command followed by a guess-type (colour, even/odd, numbers, black, red, or green), a betting-option (red, black; even, odd; low, high; one number you want to bet on), and how many Moneys you'd like to bet (Separated with spaces). I will spin the wheel and tell you if you've won."
}