const curr = require('../currency/init.js')
var data = require('../currency/data.json');
exports.run = async (bot, msg, args, queue, ytdl, ffmpeg, fs, pkg, opus, getTweet, playSong, newPlay, newestPhoto, blacklist ) => {
    var id = msg.author.id
    if (data.find(o => data.id === (id))) {
        return msg.reply("You have " + curr.getId(msg.author.id).balance + " shekels")
    } else {
        curr.newUser(id);
        return msg.reply("You have " + curr.getId(msg.author.id).balance + " shekels")
    }
    
}
exports.usage = () => {
    return "Used to check your shekel account balance"
} 