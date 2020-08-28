const discord = require("discord.js");
module.exports.run = async(client, message, args) => {
var rollType = message.content.substring(9);
let isValid = ["4", "6", "8", "10", "12", "20", "100"]
let valid = isValid.includes(rollType);
    if (!rollType){
        message.delete({ timeout: 2000 })
        message.channel.send("Please type 4, 6, 8, 10, 12, 20, or 100 after the dndRoll command")
            .then(msg => msg.delete({timeout: 2000}))
            .catch(err => console.log(err));
            return;
    }
    else if(valid === false){
        message.delete({ timeout: 2000 })
        message.channel.send("Please type 4, 6, 8, 10, 12, 20, or 100 after the dndRoll command")
            .then(msg => msg.delete({timeout: 2000}))
            .catch(err => console.log(err));
            return;
    }
    else if (valid === true){
        let rollNum = parseInt(rollType)
        function rollDie() {
            return (Math.floor(Math.random() *rollNum) + 1)}
    let roll = rollDie();
    const rollEmbed = new discord.MessageEmbed()
        .setTitle("Rolled a " + roll)
        .setColor("#271285");
        message.channel.send(rollEmbed);
    }   
};

module.exports.help = {
    name: "dndroll",
    category: "fun",
    usage: `Template: PREFIXdndroll number\n Examples: PREFIXdndroll 4\nPREFIXdndroll 6\nPREFIXdndroll 8\nEtcetera..`,
    description: "Type the roll command and then 4, 6, 8, 10, 12, 20, or 100. I will give you a random number. Please use this command in dnd-chat."
}