const discord = require("discord.js");
module.exports.run = async(client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR")) {
        message.channel.send("You cannot ban people.").then(msg => msg.delete({timeout: 2000})).catch(err => console.log(err)); 
        message.delete(); return;
    }
    let msgArray = message.content.substring(5).split (", ")
    let userID = msgArray[0]
    let reason = msgArray[1]

        let member = message.guild.members.cache.get(`${userID}`);
        const banEmbed = new discord.MessageEmbed()
        .setTitle(`${member.user.username} has been Banned!`)
        .setDescription(`Reason: ${reason}`)
        .setColor("#831313")
    if (!userID){
        message.channel.send("You must provide a userID.").then(msg => msg.delete({timeout: 2000})).catch(err => console.log(err)); 
        message.delete(); return;
    }
    if (!member.bannable) {
        message.channel.send("I cannot ban this user.").then(msg => msg.delete({timeout: 2000})).catch(err => console.log(err)); 
        message.delete(); return;
    }
    if (!reason){
        message.channel.send("You must provide a reason.").then(msg => msg.delete({timeout: 2000})).catch(err => console.log(err)); 
        message.delete(); return;
    }
    else {
        await member.ban({reason: `${reason}`}).catch(error => message.channel.send(`Sorry ${message.author} I couldn't ban because of : ${error}`));
        message.channel.send(banEmbed)
    }
}

module.exports.help = {
    name: "ban",
    category: "admin",
    usage: `Template: PREFIXban userID, reason\nExample: PREFIXban 735157583010332723, because (the user ID is my alt acct)`,
    description: "For banning members. Type the command followed by the userID and the reason for the ban (MUST BE Separated with a comma)."
}

module.exports.h2p = {
    instructions: [
        { name: "IMPORTANT NOTE", value: "Users can only be warned (and their warns checked) if they are in the Database(db). This means that they must have sent a message that is not a command. This also applies to currency if anyone is confused, as if they utilise db commands before they have sent an actual message the command will not work."},
        {name: "Examples", value: "Type '~help admin usage' for examples of what you need to type for all admin commands"}
]

}