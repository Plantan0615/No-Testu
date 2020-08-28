const sql = require("better-sqlite3")("/Users/chase/Desktop/Coding/No Botto/source/userInfo.db");
const discord = require("discord.js");
module.exports.run = async(client, message, args) => {
let userID = message.author.id
    let prepareStatement = sql.prepare("SELECT warnNum, warnReason FROM data WHERE userID = ?")
    let userObject= prepareStatement.get(`${userID}`)
        let warnReas = userObject["warnReason"]
        let warnAmt = userObject["warnNum"]
        let username = message.author.username
    const warnEmbed = new discord.MessageEmbed()
    .setTitle("Warnings")
    .setDescription(`Warnings for ${username}`)
    .setColor("#831313")
    .addFields(
        {name: "Amount of Warnings:", value: warnAmt},
        {name: "Reasons for Warnings:", value: warnReas}
    )
        message.channel.send(warnEmbed);
}

module.exports.help = {
    name: "mywarnings",
    category: "useful",
    usage: `Template/Example: PREFIXmywarnings`,
    description: "Type this command to see how many warnings you have, and the reasons for those warnings (This command will only work if you have sent a non-command message. Type ~economy help for more info.)"
}