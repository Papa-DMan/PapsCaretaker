import * as fs from 'fs';
import {CacheType, ChatInputCommandInteraction} from 'discord.js';
var rootdir = ".";

module.exports = {
    name: 'help',
    description: 'Shows all commands or information about a specific command',
    usage: "help [command]",
    execute(message, args) {
        let commands = getCommands();
        if (args.length === 0) {
            message.channel.send(`Here are all the commands: \n${commands.map(command => `\`${command.name}\`${command.usage}${command.description}`).join('\n')}`);
        }
        else {
            let command = commands.find(command => command.name === args[0]);
            if (command) {
                message.channel.send(`\`${command.name}\`${command.usage}${command.description}`);
            }
            else {
                message.channel.send(`Command \`${args[0]}\` not found`);
            }
        }
    },
    async interact(interaction: ChatInputCommandInteraction<CacheType>) {
        let commands = getCommands();
        await interaction.reply('Here are all the commands: \n' + commands.map(command => `\`${command.name}\` - ${command.usage} \n\t${command.description}`).join('\n'));
    },
    __internal_requires_directory: true,
    __internal_setdir(dir: string) {
        rootdir = dir;
    }
}

/**
 * @brief reads all the commands in the commands folder
 * @returns an array of command objects
 */
function getCommands() : { name: string, description: string, usage: string }[] {
    let commands: { name: string, description: string, usage: string }[] = [];
    fs.readdirSync(`${rootdir}/commands`).forEach(file => {
        if (file.endsWith('.js')) {
            const command: { name: string, description: string, usage: string } = require(`${rootdir}/commands/${file}`);
            commands.push(command);
        }
    })
    return commands;
}