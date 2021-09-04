exports.run = async (bot, msg, args, queue, ytdl, ffmpeg, fs, opus, getTweet, playSong, newPlay, newestPhoto ) => {
    var voiceChannel = msg.member.voice.channel
    if (msg.channel.type !== 'text') return
    if (!voiceChannel) {
        return msg.reply("You must first join a voice channel!")
    }
    if (args[0] === undefined) {
        return msg.reply("You need to say what you want to play!")
    }
    
    if (args[0] === "1") {
        play(1)
    }
    if (args[0] === "2") {
        play(2)
    }
    if (args[0] === "3") {
	play(3)
    }
    async function play(i) {
        const connection = await voiceChannel.join()
        const dispatcher = connection.play(`./wcb/${i}.mp3`)
        dispatcher.on('finish', () => {
            voiceChannel.leave()
        })
    }
}
