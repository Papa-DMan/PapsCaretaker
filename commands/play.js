const search = require('yt-search'); //package for searching youtube
const ytpl = require('ytpl')        //playlist package premade
const needle = require('needle');   //webhook package to talk with apis
const { Base } = require('discord.js'); //discords package
const pkg = require('../package.json') // import the package.json file

exports.run = async (bot, msg, args, queue, ytdl, ffmpeg, fs, opus, getTweet, playSong, newPlay ) => {

    var client_id = pkg.spotifyclient_id                        //when importing a json file it creates an object so grabbing a parameter from an object and giving it a variable
    var client_secret = pkg.spotifyclient_secret
    
    var voiceChannel = msg.member.voice.channel;

    if (msg.channel.type !== 'text') return
    if (!voiceChannel) {
        return msg.reply("You must first join a voice channel!")
    }
    if (args[0] === undefined) {
        return msg.reply("You need to say what you want to play!")
    }

    if (args[0].includes("http://") || args[0].includes("https://") || args[0].includes("www.")){
        if (args[0].includes("spotify")) {                      // all spotify playlist urls follow this pattern: https://open.spotify.com/playlist/playlist_id/ so we know to test if the url has spotify
            
            var url = args[0].split('/')                        // .split(b) will create a new list from a string with the seperator b
            var playlist_id = url[url.length -1].split('?')[0]; //get the last index of the url lsit and remove everything after the "?"
            var access_token = await spotAuth()                 // authenticate using the spotAuth() function
            const spotres = await needle('get', `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, { headers: {      //according to the spotify api documentation do a git request at the given url with a header with the authentication token
                'Authorization': `Bearer ${access_token}`
            }})
            for (var d = 0; d < spotres.body.items.length; d++) {                                   //spotres returns an object with an items array that contains all the tracks
                await search(spotres.body.items[d].track.name, async function(err, resp) {          //search requires an input of a url and will return an error and a response
                    if (err) return console.log(err);
                    if (resp.videos[0] !== undefined){
                        addPQueue(resp.videos[0].url, resp.videos[0].title)
                    }
                })
            }
            return newPlay(voiceChannel, 0);
        }
        if (args[0].includes("playlist")) {
            const playlist = await ytpl(args[0].toString())     //ytpl takes a youtube playlist url and returns an object with an items array with all the songs and urls as properties
            for (var i = 0; i < playlist.items.length; i++) {
                addPQueue(playlist.items[i].url, playlist.items[i].title)
            }
            msg.channel.send(`Added ${playlist.title} to the queue (${playlist.items.length} songs added)`)
            newPlay(voiceChannel, 0);
        } else {
            addQueue(args[0])
        }
    }

    else{
        var params = args.slice().join(' ');                    //split the args array up and join each index with a space to create a string to search for
        await search(params, async function(err, res) {         //search returns error and response objects
            if (err) return msg.channel.send("Sorry, something went wrong.");

            let videos = res.videos.slice(0, 5);
            let resp ='';
            for (var i in videos){
                resp += `**[${parseInt(i)+1}]:** \`${videos[i].title}\`\n`;
            }
            resp += `\n**Choose a number between \`1-${videos.length}\``;

            message = await msg.channel.send(resp);
            

            const filter = m => !isNaN(m.content) && m.content < videos.length+1 && m.content > 0;  //this code was just copy pasted form the discord js documentation and it works so it is what it is. I'm not even sure what it does exactly
            const collector = msg.channel.createMessageCollector(filter);
            collector.videos = videos;

            collector.once('collect', async function (m){
                voiceChannel.join().then(connection => {
                    msg.channel.bulkDelete(1);
                    let url = this.videos[parseInt(m.content)-1].url;
                    let title = this.videos[parseInt(m.content)-1].title;
                    addQueue(url, title, voiceChannel)
                });
            });
        });
    }
    
async function addQueue(url, title, voiceChannel){
    var song = {title:String(title), url:url,}                  //creates an object with properties of title and url
    queue.push(song)                                            //  Array.push(n) adds n to the last index of Array
    if (queue.length > 1) {
        msg.channel.send(`Added ${song.title} to the queue`);
    }
    else {
        newPlay(voiceChannel, 0);
    }
}   
async function addPQueue(url, title,){                      //since both playlists are run in loops a new function was created to add songs to the queue without calling a play function at the end
    var song = {title:String(title), url:url,}
    queue.push(song)
}
async function spotAuth() {             // according to the spotify api need to get a new key every hour. To get a key must make a post to a url with a base64 encoded string
    const authparams = {
        'grant_type': 'client_credentials',
    }
    var encloded = new Buffer.from(client_id + ':' + client_secret)
    const authres = await needle("post", 'https://accounts.spotify.com/api/token',authparams, { headers: { 
        'Authorization': 'Basic ' + encloded.toString('base64'),
    }})
    //console.log(authres)
    //console.log(encloded.toString("utf8"))
    // fs.writeFile("spotify.json", JSON.stringify(authres), (err) => {
    //     if (err) throw err
    // })
    return authres.body.access_token
}
}