const search = require('yt-search');
const ytdl = require('ytdl-core');
const opus = require('@discordjs/opus');
const ffmpeg = require('ffmpeg-static');
let old;
exports.run = async (bot, msg, args) => {
    if (msg.channel.type !== 'text') return;

    const voiceChannel = msg.member.voice.channel;

    if (!voiceChannel) {
        return msg.reply('You need to join a voice channel first!');
    }
    if (args[1].includes("http://",)){
        voiceChannel.join().then(connection => {
            const stream = ytdl(args[1], { filter: 'audioonly' });
            const dispatcher = connection.play(stream);

            dispatcher.on('finish', () => voiceChannel.leave());
        })
    }
    else if (args[1].includes("www.")){
        voiceChannel.join().then(connection => {
            const stream = ytdl(args[1], { filter: 'audioonly' });
            const dispatcher = connection.play(stream);

            dispatcher.on('finish', () => voiceChannel.leave());
        
        })
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
                    message.edit(`Now playing ${this.videos[parseInt(m.content)-1].title}`);
                    const stream = ytdl(this.videos[parseInt(m.content)-1].url, { filter: 'audioonly' });
                    const dispatcher = connection.play(stream);
            
                    dispatcher.on('finish', () => voiceChannel.leave());
                
                });
            });
        });
    }
}