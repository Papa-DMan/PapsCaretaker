const fs = require('fs'); //imports the fs module
/*
The fs module is the file system module and I'm using it to store information outside of memory so when I stop and start the program it can have information from the last time it was running
for most modules imported like this you can hover over anything from it and in vs code it will tell you what it expects as inputs from calling a function or when coding it will have auto complete
options with tab

*/
exports.run = async (bot, msg, args,) => {                       
    var tweet = await fs.readFileSync("tweets.txt", 'utf8')
    var channels = require('./../channels.json')
    if (args[0] == 'enable') {
        if (!channels.includes(msg.channel.id)) {
            channels.push(msg.channel.id)
            fs.writeFile('./channels.json', JSON.stringify(channels), (err) => {
                if (err) throw err
            })
            msg.channel.send("Subscribed to the Don Cheadle word of the day!")
        } else {
            msg.channel.send("This channel is already subscribed to the Don Cheadle word of the day!")
        }

    } else if (args[0] == 'disable'){
        let forDeletion = msg.channel.id
        channels = channels.filter(item => !forDeletion.includes(item))
        fs.writeFile(__dirname + './channels.json', JSON.stringify(channels), (err) => {
            if (err) throw err
        })
        msg.channel.send("Unsubscribed to the Don Cheadle word of the day!")
    } else{
        if (tweet !== "") {
            msg.channel.send(tweet)
        }
    } 
}