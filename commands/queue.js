exports.run = (bot, msg, args, queue) => {
    var qstring = queue.join(',')
    var qarr = qstring.split(',')
    const removeNth = (arr, n) => {
        for(let i = n-1; i < arr.length; i += n){
            arr.splice(i, 1);
        };
    };
    removeNth(qarr, 1);
    qarr[0] = qarr[0] + " (Playing)" 

    for (let x = 1; x < qarr.length; x++) {
        qarr[x] = String(x) + ". " + qarr[x]
    }
    msg.channel.send("Queue: " + qarr.join('\n'))
}