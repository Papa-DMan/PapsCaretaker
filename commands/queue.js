exports.run = (bot, msg, args, queue) => {  //eventually want to make this use embeds
    var qarr = []                           //https://discordjs.guide/popular-topics/embeds.html
    if (queue.length == 0) {                //I would like it to be similar to rhythm
        return msg.reply("The Queue is empty, load up some sick tunes")
    }
    for (let i = 1; i < queue.length && i < 25; i++) {
        qarr.push(i + ". " + queue[i].title)
    }


    msg.channel.send("Now Playing : " + queue[0].title + '\n' + "Queue: " + qarr.join('\n'))
}
exports.usage = () => {
    return "View the music queue"
}