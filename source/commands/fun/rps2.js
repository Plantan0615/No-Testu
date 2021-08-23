const discord = require("discord.js")
module.exports.run = async(client, message, args) => {    
var wheel ={ //assigns number to word
    0: "rock",
    1: "paper",
    2: "scissors"
};
//picks r, p, s
function computerPick() {
    return(wheel [Object.keys(wheel)[Math.floor(Math.random() * Object.keys(wheel).length)]])
};
var cpuResult = computerPick(); //calls function

let msgArr = args //sets up array
let userChoice = msgArr[0] //the part of the message after the command

//decides what's a win and what's a loss
    if (cpuResult === userChoice) {
        var result= "tie"   
    }
    else if (cpuResult === "rock" && userChoice === "paper"){
        var result= "win"
    }
    else if (cpuResult === "rock" && userChoice === "scissors"){
        var result= "loss"
    }
    else if (cpuResult === "paper" && userChoice === "rock"){
        var result= "loss"
    }
    else if (cpuResult === "paper" && userChoice === "scissors"){
        var result= "win"
    }
    else if (cpuResult === "scissors" && userChoice === "rock"){
        var result= "win"
    }
    else if (cpuResult === "scissors" && userChoice === "paper"){
        var result= "loss"
    }
    console.log(cpuResult, userChoice, result)
//takes a tie, win, or loss result and turns that into an embed
//uses userChoice and cpuResult to show the comparison of choices in the embed
    if (result === "tie") {
        const tieEmbed = new discord.MessageEmbed()
        .setTitle("You chose " + userChoice + " and I chose " +cpuResult)
        .setDescription("looks like it's a tie!")
        .setColor("#ca17a2")
        message.channel.send(tieEmbed);
    }
    else if (result === "win") {
        const winEmbed = new discord.MessageEmbed()
        .setTitle("You chose " + userChoice + " and I chose " +cpuResult)
        .setDescription("looks like you won!")
        .setColor("#ca17a2")
        message.channel.send(winEmbed);
    }
    else if (result === "loss") {
        const lossEmbed = new discord.MessageEmbed()
        .setTitle("You chose " + userChoice + " and I chose " +cpuResult)
        .setDescription("looks like you fucking suck! I win!")
        .setColor("#ca17a2")
        message.channel.send(lossEmbed);
    }

}

//normal export help stuff- THIS NEEDS TO BE OUTSIDE OF ALL ABOVE BRACKETS
module.exports.help = {
    name: "rps2",
    category: "fun",
    usage: `Template/Example: PREFIXrps2 rock`,
    description: "type the command, followed by rock, paper, or scissors.  The bot will randomly pick one and you know how rock paper scissors works."
}