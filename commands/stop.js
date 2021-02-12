const search = require('yt-search');
const ytdl = require('ytdl-core');
const opus = require('@discordjs/opus');
const ffmpeg = require('ffmpeg-static');
exports.run = async (bot, msg, args, queue) => {
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel)
        return msg.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
            queue.length = 0
            voiceChannel.leave()
            
}