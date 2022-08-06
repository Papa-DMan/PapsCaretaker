import { DiscordGatewayAdapterCreator, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { channelLink, Message } from "discord.js";
import { Queue, } from "../handlers/queuehandler";
import {Song} from "../interfaces/Song";
const ytsearch = require("yt-search");
const spotifyhandler = require("../handlers/messagehandler");
const queuehandler = require("../handlers/queuehandler");

module.exports = {
    name: 'play',
    description: 'Play a song',
    usage: 'play <song> | URL or Search Query',
    execute: execute,
    interact: interact,
    __internal_is_music: true
}
async function execute(message: Message, args: string[], connection: VoiceConnection, queue: Queue) {
    if (!message || !message.member || !message.guild) return;
    if (queue && (message.member!.voice.channelId !== queue.connection.joinConfig.channelId)) {
        console.log(queue)
        console.log(message.member!.voice.channelId)
        console.log(queue.connection.joinConfig.channelId)
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
    else {
        let r = await ytsearch(url)
        let results = r.videos;
        if (results.length === 0) {
            return message.channel.send(`Could not find a song with the name ${url}.`);
        }
        let song: Song;
        try {
            song = await Song.from(results[0].url, results[0].title);
        }
        catch (error) {
            return message.channel.send(`Could not play song.`);
        }
        if (queue) {
            queue.enqueue(song);
            queuehandler.update(queue, message.guild.id);
            return message.channel.send(`Added ${song.title} to the queue.`);
        } else {
            const newQueue = new Queue(connection, message);
            newQueue.enqueue(song);
            queuehandler.update(newQueue, message.guild.id);
            return message.channel.send(`Now playing ${song.title}`);
        }
    }
}








async function interact(message: Message, args: string[], connection: VoiceConnection, queue: Queue) {
}