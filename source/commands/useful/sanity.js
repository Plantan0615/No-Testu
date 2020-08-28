const discord = require("discord.js")
module.exports.run = async(client, message, args) => {
const sanityEmbed = new discord.MessageEmbed()
      .setTitle("I am still sane!")
      .setDescription(`I promise.`)
      .setColor("#19da58")
         message.channel.send(sanityEmbed);
}

module.exports.help = {
      name: "sanity",
      category: "useful",
      usage: `Template/Example: PREFIXsanity`,
      description: "Type this to see if I am still online."
  }