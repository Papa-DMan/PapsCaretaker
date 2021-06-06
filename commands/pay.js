const curr = require('../currency/init.js')
var data = require('../currency/data.json')
exports.run = async (bot, msg, args, queue, ytdl, ffmpeg, fs, pkg, opus, getTweet, playSong, newPlay, newestPhoto, blacklist ) => {
    
    var sender = msg.author.id()
    var reciever = msg.mentions.user.first().id
    var ammount = args[1]
    if (curr.getId(sender).balance < ammount) return msg.reply("Insufficient Shekels")
    curr.getId(sender).balance = curr.getId(sender).balance - ammount
    curr.getId(reciever).balance += ammount
    curr.writeData(data)
}
exports.usage = () => {
    return "pay someone shekels"
}