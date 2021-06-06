//this whole file is old code from version 1
exports.run = async (bot, msg, args, queue, ytdl, ffmpeg, fs, pkg, opus, getTweet, playSong, newPlay, newestPhoto ) => {
    var voiceChannel = msg.member.voice.channel;
    var link = await ytdl.getInfo('https://www.youtube.com/watch?v=igc9XClqvMM')
    var linkTitle = link.player_response.videoDetails.title
    addQueue('https://www.youtube.com/watch?v=igc9XClqvMM', linkTitle, voiceChannel)

    async function addQueue(url, title, voiceChannel){
        var song = {title:String(title), url:url,}                  //creates an object with properties of title and url
        queue.push(song)                                            //  Array.push(n) adds n to the last index of Array
        if (queue.length > 1) {
            msg.channel.send(`Added ${song.title} to the queue`);
        }
        else {
            newPlay(voiceChannel, 0);
        }
    }
}
exports.usage = () => {
    return "A custom command for hoob"
}