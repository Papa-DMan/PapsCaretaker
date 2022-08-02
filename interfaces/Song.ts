import { AudioResource, createAudioResource, StreamType } from '@discordjs/voice';
import ytdl from 'ytdl-core';

export interface SongData {
    title: string;
    url: string;
    duration: number;
    thumbnail?: string;
    artist?: string;
    album?: string;
}

export class Song {
    public readonly title: string;
    public readonly url: string;
    public readonly duration: number;
    public readonly thumbnail?: string;
    public readonly artist?: string;
    public readonly album?: string;

    public constructor({ title, url, duration , artist = null, album = null, thumbnail = null}: SongData) {
        this.title = title;
        this.url = url;
        this.duration = duration;
        this.artist = artist;
        this.album = album;
        this.thumbnail = thumbnail;
    }
    public static async from(url: string = "", search: string = ""): Promise<Song> {
        if (url.includes("youtu")) {
            const resp = await ytdl.getInfo(url);
            let title : string = resp.videoDetails.title;
            let duration : number = parseInt(resp.videoDetails.lengthSeconds);
            let video_url: string = resp.videoDetails.video_url;
            let thumbnail: string = resp.videoDetails.thumbnail.thumbnails[0].url;
            let artist: string = resp.videoDetails.author.name;
            return new Song({ title, url: video_url, duration , artist, thumbnail });
        }
        throw new Error("Invalid URL");
    }
    public async makeResource(): Promise<AudioResource<Song> | void> {
        let stream;

        let type = this.url.includes("youtube.com") ? StreamType.Opus : StreamType.OggOpus;

        const source = this.url.includes("youtube") ? "youtube" : "soundcloud";

        if (source === "youtube") {
            stream = await ytdl(this.url, { filter: "audioonly" });
        }
        if (!stream) return

        return createAudioResource(stream, { metadata: this, inputType: type, inlineVolume: true });
    }
}