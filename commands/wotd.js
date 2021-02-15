const fs = require('fs');
exports.run = (bot, msg, args,) => {
    var tweet = fs.readFileSync(__dirname + '/../tweets.txt', 'utf8')
    //msg.channel.send("@everyone" +", The Don Cheadle word of the day!")
    msg.channel.send(tweet)
}