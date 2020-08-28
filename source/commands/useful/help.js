const { MessageEmbed } = require("discord.js");
module.exports.run = async(client, message, args) => {
    //help
    const helpEmbed = new MessageEmbed()
    .setColor('#0b5eaf')
	.setTitle('Navigating Help')
    .setDescription('Help With Help (haha)')
    .addFields(
        { name: "~help fun", value: "Type this command to see what fun features I have."},
        { name: "~help poll", value: "Type this to learn how to set up a poll."},
        { name: "~help random", value: "Type this to learn how to get a random meme, image, animal fact, or GIF."},
        { name: "~help rpg", value: "Type this to learn how to play the RPGs/Choose Your Own Adventure Stories."},
        { name: "~help roles", value: "Type this for help with adding and remove roles from yourself."},
        { name: "~help role list", value: "Type this for a list of all the roles in the server."},
        { name: "~help useful", value: "Type this to see what useful features I have. (If you need help with the password check #rules-and-info.)"},
        { name: "~help economy", value: "Type this for help understanding PXTC's economy and level systems."},
        { name: "~help levels", value: "Type this for help understanding PXTC's levels and level roles."},
        { name: "~help admin", value: "Type this to see what features I have for admins."},
        { name: "Examples:", value: "If you need an example of what to type for any of the commands. Type one of the following '~help fun usage', '~help roles usage', '~help useful usage', '~help economy usage'"}
    );

    //role list
    const roleListEmbed = new MessageEmbed()
    .setColor('#0b5eaf')
	.setTitle('Role List for PXTC')
    .setDescription('List of Roles to Help with Adding/Removing Roles via Command')
    .addFields(
        { name: "Category 1- General Roles", value: "Animal Lover, Anime Weeb, Book Worm, Foodie, Furry, Green Thumbs (for weed smokeers), Language Learning Crew, Meme Queens, Movie Goer, Techie, YouTube Nerd, NSFW (unlocks NSFW channels), DMs Open, He/Him/His, She/Her/Hers, They/Them/Theirs"},
        { name: "Category 2- Art Roles", value: "Commissions Open, 3D Modeller, Animator, Builder, Cosplayer, Crafter, Digital Artist, Musical Artist, NSFW Artist, Performance Artist, Photographer, Photo Editor, Traditional Artist, Writer"},
        {name: "Category 3- Gaming Roles 1 (Action Adventure/ Action RPG)", value: "Action Adventure/RPG Gamer, Crashlands, Legend of Zelda, Monster Hunter Worlds, Pokemon, Skyrim, World of Warcraft"},
        {name: "Category 4- Gaming Roles 2 (Casual)", value: "Casual Gamer, Animal Crossing, Hand Simulator, House Flipper, Minecraft, Satisfactory, Shell Shock, Terraria, Phone Games, Server Games"},
        {name: "Category 5- Gaming Roles 3 (FPS)", value: "FPS Gamer, Apex Legends, Battlefield 5, Counter-Strike, Overwatch, Rainbow Six, Valorant"},
        {name: "Category 6- Gaming Roles 4 (Other Combat)", value: "Other Combat Gamer, For Honour, Smash Bros, League of Legends, Team Fight Tactics, Warframe, World of Tanks"},
        {name: "Category 7- Gaming Roles 5 (Puzzle Platformers)", value: "Catherine, Mario, Portal, The Witness"},
        {name: "Category 8- DND Roles", value: "Dungeon Master (assigned by DND Manager), DND Player, DND Character Designer, DND Map Designer, DND World Builder"},
        { name: "Category 9- Level Roles (Cannot add or remove these yourself)", value: "I Need to Read the Rules, Noobz, iPhone Photographers, Soy Boys, Crafty Crew, Epic Gamers. (Type '~help levels' for more info)."},
        { name: "Category 10- Other Roles (Cannot add or remove these yourself)", value: "Owner, Arts and Crafts Manager, Entertainment Manager, Gaming Manager, DND Manager, Founders, Beans, Server Boosters, Bots (Rhythm and No Botto)"}
    );
    //levels 
    const levelsEmbed = new MessageEmbed()
    .setColor('#0b5eaf')
	.setTitle("Help with Levels and Level Roles")
    .setDescription("Help With Understanding PXTC's Levels")
    .addFields(
        { name: "Chunk 1: Levels 1- 11", value: " In this chunk, you will level up after every 1,000 XP (or 500 messages)."},
        { name: "Level 1- Noobz", value: "After you have read the rules, you are assigned this role."},
        { name: "Level 3- iPhone Photographers", value: "Once you have surpassed 2,000 XP (or 1,000 messages), you will be assigned this role."},
        { name: "Level 6- Soy Boys", value: "Once you have surpassed 5,000 XP (or 2,500 messages), you will be assigned this role."},
        { name: "Level 11- Crafty Crew", value: "Once you have surpassed 10,000 XP (or 5,000 messages), you will be assigned this role."},
        { name: "Chunk 2: Levels 12- 16", value: "In this chunk, you will level up after every 2,000 XP (or 1,000 messages)"},
        { name: "Level 16- Epic Gamers", value: "Once you have surpassed 20,000 XP (or 10,000 messages), you will be assigned this role."},
        { name: "NOTE:", value: "The key part of understanding these levels is that you must surpass the number of XP set out here (i.e. to level up from 1 to 2 you must have 1,002 XP, NOT 1,000 XP)"}
    );

    //help menu navigation
    if (args.length == 0) {
        return message.channel.send(helpEmbed);
    }
    var helpType = args.shift().toLowerCase();
    function toCapitalize(input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }
    var usageType = (args.length == 1 ? args.shift() : null)
    let finalEmbed = new MessageEmbed();
    finalEmbed.setColor("#0b5eaf")
    finalEmbed.setTitle(`Help with ${toCapitalize(helpType)} Commands`)
    finalEmbed.setDescription(`Help With Understanding PXTC's ${toCapitalize(helpType)}`)
    let commandList = client.commands.filter(v => {return v.help.category.toLowerCase() == helpType && !v.help.name.toLowerCase().includes("help")})
    let command = client.commands.filter(v => v.help.name.toLowerCase() == helpType.toLowerCase())

    let h2p = commandList.filter(v => {
        return v.h2p != undefined
    })
    function replaceAll(string, search, replace) {
      return string.split(search).join(replace);
    }

    let usageLst = commandList.map(v => {
        return v.help.usage.trim().length == 0 ? "No usage found" : replaceAll(v.help.usage, "PREFIX", client.prefix)
    })

    function generateEmbed(tmpEmbed, cmdLst, h2pLst, isUsage = false) {
        if (!isUsage) {
            let arr = cmdLst.array()
            for(let i = 0; i < arr.length; i++) {
                let content = arr[i]
                if (Array.isArray(content.help.description)) {
                    if (content.help.short != undefined && content.help.name != helpType) {
                        tmpEmbed.addField(`${client.prefix}${content.help.name}`, content.help.short.replace("PREFIX", client.prefix))
                    } else {
                        for ( let j = 0; j < content.help.description.length; j++) {
                            const data = content.help.description[j]
                            tmpEmbed.addField(data.name, data.value)
                        }
                    }
                } else {
                    tmpEmbed.addField(`${client.prefix}${content.help.name}`, content.help.description.replace("PREFIX", client.prefix))
                }
            }
            arr = h2pLst.array()
            if (arr.length >= 1) {
                let content = arr[0].h2p.instructions
                if (Array.isArray(content)) {
                    for (let i = 0; i < content.length; i++) {
                        const data = content[i]
                        tmpEmbed.addField(data.name, data.value)
                    }
                } else {
                    tmpEmbed.addField("How to Play:", content)
                }
            }
        } else {
            let arr = cmdLst.array()
            let uList = Array.isArray(h2pLst) ? h2pLst : h2pLst.array()
            if (arr.length == uList.length) {
                //they match
                for (let i = 0; i < arr.length; i++) {
                    let content = arr[i]
                    let uText = uList[i]
                    const usageTxt = uText.split("\n")
                    if (usageTxt.length == 1) {
                        tmpEmbed.addField(`${client.prefix}${content.help.name}`, uText)
                    } else {
                        tmpEmbed.addField(`${client.prefix}${content.help.name}`, uText)
                    }
                }
            } else {
                console.log("NO MATCH")
            }
        }
        return tmpEmbed
    }
    if (usageType != null && usageType.toLowerCase() == "usage") {
        if (commandList.size >= 1) {
            finalEmbed = generateEmbed(finalEmbed, commandList, usageLst, true)
        } else if (commandList.size == 0 && command.size >= 1) {
            finalEmbed = generateEmbed(finalEmbed, command, usageLst, true)
        }
    } else {
        if (commandList.size >= 1) {
            finalEmbed = generateEmbed(finalEmbed, commandList, h2p)
        } else if (commandList.size == 0 && command.size >= 1) {
            finalEmbed = generateEmbed(finalEmbed, command, h2p)
        }
    }
    if (helpType == "admin" && !message.member.hasPermission("ADMINISTRATOR")) {
        let msg = await message.channel.send("You cannot use these commands, so no need to have this info.");
        await msg.delete({timeout: 3000})
        await message.delete({timeout: 2000})
        return
    } else if (commandList.size >= 1 && args.length == 0) {
        message.channel.send(finalEmbed)
    } else if (command.size >= 1 && args.length == 0) {
        message.channel.send(finalEmbed)
    } else if (helpType == "levels" && args.length == 0) {
        message.channel.send(levelsEmbed)
    } else if (helpType == "role" && usageType) {
        const next = usageType
        if (next == "list") {
            message.channel.send(roleListEmbed)
        } else {
            message.delete();
            message.channel.send(`I'm not sure what you need help with. Type '${client.prefix}help' for all help commands.`).then(msg => msg.delete({timeout: 15000})).catch(err => console.log(err));
        }
    } else {
        message.delete();
        message.channel.send(`I'm not sure what you need help with. Type '${client.prefix}help' for all help commands.`).then(msg => msg.delete({timeout: 15000})).catch(err => console.log(err));
    } 
}

module.exports.help = {
    name: "help",
    category: "useful",
    usage: "",
    description: "This is the help command"
}