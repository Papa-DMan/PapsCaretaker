const search = require('yt-search');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');

// aka the oh fuck it's broke command
exports.run = async (bot, msg, args, queue, opus) => {
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel)
        return msg.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
            queue.length = 0
            voiceChannel.leave()
            
}