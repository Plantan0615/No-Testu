const {MessageEmbed} = require("discord.js");
module.exports = async (client, reaction, user) => {
if (reaction.message.channel.id === "636155171704930319") {
    if (user.bot) return;
    if (!reaction.message.guild) return;
    if(reaction.message.partial) reaction.message.fetch();
    if(reaction.partial) reaction.fetch(); 
    try{
    let member = reaction.message.guild.members.cache.find(member => member.id === user.id);
    await reaction.message.fetch();
    //CUSTOM EMOJIS
    //GENERAL ROLES
        //animal lover
        if (reaction.emoji.id === '687829033161195603'){ member.roles.add("705962046612701290"); console.log("Role Added");}
        //anime weeb
        if (reaction.emoji.id === "687829033769107541"){ member.roles.add("705944464484728861"); console.log("Role Added");}
        //furry
        if (reaction.emoji.id === '696358090425106492'){ member.roles.add("705943580744876107"); console.log("Role Added");}
        //green thumbs
        if (reaction.emoji.id === '713027909874352128'){ member.roles.add("713016439698882610"); console.log("Role Added");}
        //meme queens
        if (reaction.emoji.id === '682178160179413027'){ member.roles.add("725529711849242764"); console.log("Role Added");}
    //GAMING ROLES
        //pokemon
        if (reaction.emoji.id === '694640664222367905'){ member.roles.add("705847064109777016"); console.log("Role Added");}
        //overwatch
        if (reaction.emoji.id === '705782550013935706'){ member.roles.add("636975512274599996"); console.log("Role Added");}
        //mario
        if (reaction.emoji.id === '706132805737906246'){ member.roles.add("713037624524406794"); console.log("Role Added");}
        //portal
        if (reaction.emoji.id === '687828929050181642'){ member.roles.add("639996910014431262"); console.log("Role Added");}
    //UNICODE EMOJIS
    //GENERAL ROLES
        //bookworm 
        if (reaction.emoji.name === '📗'){member.roles.add("705944329419751494"); console.log("Role Added");} 
        //foodie
        if (reaction.emoji.name === '🍴'){member.roles.add("705101001065234504"); console.log("Role Added");}
        //languages
        if (reaction.emoji.name === '📚'){member.roles.add("725529482525540372"); console.log("Role Added");}
        //movie goer
        if (reaction.emoji.name === '🎥'){member.roles.add("637470819915661333"); console.log("Role Added");} 
        //techie
        if (reaction.emoji.name === '🖥️'){member.roles.add("705971116405162395"); console.log("Role Added");} 
        //YT Nerd
        if (reaction.emoji.name === '🤓'){member.roles.add("705944717610713128"); console.log("Role Added");} 
        //NSFW
        if (reaction.emoji.name === '👨‍❤️‍💋‍👨'){member.roles.add("681543768486445095"); console.log("Role Added");} 
        //DMs open
        if (reaction.emoji.name === '✉️'){member.roles.add("705944113484398633"); console.log("Role Added");} 
        //male pronouns
        if (reaction.emoji.name === '👨'){member.roles.add("685239370906599526"); console.log("Role Added");} 
        //female pronouns
        if (reaction.emoji.name === '👩'){member.roles.add("685239570836881500"); console.log("Role Added");}
        //neutral pronouns
        if (reaction.emoji.name === '🤷'){member.roles.add("685240125810147373"); console.log("Role Added");}
    //ARTIST ROLES
        //comissions open
        if (reaction.emoji.name === '💰'){member.roles.add("637001397367472168"); console.log("Role Added");}
        //animator
        if (reaction.emoji.name === '🎬'){member.roles.add("685267256573558824"); console.log("Role Added");}
        //buidler
        if (reaction.emoji.name === '🛠️'){member.roles.add("705943158885711902"); console.log("Role Added");}
        //cosplayer
        if (reaction.emoji.name === '👗'){member.roles.add("705943274975920200"); console.log("Role Added");}
        //crafter
        if (reaction.emoji.name === '🧵'){member.roles.add("635984317712957446"); console.log("Role Added");}
        //digital artist
        if (reaction.emoji.name === '💻'){member.roles.add("635986201299386369"); console.log("Role Added");}
        //musical artist
        if (reaction.emoji.name === '🎵'){member.roles.add("635986484884930560"); console.log("Role Added");}
        //NSFW artist
        if (reaction.emoji.name === '💋'){member.roles.add("705942849832878211"); console.log("Role Added");}
        //performance artist
        if (reaction.emoji.name === '🎭'){member.roles.add("686289042241093709"); console.log("Role Added");}
        //photographer
        if (reaction.emoji.name === '📷'){member.roles.add("705943006817026049"); console.log("Role Added");}
        //photo editor
        if (reaction.emoji.name === '🖼️'){member.roles.add("713031820161056803"); console.log("Role Added");}
        //traditional artist
        if (reaction.emoji.name === '🎨'){member.roles.add("635984001462435890"); console.log("Role Added");}
        //writer
        if (reaction.emoji.name === '🖊️'){member.roles.add("686283745535590451"); console.log("Role Added");}
        //3D modeller
        if (reaction.emoji.name === '🖨️'){member.roles.add("705943367540015224"); console.log("Role Added");}
    //GAMING ROLES- ACTION RPG
        //action adv gamer
        if (reaction.emoji.name === '⚜️'){member.roles.add("705929458355273769"); console.log("Role Added");}
        //crashlands
        if (reaction.emoji.name === '⚠️'){member.roles.add("705930022325714974"); console.log("Role Added");}
        //legend of zelda
        if (reaction.emoji.name === '⚔️'){member.roles.add("705847216593698826"); console.log("Role Added");}
        //monster hunter worlds
        if (reaction.emoji.name === '🌀'){member.roles.add("705850968822120528"); console.log("Role Added");}
        //skyrim
        if (reaction.emoji.name === '☁️'){member.roles.add("705881493293236346"); console.log("Role Added");}
        //world of warcraft
        if (reaction.emoji.name === '🔱'){member.roles.add("705850740672823326"); console.log("Role Added");}
    //GAMING ROLES- CASUAL
        //casual gamer
        if (reaction.emoji.name === '🎮'){member.roles.add("635987062192865322"); console.log("Role Added");}
        //animal crossing
        if (reaction.emoji.name === '🦝'){member.roles.add("639993199422603305"); console.log("Role Added");}
        //hand simulator
        if (reaction.emoji.name === '🤚'){member.roles.add("713038198028370011"); console.log("Role Added");}
        //house flipper
        if (reaction.emoji.name === '🏠'){member.roles.add("705893531004305429"); console.log("Role Added");}
        //minecraft
        if (reaction.emoji.name === '⚒️'){member.roles.add("637466462323343381"); console.log("Role Added");}
        //satisfactory
        if (reaction.emoji.name === '🏭'){member.roles.add("705844096417267712"); console.log("Role Added");}
        //shell shock
        if (reaction.emoji.name === '🐚'){member.roles.add("705847608396087377"); console.log("Role Added");}
        //terraria
        if (reaction.emoji.name === '⛏️'){member.roles.add("691659097686278215"); console.log("Role Added");}
        //phone games
        if (reaction.emoji.name === '📱'){member.roles.add("685465424430759946"); console.log("Role Added");}
        //server games
        if (reaction.emoji.name === '🎲'){member.roles.add("639993677556613141"); console.log("Role Added");}
    //GAMING ROLES- FPS
        //fps gamer
        if (reaction.emoji.name === '🔫'){member.roles.add("635986492237545472"); console.log("Role Added");}
        //apex legends
        if (reaction.emoji.name === '🧿'){member.roles.add("637465722636861450"); console.log("Role Added");}
        //battlefield 5
        if (reaction.emoji.name === '🚀'){member.roles.add("705893223842709514"); console.log("Role Added");}
        //borderlands
        if (reaction.emoji.name === '🌐'){member.roles.add("713038016033325196"); console.log("Role Added");}
        //counter-strike
        if (reaction.emoji.name === '🗿'){member.roles.add("705848762710491238"); console.log("Role Added");}
        //rainbow six
        if (reaction.emoji.name === '👂'){member.roles.add("636975885727301662"); console.log("Role Added");}
        //valorant
        if (reaction.emoji.name === '🎀'){member.roles.add("705848478118707252"); console.log("Role Added");}
    //GAMING ROLES- OTHER COMBAT
        //other combat gamer
        if (reaction.emoji.name === '🔪'){member.roles.add("705929765009358867"); console.log("Role Added");}
        //for honour
        if (reaction.emoji.name === '🎁'){member.roles.add("705893373323640842"); console.log("Role Added");}
        //smash bros
        if (reaction.emoji.name === '🥊'){member.roles.add("689561161133588561"); console.log("Role Added");}
        //league of legends
        if (reaction.emoji.name === '🌌'){member.roles.add("705848089466109973"); console.log("Role Added");}
        //team fight tactics
        if (reaction.emoji.name === '🎆'){member.roles.add("705848362615701504"); console.log("Role Added");}
        //warframe
        if (reaction.emoji.name === '🛡️'){member.roles.add("705893705319448616"); console.log("Role Added");}
        //world of tanks
        if (reaction.emoji.name === '⚙️'){member.roles.add("705893816183292006"); console.log("Role Added");}
    //GAMING ROLES- PUZZLE PLATFORM
        //puzzle platform gamer
        if (reaction.emoji.name === '🧩'){member.roles.add("635989787769176104"); console.log("Role Added");}
        //catherine
        if (reaction.emoji.name === '👰'){member.roles.add("639996307313786910"); console.log("Role Added");}
        //the witness
        if (reaction.emoji.name === '⛰️'){member.roles.add("639997071813771289"); console.log("Role Added");}
    //DND ROLES
        //dnd player
        if (reaction.emoji.name === '🧝‍♀️'){member.roles.add("713014574684569711"); console.log("Role Added");}
        //dnd character designer
        if (reaction.emoji.name === '🧙'){member.roles.add("713019252936015925"); console.log("Role Added");}
        //dnd map designer
        if (reaction.emoji.name === '🗺️'){member.roles.add("713027013266636813"); console.log("Role Added");}
        //dnd world builder
        if (reaction.emoji.name === '🌎'){member.roles.add("713027233417265223"); console.log("Role Added");}
    }
//error message
catch (err) {console.log(err);}
}

//STARBOARD 
const handleStarboard = async () => {
    const starboard = client.channels.cache.find(channel => channel.id === "740301633396670464")
    const msgs = await starboard.messages.fetch({ limit: 100});
    const existingMsg = msgs.find(msg => msg.embeds.length === 1 
        ? (msg.embeds[0].footer.text.startsWith(reaction.message.id) ? true : false) : false);
    if(existingMsg){existingMsg.edit(`${reaction.count} - ⭐`);}
    else{
    const embed = new MessageEmbed()
        .setColor("#ebda07")
        .setAuthor(reaction.message.author.tag, reaction.message.author.displayAvatarURL())
        .addField("Message:", reaction.message.content)
        .setDescription(`[React to me here](${reaction.message.url})`)
        .setFooter(reaction.message.id + " - " + new Date(reaction.message.createdTimestamp) + " - Message ID and Post Date");
        if (starboard){starboard.send(" 1- ⭐", embed);}
    }
}
if(reaction.emoji.name === "⭐") {
    await reaction.fetch();
    if(reaction.message.channel.name.toLowerCase() === "starboard") return;
    if(reaction.message.partial) {
        handleStarboard();
    }
    else{
        handleStarboard();
    }
    } 
}