const discord = require("discord.js") //require discord.js libraries (universal)
module.exports.run = async(client, message, args) => {
    const anityEmbed = new discord.MessageEmbed()
    .setTitle("I've got my anity!")
    .setDescription(`I Swear!`)
    .setColor("#FFFFFF")
        message.channel.send(anityEmbed);
    
}

    module.exports.help = {
        name: "anity",
        category: "antony",
        usage: `Template/Example: PREFIXanity`,
        description: "ant's sanity clone"
    }