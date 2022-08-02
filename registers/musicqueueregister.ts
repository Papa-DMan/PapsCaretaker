import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import { Client, Message } from "discord.js";
import { Song } from "../interfaces/Song";

//adapting code from https://github.com/eritislami/evobot/blob/master/structs/MusicQueue.ts

class Queue {
    public readonly message: Message;
    public readonly connection: VoiceConnection;
    public readonly player: AudioPlayer;
    
    public songs: Song[] = [];
    public currentSong: Song | undefined;
    public volume: number = 100;
    public loop: boolean = false;
    public shuffle: boolean = false;
    public muted: boolean = false;
    public lock: boolean = false;
}

//create a map variable to store the queues for each guild

const musicqueues = new Map<string, Queue>();


module.exports = {
    name: "Queue Register",
    description: "Registers queue variables",
    execute: execute
}

function execute(client: Client, token: string, path: string) {
    if (!client.user) return
    client.guilds.cache.forEach(async guild => {
        musicqueues.set(guild.id, new Queue());
    })
}