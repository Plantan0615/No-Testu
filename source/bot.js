require("dotenv").config();
const discord = require("discord.js");
const client = new discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const fs = require("fs").promises;
const path = require("path");
const PREFIX = process.env.PREFIX;
client.commands = new discord.Collection();
client.prefix = PREFIX

async function registerCommands(dir = "commands") {
    let files = await fs.readdir(path.join(__dirname, dir));
    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, dir, file));
        if(stat.isDirectory()) {
            await registerCommands(path.join(dir, file));
        }
        else {
            if(file.endsWith(".js")){
                let cmdName = file.substring(0, file.indexOf(".js"));
                try{
                let cmdModule = require(path.join(__dirname, dir, file));
                // Remember: cmdModule.help.name = the file module.export.help -> name
                client.commands.set(cmdModule.help.name, cmdModule);
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
    }
}
//event hanlding
async function registerEvents(dir = "events") {
    let files = await fs.readdir(path.join(__dirname, dir));
    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, dir, file));
        if(stat.isDirectory()) {
            await registerEvents(path.join(dir, file));
        }
        else {
            if(file.endsWith(".js")){
                let eventName = file.substring(0, file.indexOf(".js"));
                try{
                let eventModule = require(path.join(__dirname, dir, file));
                client.on(eventName, eventModule.bind(null, client));
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        
    }
}
    
async function main() {
    //command handling
    await registerCommands()
    
    // Event Handling
    await registerEvents()

    // Set up MySQL
    const sql = require("better-sqlite3")("C:\\Users\\chase\\Desktop\\Coding\\No Testu\\source\\userInfo.db");
    client.sql = sql

    // Start Bot
    client.login(process.env.BOT_TOKEN);
}
main()
