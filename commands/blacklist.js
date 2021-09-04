exports.run = async (bot, msg, args, queue, ytdl, ffmpeg, fs, pkg, opus, getTweet, playSong, newPlay, newestPhoto, blacklist ) => {

    var uid = msg.mentions.users.first().id
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

exports.usage = () => {
    return "Blacklist a user form interacting with this bot";
}