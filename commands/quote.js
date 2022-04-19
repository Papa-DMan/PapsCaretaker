var quotes = require("../quotes.json")
const fs = require("fs")
exports.run = async (bot, msg, args, queue, ytdl, ffmpeg, fsg, pkg, opus, getTweet, playSong, newPlay, newestPhoto, blacklist ) => {

    if (args.length > 2 ) {
        let text = args
        let author = args.slice(-1).join('')
        text.length = text.length -2
        text = text.join(' ')
        let guid = msg.guild.id
        let quote = {guild: guid, text: text, author: author}
        quotes.push(quote)
    }
    else{
        if (args.length > 0) {
            try {
                msg.channel.send(quotes[quotes.indexOf(args[0])]) 
            }
            catch (err) {
                msg.channel.send("I have no quotes from that person on record")
            }
        } else{
            var tmparr = []
            for (var i in quotes) {
                if (quotes[i].guild === msg.guild.id) {
                    tmparr.push(quotes[i])
                }
            }
            if (tmparr.length === 0) {
                return msg.channel.send("There are no quotes for this server. To add a quote type !quote *insert quote here* - *author*.");
            } else {
                let rand = Math.round(Math.random()*(tmparr.length - 1))
                msg.channel.send(tmparr[rand].author + ' said "' + tmparr[rand].text + '"')
            }
        }
    }

    
    fs.writeFileSync("./quotes.json", JSON.stringify(quotes))
}


exports.usage = () => {
    return "Use !quote to get a random quote from the bot. To add a quote type !quote *insert quote here* - *author*.";
}