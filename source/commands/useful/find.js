module.exports.run = async(client, message, args) => {
    let user = message.author
    let announcement = `${user} This is the channel you were looking for`
    let request = message.content.toLowerCase().substring(6);
    let channel = client.channels.cache.find(channel => channel.name.toLowerCase() === `${request}`)
    message.delete();
    channel.send(announcement).then(msg => msg.delete({timeout: 15000})).catch(console.error);
}

module.exports.help = {
    name: "find",
    category: "useful",
    usage: `Template: PREFIXfind channel-name\n Examples: PREFIXfind general-chat\nPREFIXfind vent-and-advice`,
    description: "Type this followed by the channel you want me to find. I will ping you in that channel, then delete the messages after 15 seconds. YOU MUST TYPE THE CHANNEL NAME EXACTLY AS IT APPEARS (dashes and all)."
}