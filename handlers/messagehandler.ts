import { Message, } from 'discord.js';
import * as fs from 'fs';
const queuehandler = require('./queuehandler.js');
module.exports = {
    name: 'message',
    description: 'Message handler',
    execute: execute
}
function execute(message: Message, command: string, args: string[], path: string) {
    const files = fs.readdirSync(`${path}/commands`);
    for (var file of files) {
        if (file.endsWith('.js') && file.split('.')[0] === command) {
            const comfile = require(`${path}/commands/${file}`);
            if (comfile.__internal_requires_directory) {
                comfile.__internal_setdir(path);
            }
            if (comfile.__internal_is_music) {
                return queuehandler.execute(message, command, args, path);
            }
            return comfile.execute(message, args);
        }
    }
    return message.channel.send('Command not found. Use `help` to see all commands.');
}