//this whole file is old code from version 1
exports.run = async (bot, msg, args, queue, ytdl, ffmpeg, fs, pkg, opus, getTweet, playSong, newPlay, newestPhoto ) => {
    var voiceChannel = msg.member.voice.channel
    const connection = await voiceChannel.join()
    const dispatcher = connection.play('./memes/positive.mp4')
    dispatcher.on('finish', () => {
        voiceChannel.leave()
    })
}
exports.usage = () => {
    return "A custom command for testing bositive"
}