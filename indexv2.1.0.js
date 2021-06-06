const Discord = require('discord.js');              //import different packages
const bot = new Discord.Client();
const pkg = require('./package.json');
const ytdl = require('ytdl-core');
const opus = require('@discordjs/opus');
const ffmpeg = require('ffmpeg-static');
const checkUpdate = require('check-update-github');
const fs = require('fs');
const Twitter = require('twitter');
const needle = require('needle');

//var access = fs.createWriteStream('./log/Caretaker.log');
//process.stdout.write = process.stderr.write = access.write.bind(access);

//process.on('uncaughtException', function(err) {
//    console.error((err && err.stack) ? err.stack : err);
//  });

/* Project Notes:
To create a new command create a new js file in the commands folder and start the code with: 
exports.run = async (bot, msg, args, queue, ytdl, ffmpeg, fs, pkg, opus, getTweet, playSong, newPlay, newestPhoto, blacklist ) => {
    Main functions / Methods go inside this exports.run call. All variables inside the parenthecies are accessable
}

*/

/* General Visual Studio Code stuff:
VS code will typically autocomplete when it knows what you're doing. Press tab to autocomplete
When typing {} [] () '' "" `` the end or second is automatically typed for you
pressing the ctrl key while clicking on a variable or function will show you / take you to where it is defined
DOES NOT AUTO SAVE
*/


/* General Javascript stuff:
Javascript is a more relaxed java ie don't need semicolons after every line don't need to define variable types 
don't need return types in functions
don't need private and public

ctrl + click on link to go to it, it's a good simple guide on most javascript stuff:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
*/

//MAKE SURE TO DISCONNECT FROM VPN WHEN FINISHED

const endpointUrl = 'https://api.twitter.com/2/tweets/search/recent'  //url for twitter api

async function getTweet(xd) {                                           //method / function for getting the latest tweet form @doncheadlewotd
    var handle = xd
    const params = {                                                        //parameters required by twitter api
        'query': `from:${handle}`,
        'tweet.fields': 'id,attachments,entities',
        'media.fields': 'duration_ms,height,media_key,non_public_metrics,organic_metrics,preview_image_url,promoted_metrics,public_metrics,type,url,width',
        'expansions' : 'attachments.media_keys',
    }
    const res = await needle('get', endpointUrl, params, { headers: {
        "authorization": `Bearer ${pkg.twittertoken}`
    }})

    if (res.body) {
        return res.body
    } else {
        throw new Error ('Unsuccessful Request')
    }
}

var twitterClient = new Twitter({
    consumer_key: pkg.twitterkey,
    consumer_secret: pkg.twittersecret,
    bearer_token: pkg.twittertoken
})

var params = {screen_name: 'nodejs'}
twitterClient.get('statuses/user_timeline', params, function(error, tweets, response) {
    if  (!error) {
        console.log("memes")
    }
})

//initialzing bot and any variables
bot.login(pkg.token);
var servers = {};
var version = pkg.version
const PREFIX = '!';
var time = 0;

var queue = [];

bot.on('ready', async() =>{
    console.log(`Pap's Caretaker is online! Version: ` + version);
})



bot.on('message', async msg=>{                                          //on any message do the following code:
    var blacklist = require('./blacklist.json')

    if (!msg.guild) return;                                     //if the message isn't in a server don't do anything with it
    if (msg.author.bot) return;                                 //if the author of a message is a bot don't do anything
    //if (blacklist.find(msg.author.id)) return
    if (!msg.content.startsWith(PREFIX)) return;                //if the message doesn't start with the prefix don't do anything

    let args = msg.content.substring(PREFIX.length).split(" "); //create the ars list by splitting the input string by a space character
    let command = args.shift().toLowerCase();                   //create variable command that is the first index of the arg and make it lowercase

        try {                                                   //function(method) that on every message check for a new word of the day
            const response = await getTweet('CheadleWOTD')
            var newestPhoto = response.includes.media[0].url
            var tCheck = await fs.readFileSync("tweets.txt", 'utf8')
            var subbedchannels = require('./channels.json')
            if (tCheck != newestPhoto) {
                }
                for (var i = 0; i < subbedchannels.length; i++) {
                    bot.channels.cache.get(subbedchannels[i]).send("@everyone yo " + newestPhoto).then(sent => {
                        const { channel } = sent
                        if (channel.type === 'news'){
                            sent.crosspost()
                        }
                    })
                }
                //bot.channels.cache.get('382317766310625280').send("@everyone yo " + newestPhoto)
		        //bot.channels.cache.get('811629867170529290').send("@everyone yo " + newestPhoto)
                fs.writeFile('tweets.txt', newestPhoto, (err) => {
                    if (err) throw err
                })
            }
        } catch (f) {
            console.log(f)
        }
        try {                                                       //if the command arg from earlier matches the name of any of the files in the commands folder send it varibles and try to run it
            delete require.cache[require.resolve(`./commands/${command}.js`)];
    
            let commandFile = require(`./commands/${command}.js`);
            commandFile.run(bot, msg, args, queue, ytdl, ffmpeg, fs, pkg, opus, getTweet, playSong, newPlay, newestPhoto )
        } catch (e) {
            //msg.reply("This guy is retarded, that's not a command", {
            //    tts: true
            //})
            console.log(e.stack);
        }
        




    async function newPlay(voiceChannel, i) {                       //function(method) with the input of voiceChannel and variable i
        const connection = await voiceChannel.join();               // wait for the bot to join a voiceChannel and set connection to that
        var url = queue[0].url                                      //create url variable from the first object of the queue array and get the url property from it
        const stream = await ytdl(queue[0].url, { filter: 'audioonly' });       //create an audio stream using the ytdl package and according to its documentation input the url to stream and any filters
        const title = queue[0].title                                
        msg.channel.send(`Now playing ${title}`);                   // typically "" and '' are used for strings but using `` allows to create a string that includes a variable without having to use +
        const dispatcher = connection.play(stream)
        dispatcher.on("finish", () => {                             // the .on is uesd for when an event happens so when the dispatcher claims it's finished run the following code
            queue.shift()                                           // .shift removes the first index of an array and moves the next index to the first index and so on
            if (queue.length == 0 || voiceChannel.members.size == 0) {
                voiceChannel.leave()
            }
            else {
                setTimeout(() => {                                  //setTimeout will run the following code, wait time in ms
                    newPlay(voiceChannel, 0);
                }, 4000)
            }
        })
    }


    function playSong(voiceChannel){                                // old playSong function. It's still included in case something still uses it. it still works so just in case it's still referenced.
        voiceChannel.join().then(connection => {
            const stream = ytdl(queue[0].url, { filter: 'audioonly' });
            const title = queue[0].title
            msg.channel.send(`Now playing ${title}`);
            const dispatcher = connection.play(stream);
            dispatcher.on("finish", () => {
                queue.shift();
                if(queue.length == 0)
                    voiceChannel.leave();
                else{
                    setTimeout(() => {
                        playSong(voiceChannel);
                    }, 4000)
                }
            })
        });
    }
})
