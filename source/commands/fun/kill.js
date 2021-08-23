const sql = require("better-sqlite3")("../source/userInfo.db");
const discord = require("discord.js")
module.exports.run = async(client, message, args) => {
//get usernames
    var authName = message.author.username
    let array= args
    var victObj = message.mentions.users.first()
    var victName = victObj.username
//pick a random method from kill
    let prepStatement = sql.prepare(`SELECT * FROM kill`)
    let obj = prepStatement.all()
    function randomise() {
        return (obj [Object.keys(obj)[Math.floor(Math.random() * Object.keys(obj).length)]])
    }
        var methodObj = randomise();
        var method= methodObj.Methods
       
//generate/ send embed (concat author username, method, and victim name)
    const killEmbed = new discord.MessageEmbed()
    .setTitle(`${authName} ${method} ${victName}`)
    .setDescription("looks like they're dead")
    message.channel.send(killEmbed)
}  
//module help export stuff  
module.exports.help = {
    name: "kill",
    category: "fun",
    usage: `Template/Example: PREFIXkill @Toasty Bum`,
    description: "Type this followed by a name to kill them."
}