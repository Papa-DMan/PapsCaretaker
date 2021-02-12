exports.run = async (bot, msg, args, queue, playSong, newPlay) => {
    var voiceChannel = msg.member.voice.channel
    if (msg.channel.type !== 'text') return
    if (!voiceChannel) {
        return msg.reply("You must first join a voice channel!")
    }
    if (queue.length == 1) {
        return voiceChannel.leave()
    }else {

    if (args[0] == null) {
        var i = 1
    } else {
        i = args[0]
    }
    queue.shift(i)
    newPlay(voiceChannel, 1)
    }
}