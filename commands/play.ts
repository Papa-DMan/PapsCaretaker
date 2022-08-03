import { DiscordGatewayAdapterCreator, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { channelLink, Message } from "discord.js";
import { Queue, } from "../handlers/queuehandler";
import {Song} from "../interfaces/Song";
const spotifyhandler = require("../handlers/messagehandler");
const queuehandler = require("../handlers/queuehandler");

module.exports = {
    name: 'play',
    description: 'Play a song',
    usage: 'play <song> | URL or Search Query',
    execute: execute,
    interact: interact
}
async function execute(message: Message, args: string[], connection: VoiceConnection, queue: Queue) {
    if (queue && message.member!.voice.id !== queue.connection.joinConfig.channelId) {
        return message.channel.send(`You must be in the same voice channel as the bot to use this command.`);
    }
    if (args.length === 0) {
        return message.channel.send(`You must provide a song to play.`);
    }
    const url = args[0];

    if (url.includes("spotify")) {
        return spotifyhandler.execute(message, args, connection, queue);
    }
    if (url.includes("youtube")) {
        let song: Song;
        try {
            song = await Song.from(url, args.join(" "));
        } catch (error) {
            return message.channel.send(`Could not play song.`);
        }

        if (queue) {
            queue.songs.push(song);
            queuehandler.update(queue, message.guild.id);
            return message.channel.send(`Added ${song.title} to the queue.`);
        }

        const newQueue = new Queue(
            joinVoiceChannel({
              channelId: message.channel.id,
              guildId: message.guild.id,
              adapterCreator: message.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
            }),
            message
          );
        newQueue.songs.push(song);
        queuehandler.update(newQueue, message.guild.id);
    }
}








async function interact(message: Message, args: string[], connection: VoiceConnection, queue: Queue) {
}