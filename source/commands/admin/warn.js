const sql = require("better-sqlite3")("/Users/chase/Desktop/Coding/No Testu/source/userInfo.db");
const discord = require("discord.js");
module.exports.run = async(client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR")) {
        message.channel.send("You cannot warn people.").then(msg => msg.delete({timeout: 2000})).catch(err => console.log(err)); 
        message.delete(); return;
    }
    let msgArray = message.content.substring(6).split (", ")
    let userID = msgArray[0]
    let reason = msgArray[1]
    if (!userID){
        message.channel.send("You must provide a userID").then(msg => msg.delete({timeout: 2000})).catch(err => console.log(err)); 
        message.delete(); return;
    }
    if (!reason){
        message.channel.send("You must provide a reason").then(msg => msg.delete({timeout: 2000})).catch(err => console.log(err)); 
        message.delete(); return;
    }
        let prepareStatement = sql.prepare("SELECT * FROM data WHERE userID = ?")
        let userObject= prepareStatement.get(`${userID}`)
                let warnReas = userObject["warnReason"]
                let newReas = reason
                let finalReason = warnReas + ", " + newReas
                    let warnAmt = userObject["warnNum"]
                    let newNum = 1
                    let finalWarn = warnAmt + newNum
                        let username = userObject["username"]
            if (warnReas === "N/A"){
                let prepareUpdate = sql.prepare(`UPDATE data SET warnNum = ?, warnReason = ? WHERE userID = ?`)
                prepareUpdate.run(finalWarn, newReas, userID);
            } else{
            let prepareUpdate = sql.prepare(`UPDATE data SET warnNum = ?, warnReason = ? WHERE userID = ?`)
            prepareUpdate.run(finalWarn, finalReason, userID);
            }
            const warnEmbed = new discord.MessageEmbed()
            .setTitle(`${username} has been Warned!`)
            .setDescription(`Reason: ${reason}`)
            .setColor("#831313")
            message.channel.send(warnEmbed)
}

module.exports.help = {
    name: "warn",
    category: "admin",
    usage: `Template: PREFIXwarn userID, reason\n Example: PREFIXwarn 735157583010332723, a good reason (the user ID is my alt acct)`,
    description: "For warning members. Type the command followed by the userID and the reason for the warning (MUST BE Separated with a comma)."
}