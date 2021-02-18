const search = require('yt-search');
const ytpl = require('ytpl')
const needle = require('needle');
const spotify = require('')
exports.run = async (bot, msg, args, queue, ytdl, ffmpeg, fs, pkg, opus, getTweet, playSong, newPlay ) => {
    
    var voiceChannel = msg.member.voice.channel;
    

    if (msg.channel.type !== 'text') return
    if (!voiceChannel) {
        return msg.reply("You must first join a voice channel!")
    }
    if (args[0] === undefined) {
        return msg.reply("You need to say what you want to play!")
    }

    if (args[0].includes("http://") || args[0].includes("https://") || args[0].includes("www.")){
        if (args[0].includes("playlist")) {
            const playlist = await ytpl(args[0].toString())
            for (var i = 0; i < playlist.items.length; i++) {
                addPQueue(playlist.items[i].url, playlist.items[i].title, voiceChannel)
            }
            msg.channel.send(`Added ${playlist.title} to the queue (${playlist.items.length} songs added)`)
            newPlay(voiceChannel, 0);
        } else {
            addQueue(args[0])
        }

        }
    else{
        var params = args.slice().join(' ');
        await search(params, async function(err, res) {
            if (err) return msg.channel.send("Sorry, something went wrong.");

            let videos = res.videos.slice(0, 5);
            let resp ='';
            for (var i in videos){
                resp += `**[${parseInt(i)+1}]:** \`${videos[i].title}\`\n`;
            }
            resp += `\n**Choose a number between \`1-${videos.length}\``;

            message = await msg.channel.send(resp);
            

            const filter = m => !isNaN(m.content) && m.content < videos.length+1 && m.content > 0;
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
    var song = {title:String(title), url:url,}
    queue.push(song)
    if (queue.length > 1) {
        msg.channel.send(`Added ${song.title} to the queue`);
    }
    else {
        newPlay(voiceChannel, 0);
    }
}   
async function addPQueue(url, title,){
    var song = {title:String(title), url:url,}
    queue.push(song)
}   
}