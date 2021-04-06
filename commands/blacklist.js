exports.run = async (bot, msg, args, queue, ytdl, ffmpeg, fs, pkg, opus, getTweet, playSong, newPlay, newestPhoto, blacklist ) => {

    var uid = msg.mentions.user.first().id
    if (blacklist.includes(uid)) {
        var forDelete = blacklist.findIndex(uid)
        blacklist.splice(forDelete, 1)
    } else {
        blacklist.push(uid)
    }
    fs.writeFile('./blacklist.json', JSON.stringify(blacklist), (err) => {
        if (err) throw err
    })
}