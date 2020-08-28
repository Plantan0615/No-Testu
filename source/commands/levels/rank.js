const discord = require("discord.js");
module.exports.run = async(client, message, args) => {
    let prepareStatement = client.sql.prepare(`SELECT userID, username, userXP, RANK() OVER ( ORDER BY userXP DESC ) Rank FROM data WHERE guildID = ?`);
    let guildObject =prepareStatement.all(message.guild.id);
    let uID = message.author.id
    let user = guildObject.find(o => o.userID === `${uID}`)
    let userArr = Object.values(user)
    let userRank = userArr[3]
//send embed
    const rankEmbed = new discord.MessageEmbed()
    .setTitle(`Ranking for ${message.author.username}`)
    .setDescription(`You are ranked number ${userRank} in this server.`)
    .setColor('#5dc428');

    message.channel.send(rankEmbed);
}

module.exports.help = {
    name: "rank",
    category: "economy",
    usage: `Template/Example: PREFIXrank`,
    description: "Type this to see your current rank (based on XP)."
}