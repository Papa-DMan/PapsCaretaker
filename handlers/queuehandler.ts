import { Message } from 'discord.js';
import { joinVoiceChannel, getVoiceConnection, AudioPlayer, VoiceConnection } from '@discordjs/voice';
import * as fs from 'fs';
const queuehandler = require('./queuehandler.js');
var queues: { [key: string]: AudioPlayer } = {};
module.exports = {
    name: 'message',
    description: 'Message handler',
    execute: execute
}
function execute(message: Message, command: string, args: string[], path: string) {
    const comfile = require(`${path}/commands/${command}.js`);
    if (comfile.__internal_requires_directory) {
        comfile.__internal_setdir(path);
    }
    if (!message.member.voice.channel) {
        return message.channel.send('You must be in a voice channel to use this command.');
    }
    var connection : VoiceConnection = null
    if (!getVoiceConnection(message.guild.id)) {
        connection = joinVoiceChannel({
            channelId: message.member.voice.channelId, 
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
            });
    } else {
        connection = getVoiceConnection(message.guild.id);
    }

    comfile.execute(message, args, connection, getQueue(message));
    
}


function getQueue(message: Message) {
    if (message.guild && message.guild.id in queues) {
        return queues[message.guild.id];
    }
    return null;
}