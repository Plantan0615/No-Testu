const { MessageEmbed } = require("discord.js");
module.exports.run = async(client, message, args) => {
    let userID = message.author.id
    let prepareStatement = client.sql.prepare("SELECT * FROM data WHERE userID = ? AND guildID = ?")
    let userXpObject= prepareStatement.get(`${userID}`, `${message.guild.id}`)
                let username = userXpObject["username"];
                let currentXp = userXpObject["userXP"];
                let currentMoneys = userXpObject["userMoneys"];
                let currentLevel = userXpObject["userLevel"];
                const statsEmbed = new MessageEmbed()
                .setColor('#289c20')
                .setTitle('Stats')
                .setDescription(`User Stats for ${message.author.username}`)
                .addFields(
                    { name: "Username", value: username},
                    { name: "XP", value: currentXp},
                    { name: "Level", value: currentLevel},
                    { name: "Moneys", value: currentMoneys}
                );
            message.channel.send(statsEmbed);
}

module.exports.help = {
    name: "stats",
    category: "economy",
    usage: `Template/Example: PREFIXstats`,
    description: "Type this to see your current XP, Level, and Moneys. (Your rank cannot be viewed here.)"
}