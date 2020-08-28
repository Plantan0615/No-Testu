const message = require("../init/message");
const discord = require("discord.js")
module.exports = (client, member) => {
//add role
const role = member.guild.roles.cache.find(role => role.name === 'I Need to Read the Rules');
member.roles.add(role);
//send message
let welcomeEmbed = new discord.MessageEmbed()
.setTitle(`${member.user.username} has joined the party!`)
.setDescription("Welcome to Press X to Create! A server for artists and gamers. Please check out #rules-and-info so you can unlock the other channels.")
.setColor("#fcfcfc")
let ch = member.guild.channels.cache.find(channel=> channel.name === 'general-chat');
ch.send(welcomeEmbed);
}