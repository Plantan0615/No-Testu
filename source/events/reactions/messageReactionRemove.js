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
        if (reaction.emoji.id === '687829033161195603'){ member.roles.remove("705962046612701290"); console.log("Role Removed");}
        //anime weeb
        if (reaction.emoji.id === "687829033769107541"){ member.roles.remove("705944464484728861"); console.log("Role Removed");}
        //furry
        if (reaction.emoji.id === '696358090425106492'){ member.roles.remove("705943580744876107"); console.log("Role Removed");}
        //green thumbs
        if (reaction.emoji.id === '713027909874352128'){ member.roles.remove("713016439698882610"); console.log("Role Removed");}
        //meme queens
        if (reaction.emoji.id === '682178160179413027'){ member.roles.remove("725529711849242764"); console.log("Role Removed");}
    //GAMING ROLES
        //pokemon
        if (reaction.emoji.id === '694640664222367905'){ member.roles.remove("705847064109777016"); console.log("Role Removed");}
        //overwatch
        if (reaction.emoji.id === '705782550013935706'){ member.roles.remove("636975512274599996"); console.log("Role Removed");}
        //mario
        if (reaction.emoji.id === '706132805737906246'){ member.roles.remove("713037624524406794"); console.log("Role Removed");}
        //portal
        if (reaction.emoji.id === '687828929050181642'){ member.roles.remove("639996910014431262"); console.log("Role Removed");}
    //UNICODE EMOJIS
    //GENERAL ROLES
        //bookworm 
        if (reaction.emoji.name === '📗'){member.roles.remove("705944329419751494"); console.log("Role Removed");} 
        //foodie
        if (reaction.emoji.name === '🍴'){member.roles.remove("705101001065234504"); console.log("Role Removed");}
        //languages
        if (reaction.emoji.name === '📚'){member.roles.remove("725529482525540372"); console.log("Role Removed");}
        //movie goer
        if (reaction.emoji.name === '🎥'){member.roles.remove("637470819915661333"); console.log("Role Removed");} 
        //techie
        if (reaction.emoji.name === '🖥️'){member.roles.remove("705971116405162395"); console.log("Role Removed");} 
        //YT Nerd
        if (reaction.emoji.name === '🤓'){member.roles.remove("705944717610713128"); console.log("Role Removed");} 
        //NSFW
        if (reaction.emoji.name === '👨‍❤️‍💋‍👨'){member.roles.remove("681543768486445095"); console.log("Role Removed");} 
        //DMs open
        if (reaction.emoji.name === '✉️'){member.roles.remove("705944113484398633"); console.log("Role Removed");} 
        //male pronouns
        if (reaction.emoji.name === '👨'){member.roles.remove("685239370906599526"); console.log("Role Removed");} 
        //female pronouns
        if (reaction.emoji.name === '👩'){member.roles.remove("685239570836881500"); console.log("Role Removed");}
        //neutral pronouns
        if (reaction.emoji.name === '🤷'){member.roles.remove("685240125810147373"); console.log("Role Removed");}
    //ARTIST ROLES
        //comissions open
        if (reaction.emoji.name === '💰'){member.roles.remove("637001397367472168"); console.log("Role Removed");}
        //animator
        if (reaction.emoji.name === '🎬'){member.roles.remove("685267256573558824"); console.log("Role Removed");}
        //buidler
        if (reaction.emoji.name === '🛠️'){member.roles.remove("705943158885711902"); console.log("Role Removed");}
        //cosplayer
        if (reaction.emoji.name === '👗'){member.roles.remove("705943274975920200"); console.log("Role Removed");}
        //crafter
        if (reaction.emoji.name === '🧵'){member.roles.remove("635984317712957446"); console.log("Role Removed");}
        //digital artist
        if (reaction.emoji.name === '💻'){member.roles.remove("635986201299386369"); console.log("Role Removed");}
        //musical artist
        if (reaction.emoji.name === '🎵'){member.roles.remove("635986484884930560"); console.log("Role Removed");}
        //NSFW artist
        if (reaction.emoji.name === '💋'){member.roles.remove("705942849832878211"); console.log("Role Removed");}
        //performance artist
        if (reaction.emoji.name === '🎭'){member.roles.remove("686289042241093709"); console.log("Role Removed");}
        //photographer
        if (reaction.emoji.name === '📷'){member.roles.remove("705943006817026049"); console.log("Role Removed");}
        //photo editor
        if (reaction.emoji.name === '🖼️'){member.roles.remove("713031820161056803"); console.log("Role Removed");}
        //traditional artist
        if (reaction.emoji.name === '🎨'){member.roles.remove("635984001462435890"); console.log("Role Removed");}
        //writer
        if (reaction.emoji.name === '🖊️'){member.roles.remove("686283745535590451"); console.log("Role Removed");}
        //3D modeller
        if (reaction.emoji.name === '🖨️'){member.roles.remove("705943367540015224"); console.log("Role Removed");}
    //GAMING ROLES- ACTION RPG
        //action adv gamer
        if (reaction.emoji.name === '⚜️'){member.roles.remove("705929458355273769"); console.log("Role Removed");}
        //crashlands
        if (reaction.emoji.name === '⚠️'){member.roles.remove("705930022325714974"); console.log("Role Removed");}
        //legend of zelda
        if (reaction.emoji.name === '⚔️'){member.roles.remove("705847216593698826"); console.log("Role Removed");}
        //monster hunter worlds
        if (reaction.emoji.name === '🌀'){member.roles.remove("705850968822120528"); console.log("Role Removed");}
        //skyrim
        if (reaction.emoji.name === '☁️'){member.roles.remove("705881493293236346"); console.log("Role Removed");}
        //world of warcraft
        if (reaction.emoji.name === '🔱'){member.roles.remove("705850740672823326"); console.log("Role Removed");}
    //GAMING ROLES- CASUAL
        //casual gamer
        if (reaction.emoji.name === '🎮'){member.roles.remove("635987062192865322"); console.log("Role Removed");}
        //animal crossing
        if (reaction.emoji.name === '🦝'){member.roles.remove("639993199422603305"); console.log("Role Removed");}
        //hand simulator
        if (reaction.emoji.name === '🤚'){member.roles.remove("713038198028370011"); console.log("Role Removed");}
        //house flipper
        if (reaction.emoji.name === '🏠'){member.roles.remove("705893531004305429"); console.log("Role Removed");}
        //minecraft
        if (reaction.emoji.name === '⚒️'){member.roles.remove("637466462323343381"); console.log("Role Removed");}
        //satisfactory
        if (reaction.emoji.name === '🏭'){member.roles.remove("705844096417267712"); console.log("Role Removed");}
        //shell shock
        if (reaction.emoji.name === '🐚'){member.roles.remove("705847608396087377"); console.log("Role Removed");}
        //terraria
        if (reaction.emoji.name === '⛏️'){member.roles.remove("691659097686278215"); console.log("Role Removed");}
        //phone games
        if (reaction.emoji.name === '📱'){member.roles.remove("685465424430759946"); console.log("Role Removed");}
        //server games
        if (reaction.emoji.name === '🎲'){member.roles.remove("639993677556613141"); console.log("Role Removed");}
    //GAMING ROLES- FPS
        //fps gamer
        if (reaction.emoji.name === '🔫'){member.roles.remove("635986492237545472"); console.log("Role Removed");}
        //apex legends
        if (reaction.emoji.name === '🧿'){member.roles.remove("637465722636861450"); console.log("Role Removed");}
        //battlefield 5
        if (reaction.emoji.name === '🚀'){member.roles.remove("705893223842709514"); console.log("Role Removed");}
        //borderlands
        if (reaction.emoji.name === '🌐'){member.roles.remove("713038016033325196"); console.log("Role Removed");}
        //counter-strike
        if (reaction.emoji.name === '🗿'){member.roles.remove("705848762710491238"); console.log("Role Removed");}
        //rainbow six
        if (reaction.emoji.name === '👂'){member.roles.remove("636975885727301662"); console.log("Role Removed");}
        //valorant
        if (reaction.emoji.name === '🎀'){member.roles.remove("705848478118707252"); console.log("Role Removed");}
    //GAMING ROLES- OTHER COMBAT
        //other combat gamer
        if (reaction.emoji.name === '🔪'){member.roles.remove("705929765009358867"); console.log("Role Removed");}
        //for honour
        if (reaction.emoji.name === '🎁'){member.roles.remove("705893373323640842"); console.log("Role Removed");}
        //smash bros
        if (reaction.emoji.name === '🥊'){member.roles.remove("689561161133588561"); console.log("Role Removed");}
        //league of legends
        if (reaction.emoji.name === '🌌'){member.roles.remove("705848089466109973"); console.log("Role Removed");}
        //team fight tactics
        if (reaction.emoji.name === '🎆'){member.roles.remove("705848362615701504"); console.log("Role Removed");}
        //warframe
        if (reaction.emoji.name === '🛡️'){member.roles.remove("705893705319448616"); console.log("Role Removed");}
        //world of tanks
        if (reaction.emoji.name === '⚙️'){member.roles.remove("705893816183292006"); console.log("Role Removed");}
    //GAMING ROLES- PUZZLE PLATFORM
        //puzzle platform gamer
        if (reaction.emoji.name === '🧩'){member.roles.remove("635989787769176104"); console.log("Role Removed");}
        //catherine
        if (reaction.emoji.name === '👰'){member.roles.remove("639996307313786910"); console.log("Role Removed");}
        //the witness
        if (reaction.emoji.name === '⛰️'){member.roles.remove("639997071813771289"); console.log("Role Removed");}
    //DND ROLES
        //dnd player
        if (reaction.emoji.name === '🧝‍♀️'){member.roles.remove("713014574684569711"); console.log("Role Removed");}
        //dnd character designer
        if (reaction.emoji.name === '🧙'){member.roles.remove("713019252936015925"); console.log("Role Removed");}
        //dnd map designer
        if (reaction.emoji.name === '🗺️'){member.roles.remove("713027013266636813"); console.log("Role Removed");}
        //dnd world builder
        if (reaction.emoji.name === '🌎'){member.roles.remove("713027233417265223"); console.log("Role Removed");}
    }
//error message  
catch (err) {console.log(err);}
}

//STARBOARD
const handleStarboard = async() => {
    const starboard = client.channels.cache.find(channel => channel.id === "740301633396670464")
    const msgs = await starboard.messages.fetch({ limit: 100});
    const existingMsg = msgs.find(msg => msg.embeds.length === 1 
        ? (msg.embeds[0].footer.text.startsWith(reaction.message.id) ? true : false) : false);
    if(existingMsg){existingMsg.edit(`${reaction.count} - ⭐`);
    if (`${reaction.count}` === "0") {existingMsg.delete();}
    }
}
if(reaction.emoji.name === "⭐") {
    await reaction.fetch();
    if(reaction.message.channel.name.toLowerCase() === "starboard") return;
    if(reaction.message.partial) {
        await reaction.message.fetch();
        handleStarboard();
    }
   else{
        handleStarboard();
    }
}
}