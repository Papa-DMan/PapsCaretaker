import { REST, Routes, Client } from 'discord.js';
import * as fs from 'fs';
import * as needle from 'needle';

const url = "https://discord.com/api/v10/applications/<my_application_id>/guilds/<guild_id>/commands"

// create array of all files in the commands folder
async function execute(client: Client, token: string, path: string) {
    if (!client.user) return

    const files = fs.readdirSync(`${path}/commands`);

    var commands: { name: string, description: string, usage: string, options?: [] }[] = [];

    for (var file in files) {
        if (files[file].endsWith('.js')) {
            console.log(`Loading command ${files[file]}`);
            const command: { name: string, description: string, usage: string, options: [] } = require(`${path}/commands/${files[file]}`);
            if (command.options) {
                commands.push({ name: command.name, description: command.description, usage: command.usage, options: command.options });
            }
            else {
                commands.push({ name: command.name, description: command.description, usage: command.usage });
            }
        }
    }




    client.guilds.cache.forEach(async guild => {
        console.log(`Sending commands to guild ${guild.name}`);
        if (client.user) {
            var gurl = url.replace("<my_application_id>", client.user.id).replace("<guild_id>", guild.id);
            var json = JSON.stringify(commands);
            var headers = {
                "Authorization": `Bot ${token}`,
            }
            var r = await needle.post(gurl, json, { headers: headers });
            console.log(r.body);
        }
    })






    /*
 
    const rest = new REST({ version: '10' }).setToken(token);
 
    var commandsToPublish: { name: string, description: string, usage: string, options: [] }[] = [];
 
    client.guilds.cache.forEach(async guild => {
        console.log(`Registering commands for ${guild.name}`);
 
        if (guild && client.user) {
            var res : any = await rest.get(Routes.applicationGuildCommands(client.user.id, guild.id))
            for (var com in res) {
                if (!commands.find(command => command.name === res[com].name)) {
                    commandsToPublish.push({ name: res[com].name, description: res[com].description, usage: res[com].usage, options: res[com].options });
                }
            }
            for (var command in commandsToPublish) {
                await rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), {
                    body: [commands[command]]
                })
            }
            console.log(`Registered commands for ${guild.name}`);
        }
    });
    */
}

module.exports = {
    name: "Slash Command Register",
    description: "Registers slash commands",
    execute: execute
}