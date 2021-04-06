const fs = require('fs'); //imports the fs module
/*
The fs module is the file system module and I'm using it to store information outside of memory so when I stop and start the program it can have information from the last time it was running
for most modules imported like this you can hover over anything from it and in vs code it will tell you what it expects as inputs from calling a function or when coding it will have auto complete
options with tab

*/
exports.run = (bot, msg, args,) => {                       
    var tweet = fs.readFileSync(__dirname + '/../tweets.txt', 'utf8')   //reads the file from one directory up (..) called tweets.txt and gets the contents as a string
    //msg.channel.send("@everyone" +", The Don Cheadle word of the day!")
    msg.channel.send(tweet)
}