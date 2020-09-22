function updateLevel(updatedXP){
    if(updatedXP >= 0 && updatedXP <= 1000) return 1;//start as Noobz
    else if(updatedXP > 1000 && updatedXP <= 2000) return 2;//iphone photographers (>2000)
    else if(updatedXP > 2000 && updatedXP <= 3000) return 3;
    else if(updatedXP > 3000 && updatedXP <= 4000) return 4;
    else if(updatedXP > 4000 && updatedXP <= 5000) return 5;//Soy Boys (>5000)
    else if(updatedXP > 5000 && updatedXP <= 6000) return 6;
    else if(updatedXP > 6000 && updatedXP <= 7000) return 7;
    else if(updatedXP > 7000 && updatedXP <= 8000) return 8;
    else if(updatedXP > 8000 && updatedXP <= 9000) return 9;
    else if(updatedXP > 9000 && updatedXP <= 10000) return 10; //Crafty Crew (>10000)
    else if(updatedXP > 10000 && updatedXP <= 12000) return 11;
    else if(updatedXP > 12000 && updatedXP <= 14000) return 12;
    else if(updatedXP > 14000 && updatedXP <= 16000) return 13;
    else if(updatedXP > 16000 && updatedXP <= 18000) return 14;
    else if(updatedXP > 18000 && updatedXP <= 20000) return 15;
    else if(updatedXP > 20000) return 16; //Epic Gamers (>20000)
}
const discord = require("discord.js")
module.exports = async(client, message) => {
    if(message.author.bot) return;
    if(message.content.startsWith(client.prefix)) {
        const args = message.content.slice(client.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if(client.commands.has(command)) {
            client.commands.get(command).run(client, message, args);
        }
    }
    //if message doesn't start with ~
    if(!message.content.startsWith(client.prefix)) {
    //if I Need to Read the Rules says something dumb
    let role = message.guild.roles.cache.find(role => role.name === "I Need to Read the Rules");
    let phrases = ["more channels", "two channels", "2 channels"]
    if (message.member.roles.cache.has(role.id) && phrases.some(word => message.content.includes(word))) {
        message.channel.send("Hey! There are more channels! You just need to read the rules and type the password (in this channel) to unlock them.")
    }
    //if sentence starts with I'm
    let isValid = ["I'm ", "Im ", "i'm ", "im ", "i'M ", "iM "]
    if (isValid.some(word => message.content.toLowerCase().trim().startsWith(word.trim().toLowerCase()))) {
        if(message.channel.id === "649178353471062016") { return; }// if vent and advice channel
        let msgArr = message.content.split(" "); //create array
        console.log(msgArr.length, msgArr.length <= 5, msgArr)
        if (msgArr.length <= 5){//if array is less than 5 long
            msgArr.shift(); //remove I'm
            let words = msgArr.join(" ");//recreate string
            message.channel.send(`Hi ${words}, I'm dad!`); //send dad joke
        } else {return;}
    }
    // //USER XP USING DB 
        let userID = message.author.id
        let username = message.author.username
        let prepareStatement = client.sql.prepare("SELECT * FROM data WHERE userID = ? AND guildID = ?")
        let userXpObject= prepareStatement.get(`${userID}`, `${message.guild.id}`)

        if (userXpObject == undefined) {
            // Does not exist
            let prepareInsert = client.sql.prepare(`INSERT INTO data (userID, guildID, username, userXP, userLevel, userMoneys, warnNum, warnReason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
            prepareInsert.run(userID, message.guild.id, username, 2, 1, 1, 0, "N/A")
        } else {
            let newXp = 2;
            let currentXp = userXpObject["userXP"]
            let newMoneys = 1
            let currentMoneys = userXpObject["userMoneys"]
            let currentLevel = userXpObject["userLevel"]
            let finalXP = newXp + currentXp
            let finalMoneys = newMoneys + currentMoneys
            let finalLevel = updateLevel(finalXP)
            const roleChangeEmbed = new discord.MessageEmbed();
            // Logic
            if (currentLevel != finalLevel){
                if (message.guild.id !== "635980817524326420") {
                    message.channel.send(`${message.member} has leveled up to ${finalLevel}.`)
                } else {
                    if(finalLevel === 3){
                        message.member.roles.remove("651166068877819916"); //noobz
                        message.member.roles.add("651168912959864870"); //iphone
                        roleChangeEmbed.setTitle(`${message.member} Just ditched the Noobz Role. iPhone Photographers Role Get!`)
                        roleChangeEmbed.setDescription(`They are now level ${finalLevel} and have ${finalXP} XP!!!!`)
                        roleChangeEmbed.setColor(`#e69011`)
                        message.channel.send(roleChangeEmbed);
                    }
                    else if(finalLevel === 6){
                        message.member.roles.remove("651168912959864870"); //iphone
                        message.member.roles.add("651098747186446346"); //soyboys
                        roleChangeEmbed.setTitle(`${message.member} Just ditched the iPhone Photographers Role. Soy Boys Role Get!`)
                        roleChangeEmbed.setDescription(`They are now level ${finalLevel} and have ${finalXP} XP!!!!`)
                        roleChangeEmbed.setColor(`#f1ed3f`)
                        message.channel.send(roleChangeEmbed);
                    }
                    else if(finalLevel === 11){
                        message.member.roles.remove("651098747186446346"); //soyboys
                        message.member.roles.add("651167306398826509"); //Crafty
                        roleChangeEmbed.setTitle(`${message.member} Just ditched the Soy Boys Role. Crafty Crew Role Get!`)
                        roleChangeEmbed.setDescription(`They are now level ${finalLevel} and have ${finalXP} XP!!!!`)
                        roleChangeEmbed.setColor(`#91db0e`)
                        message.channel.send(roleChangeEmbed);
                    }
                    else if(finalLevel === 16){
                        message.member.roles.remove("651167306398826509"); //crafty
                        message.member.roles.add("651167213490798619"); //epic
                        roleChangeEmbed.setTitle(`${message.member} Just ditched the Crafty Crew Role. Epic Gamers Role Get!`)
                        roleChangeEmbed.setDescription(`They are now level ${finalLevel} and have ${finalXP} XP!!!!`)
                        roleChangeEmbed.setColor(`#0b7722`)
                        message.channel.send(roleChangeEmbed);
                    }
                    else{ message.channel.send(`${message.member} has leveled up to ${finalLevel}.`)};
                }
            }
            // Update DB
            let prepareUpdate = client.sql.prepare(`UPDATE data SET userXP = ?, userMoneys = ?, userLevel = ? WHERE userID = ? AND guildID = ?`)
            // Does Exist
            prepareUpdate.run(finalXP,finalMoneys,finalLevel, userID, message.guild.id);
        }
    }
}

