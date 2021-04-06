exports.run = (bot, msg, args, queue) => {
    var qarr = []
    if (queue.length == 0) {
        return msg.reply("The Queue is empty, load up some sick tunes")
    }
    for (let i = 1; i < queue.length; i++) {
        qarr.push(i + ". " + queue[i].title)
    }


    msg.channel.send("Now Playing : " + queue[0].title + '\n' + "Queue: " + qarr.join('\n').substring(0, 1000))
}