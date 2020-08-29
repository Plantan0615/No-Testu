const sql = require("better-sqlite3")("/Users/chase/Desktop/Coding/No Testu/source/userInfo.db");
const discord = require("discord.js");
module.exports.run = async(client, message, args) => {
if(!message.member.hasPermission("ADMINISTRATOR")){
    message.channel.send("You cannot check other people's warnings.").then(msg => msg.delete({timeout: 2000})).catch(err => console.log(err)); 
    message.delete(); return;
}
let userID = message.content.substring(11)
if(!userID){
    message.channel.send("You must provide a userID").then(msg => msg.delete({timeout: 2000})).catch(err => console.log(err)); 
    message.delete(); return;
}
    let prepareStatement = sql.prepare("SELECT username, warnNum, warnReason FROM data WHERE userID = ?")
    let userObject= prepareStatement.get(`${userID}`)
        let warnReas = userObject["warnReason"]
        let warnAmt = userObject["warnNum"]
        let uName = userObject["username"]
    const warnEmbed = new discord.MessageEmbed()
    .setTitle("Warnings")
    .setDescription(`Warnings for ${uName}`)
    .setColor("#831313")
    .addFields(
        {name: "Amount of Warnings:", value: warnAmt},
        {name: "Reasons for Warnings:", value: warnReas}
    )
        message.channel.send(warnEmbed);
}
module.exports.help = {
    name: "userwarns",
    category: "admin",
    usage: `Template: PREFIXuserwarns userID\nExample: PREFIXuserwarns 735157583010332723 (the user ID is my alt acct)`,
    description: "For viewing the warnings of members. Type this command followed by the userID (Seperated with a space)."
}