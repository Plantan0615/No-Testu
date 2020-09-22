const sql = require("better-sqlite3")("/Users/chase/Desktop/Coding/No Testu/source/userInfo.db");
const discord = require("discord.js");
module.exports.run = async(client, message, args) => {
//dice roll functions
    function rollDie() {
        return (Math.floor(Math.random() *6) + 1)
}
    let roll1 = rollDie()
    let roll2 = rollDie()
    var rollTotal = roll1 + roll2;
    function isEven() {
   if (rollTotal % 2 == 0)
       return ("even");
    else 
       return ("odd");
   }
    var compare = isEven();
// userinput
let isValid = ["even", "odd"]
var evenOdd = (args[0]);
let wager = (args[1]);
//if no even/odd provided
    if(!evenOdd){
        message.delete({ timeout: 2000 })
        message.channel.send("Please type even or odd after the dice command.")
            .then(msg => msg.delete({timeout: 2000}))
            .catch(err => console.log(err));
        }
//if no wager
    else if(!wager){
            message.delete({ timeout: 2000 })
            message.channel.send("No wager provided. Please type the amount of Moneys you would like to bet (after even or odd)")
                .then(msg => msg.delete({timeout: 2000}))
                .catch(err => console.log(err));
            }
// if all is provided
    else if (isValid.includes(evenOdd)) {
    let userID = message.author.id
    let prepareStatement = sql.prepare("SELECT * FROM data WHERE userID = ?")
    let userXpObject= prepareStatement.get(`${userID}`)
        let newMoneys = parseInt(wager);
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
        else if (newMoneys > currentMoneys){
            message.delete({ timeout: 2000 })
            message.channel.send("Your wager is higher than the Moneys you have!")
                .then(msg => msg.delete({timeout: 2000}))
                .catch(err => console.log(err));
                return;
        }
    //win case
    if (evenOdd === compare){
        let finalMoneys = newMoneys + currentMoneys
        let prepareUpdate = sql.prepare(`UPDATE data SET userMoneys = ? WHERE userID = ?`)
        prepareUpdate.run(finalMoneys, userID);

        const winEmbed = new discord.MessageEmbed()
        .setTitle("Rolled a " + roll1 + " and a " + roll2 + ", for a Total of " + rollTotal + ", which is " + compare)
        .setDescription("You Win " + wager + " Moneys!")
        .setColor("#0f5718")
        message.channel.send(winEmbed)
    }
    //lose case
    else if (evenOdd !== compare){
        let finalMoneys = currentMoneys - newMoneys;
        let prepareUpdate = sql.prepare(`UPDATE data SET userMoneys = ? WHERE userID = ?`)
        prepareUpdate.run(finalMoneys, userID);

        const loseEmbed = new discord.MessageEmbed()
        .setTitle("Rolled a " + roll1 + " and a " + roll2 + ", for a Total of " + rollTotal + ", which is " + compare)
        .setDescription("You Lost " + wager + " Moneys!")
        .setColor("#ec2727")
        message.channel.send(loseEmbed)
        }
    }
};

module.exports.help = {
    name: "dice",
    category: "fun",
    usage: `Template: PREFIXdice even/odd wager\n Example (for even): PREFIXdice even 5\n Example (for odd): PREFIXdice odd 5`,
    description: "Type the dice command, then either even or odd, and how many Moneys you want to bet (Separated with spaces). I will roll two dice, add them together, and tell you if you've won."
}

module.exports.h2p = {
    instructions: [
        { name: "Various RPGs", value: "Type '~help rpg' for more info"},
        { name: "Starboard", value: "If there is a post that you think is funny or think should be 'immortalised', simply react to it with ⭐ and I will add the post to the Starboard channel for you. (THIS ONLY WORKS FOR TEXT AND LINKS, I will not add pictures or link previews.)"}
    ]
}