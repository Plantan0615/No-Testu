module.exports.run = async(client, message, args) => {
    let roleNames = message.content.substring(5).split (", ");
    let roleSet = new Set(roleNames);
    let { cache } = message.guild.roles;

    roleSet.forEach(roleName => {
        let role = cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
        if(role) {
            if(role.permissions.has("ADMINISTRATOR") || role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS")){
                message.channel.send("You cannot add yourself to this role").then(msg => msg.delete({timeout: 5000})).catch(err => console.log(err)) 
                return;
            }
            // else if (role.id === "734036267871895554" ||role.id === "651166068877819916" || role.id === "651168912959864870" || role.id === "651098747186446346" || role.id === "651167306398826509" || role.id === "651167213490798619" || role.id === "681596021859680270" || role.id === "685464830907645953"){
            //     message.channel.send("You cannot add yourself to this role").then(msg => msg.delete({timeout: 5000})).catch(err => console.log(err)) 
            //     return;
            // }
            else if (role.id === "735156866035875880" ||role.id === "735218837057962058" || role.id === "736668508129198170" || role.id === "736676248884871231" || role.id === "736676760971640892" || role.id === "736676859596767413"){
                message.channel.send("You cannot add yourself to this role").then(msg => msg.delete({timeout: 5000})).catch(err => console.log(err)) 
                return;
            }
            else if(message.member.roles.cache.has(role.id)) {
                message.channel.send("You already have this role").then(msg => msg.delete({timeout: 5000})).catch(err => console.log(err)) 
               return;
            }
            else {
                message.member.roles.add(role)
                 .then(member => message.channel.send("You were assigned the role"))
                 .catch(err => {
                    console.log(err)
                    message.channel.send("Something went wrong");
                    return;
            });
        }
    }
        else {
            message.channel.send("Role Not Found.").then(msg => msg.delete({timeout: 5000})).catch(err => console.log(err));
            return;
        }
    });
    message.delete();
}

module.exports.help = {
    name: "add",
    category: "roles",
    usage: `Template: PREFIXadd role, another role\n Example (One Role): PREFIXadd animal lover\n Example (Multiple Roles): PREFIXadd animal lover, anime weeb`,
    description: "Type the add command and the names of the roles you want to add. With the roles separated by commas."
}

module.exports.h2p = {
    instructions: [{ name: "Reacting for Roles", value: "You can add roles to (and remove roles from) yourself by reacting (and unreacting) to the messages in #role-menu (I will only add the role if you react in that channel)."},
        { name: "Level Roles", value: "The I Need to Read the Rules, Noobz, iPhone Photographers, Soy Boys, Crafty Crew, and Epic Gamers Roles are level roles (based on xp, earned by takling). You CANNOT add yourself to (or remove yourself from) these roles."},
        { name: "Other Roles", value: "Please type ~help role list for info on all of the roles."}]
}