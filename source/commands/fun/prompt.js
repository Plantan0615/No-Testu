const sql = require("better-sqlite3")("/Users/chase/Desktop/Coding/No Botto/source/userInfo.db");
const discord = require("discord.js");
module.exports.run = async(client, message, args) => {
let category = message.content.toLowerCase().substring(8);
let isValid = ["animals", "body parts", "buildings", "expressions", "food", "famous buildings", "landmarks", "long", "plants", "person adjectives"]
let valid = isValid.includes(category);
//NO CATEGORY
if(!category){
    message.delete({timeout: 5000})
    message.channel.send("No Category Provided. Please type animals, body parts, buildings, expressions, famous buildings, food, landmarks, long, person adjectives, or plants after the prompt command.")
    .then(msg => msg.delete({timeout: 5000}))
    .catch(console.error);
    return;
    }
// INVALID CATEGORY
else if(valid === false){
    message.delete({timeout: 5000})
    message.channel.send("Invalid Category. Please type animals, body parts, buildings, expressions, famous buildings, food, landmarks, long, person adjectives, or plants after the prompt command.")
    .then(msg => msg.delete({timeout: 5000}))
    .catch(console.error);
    return;
    }
//IF CATEGORY IS LONG PROMPT
else if (valid === true){
    if (category === "long"){ 
    let prepStatement = sql.prepare(`SELECT name FROM prompts WHERE category = ?`)
    let vObj = prepStatement.all("verb");
    let nObj = prepStatement.all("noun");
    let aObj = prepStatement.all("adjective");
        function randomV() {
        return(vObj [Object.keys(vObj)[Math.floor(Math.random() * Object.keys(vObj).length)]])
        };
        function randomN() {
        return(nObj [Object.keys(nObj)[Math.floor(Math.random() * Object.keys(nObj).length)]])
        };
        function randomA() {
        return(aObj [Object.keys(aObj)[Math.floor(Math.random() * Object.keys(aObj).length)]])
        };
    var response1 = randomV(vObj);
    var response2 = randomN(nObj);
    var response3 = randomA(aObj);
        const promptEmbed = new discord.MessageEmbed()
        .setTitle(response3.name + ", " + response2.name + ", " + response1.name)
        .setColor("#3ee2d8");
        message.channel.send(promptEmbed);
    }
//IF CATEGORY EXISTS AND IS VALID
    else{
    let prepStatement = sql.prepare(`SELECT * FROM prompts WHERE category = ?`)
    let obj = prepStatement.all(category);
        function random() {
        return(obj [Object.keys(obj)[Math.floor(Math.random() * Object.keys(obj).length)]])
        };
    var response = random();
        const promptEmbed = new discord.MessageEmbed()
        .setTitle(response.name)
        .setColor("#3ee2d8");
        message.channel.send(promptEmbed);
    }
}
};

module.exports.help = {
    name: "prompt",
    category: "fun",
    usage: `Template: PREFIXprompt category\n Examples: PREFIXprompt animals\nPREFIXprompt body parts\nPREFIXprompt buildings\nPREFIXprompt expressions \nPREFIXprompt food \nPREFIXprompt famous buildings \nPREFIXprompt landmarks \nPREFIXprompt long \nPREFIXprompt plants \nPREFIXprompt person adjectives`,
    description: "Type the prompt command and then animals, body parts, buildings, expressions, food, famous buildings, landmarks, long, plants or person adjective. I will give you a random item from the category you choose. Long returns an adjective, a noun, and a verb."
}