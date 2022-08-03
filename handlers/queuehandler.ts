import { Client, Message } from 'discord.js';
import { joinVoiceChannel, getVoiceConnection, AudioPlayer, VoiceConnection, AudioPlayerState, AudioPlayerStatus, AudioResource, createAudioPlayer, entersState, NoSubscriberBehavior, VoiceConnectionDisconnectReason, VoiceConnectionState, VoiceConnectionStatus } from '@discordjs/voice';
import * as fs from 'fs';
import { Song } from '../interfaces/Song';
import { promisify } from 'util';
var queues: { [key: string]: Queue } = {};
module.exports = {
    name: 'message',
    description: 'Message handler',
    execute: execute,
    update: update,
    queues: queues
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
    if (getQueue(message) == null) {
        queues[message.guild.id] = new Queue(connection, message);
    }
    comfile.execute(message, args, connection, getQueue(message));
}


function getQueue(message: Message) : Queue | null {
    if (message.guild && message.guild.id in queues) {
        return queues[message.guild.id];
    }
    return null;
}

const wait = promisify(setTimeout);

//adapting code from https://github.com/eritislami/evobot/blob/master/structs/MusicQueue.ts

export class Queue {
    public readonly message: Message;
    public readonly connection: VoiceConnection;
    public readonly player: AudioPlayer;
    public readonly client: Client;

    public resource: AudioResource<Song>;
    public songs: Song[] = [];
    public currentSong: Song | undefined;
    public volume: number = 100;
    public loop: boolean = false;
    public shuffle: boolean = false;
    public muted: boolean = false;
    public lock: boolean = false;

    /**
     * @brief the constructor for the queue.
     * @param connection VoiceConnection to use for the player.
     * @param message the command message to use for the queue.
     */
    public constructor(connection: VoiceConnection, message: Message) {
        Object.assign(this, { connection, message });

        this.player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } })
        this.connection.subscribe(this.player);

        this.connection.on("stateChange", async (oldState: VoiceConnectionState, newState: VoiceConnectionState) => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                    try {
                        await entersState(this.connection, VoiceConnectionStatus.Connecting, 5_000);
                    } catch {
                        this.connection.destroy();
                    }
                } else if (this.connection.rejoinAttempts < 5) {
                    await wait((this.connection.rejoinAttempts + 1) * 5_000);
                    this.connection.rejoin();
                } else {
                    this.connection.destroy();
                }
            }
            else if (newState.status === VoiceConnectionStatus.Destroyed) { }
            else if (
                !this.lock &&
                (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)
            ) {
                this.lock = true;
                try {
                    await entersState(this.connection, VoiceConnectionStatus.Ready, 20_000);
                } catch {
                    if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) this.connection.destroy();
                } finally {
                    this.lock = false;
                }
            }
        })

        this.player.on("stateChange" as any, async (oldState: AudioPlayerState, newState: AudioPlayerState) => {
            if (oldState.status !== AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Idle) {
                if (this.loop && this.songs.length) {
                    this.songs.push(this.songs.shift()!);
                } else {
                    this.songs.shift();
                }

                this.processQueue();
            } else if (oldState.status === AudioPlayerStatus.Buffering && newState.status === AudioPlayerStatus.Playing) {
                this.sendPlayingMessage(newState);
            }
        });

        this.player.on("error", (error) => {
            console.error(error);
            if (this.loop && this.songs.length) {
                this.songs.push(this.songs.shift()!);
            } else {
                this.songs.shift();
            }
            this.processQueue();
        });
    }

    /**
     * @brief enqueues a song to the queue.
     * @param songs list of songs to add to the queue
     */
    public enqueue(...songs: Song[]) {
        this.songs = this.songs.concat(songs);
        this.processQueue();
    }
    /**
     * @brief Stops the player and clears the queue.
     */
    public stop() {
        this.lock = true;
        this.loop = false;
        this.songs = [];
        this.player.stop();

        setTimeout(() => {
            if (
                this.player.state.status !== AudioPlayerStatus.Idle ||
                this.connection.state.status === VoiceConnectionStatus.Destroyed
            )
                return;

            this.connection.destroy();
        }, 100);
    }

    private async processQueue(): Promise<void> {
        if (this.lock || this.player.state.status !== AudioPlayerStatus.Idle) {
            return;
        }

        if (!this.songs.length) {
            return this.stop();
        }

        this.lock = true;

        const next = this.songs[0];

        try {
            const resource = await next.makeResource();
            if (resource) {
                this.resource = resource!;
                this.player.play(this.resource);
                this.resource.volume?.setVolumeLogarithmic(this.volume / 100);
            }
        } catch (error) {
            console.error(error);

            return this.processQueue();
        } finally {
            this.lock = false;
        }
    }
    /**
     * @brief Sends a message to the channel that the queue is in what is currently playing.
     * @param state 
     * @promise Resolves when the message is sent. 
     */
    private async sendPlayingMessage(state: any): Promise<void> {
        const song = (state.resource as AudioResource<Song>).metadata;
        if (!song) return;
        let playingMessage: Message;

        try {
            playingMessage = await this.message.channel.send(`Now playing: ${song.title}`);
        }
        catch (error) {
            console.error(error);
        }
    }
}

function update(queue: Queue, guildId: string) {
    queues[guildId] = queue;
}