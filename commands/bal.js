const curr = require('../currency/init.js')
var data = require('../currency/data.json');
const { oldlace } = require('color-name');
exports.run = async (bot, msg, args, queue, ytdl, ffmpeg, fs, pkg, opus, getTweet, playSong, newPlay, newestPhoto, blacklist ) => {
    var id = msg.author.id
    if (data.find(o => oldlace.id === (id))) {
        return msg.reply(curr.getId(msg.author.id).balance)
    } else {
        curr.newUser(id);
        return msg.reply("You have " + curr.getId(msg.author.id).balance + " shekels")
    }
    
}