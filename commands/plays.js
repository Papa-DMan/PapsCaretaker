const Discord = require.resolve('discord.js');
const search = require('yt-search');
const ytdl = require('ytdl-core');
const opus = require('@discordjs/opus');
const ffmpeg = require('ffmpeg-static');
const main = require('/Users/mahan/Desktop/Discord Bot/index-new')
let musicUrls = [];
exports.run = async (bot, msg, args) => {
    let musicUrls = [];
    const voiceChannel = msg.member.voice.channel;
    
    if (msg.channel.type !== 'text') return;
    if (!voiceChannel) {
        return msg.reply('You need to join a voice channel first!');
    }
    if (args[1].includes("http://",)){
        let url = args[1];
        addQueue(url)
        }
    else if (args[1].includes("www.")){
        let url = args[1];
        addQueue(url)
    }
    else{
        var params = args.slice(1).join(' ');
        search(params, async function(err, res) {
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
                    addQueue(url)
                });
            });
        });
    }
}
    async function addQueue(url, voiceConnection, voiceChannel){
        console.log('got to addQueue function')
        musicUrls.push(url);
        ytdl.getInfo(url, function(err, info){
            const title = info.title;
        });
        if (musicUrls !=null){
            msg.channel.send(`Added ${title} to the queue`);
            await playSong(voiceConnection, voiceChannel);
        }
        else {
            playSong(voiceConnection, voiceChannel);
        }
    }

async function playSong(voiceConnection, voiceChannel){
    console.log('got to playSong function')
    const stream = ytdl(musicUrls[0], {filter : 'audioonly'})
    const dispatcher = voiceConnection.playStream(stream);
    console.log(musicUrls[0]);

    dispatcher.on('finish', () => {
        musicUrls.shift();

        if(musicUrls.length == 0)
            voiceChannel.leave();
        else{
            setTimeout(() => {
                playSong(voiceChannel, voiceChannel);
            }, 1000)
        }
    });
}
