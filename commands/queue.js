const ytdl = require('ytdl-core');

exports.run = async (bot, msg, args) => {
    const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel){
            return msg.channel.send(
                "You need to be in a voice channel to play music!"
            );
        }

    const queue = new Map();
    async function getdetails() {
        if (args[1].includes("http://",)){
            ytdl.getInfo(args[1]) 
        }
        else if (args[1].includes("www.")){
            ytdl.getInfo(args[1])
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
                    msg.channel.bulkDelete(1);
                    ytdl.getInfo(this.videos[parseInt(m.content)-1].url)

                })
            })
        }
    }
    const songInfo = await getdetails()
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    };

    if (!serverQueue) {

    } else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    return msg.channel.send(`${song.title} has been added to the queue!`)
    }

    const queueConstruct = {
        textChannel: msg.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        playing: true,
    };
    queue.set(msg.guild.id, queueConstruct);
    queueConstruct.songs.push(song)
    try{
        var connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        play(msg.guild, queueConstruct.songs[0]);
    } catch (err) {
        console.log(err)
        queue.delete(msg.guild.id);
        return msg.channel.send(err);
    }
    function play(guild, song) {
        const serverQueue = queue.get(guild.id);
        if (!song) {
          serverQueue.voiceChannel.leave();
          queue.delete(guild.id);
          return;
        }
      }
    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
      })
        .on("error", error => console.error(error));
        serverQueue.textChannel.send(`Start playing: **${song.title}**`);

}
