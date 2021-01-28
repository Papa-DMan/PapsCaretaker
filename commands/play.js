exports.run = async (bot, msg, args, queue, search, ytdl, ffmpeg, fs, pkg, opus,) => {
    
    var voiceChannel = msg.member.voice.channel;
    

    if (msg.channel.type !== 'text') return
    if (!voiceChannel) {
        return msg.reply("You must first join a voice channel!")
    }

    if (args[0].includes("http://")){
        let url = args[1];
        addQueue(url)
        }
    if (args[0].includes("https://")){
        let url = args[1];
        addQueue(url)
        }
    else if (args[0].includes("www.")){
        let url = args[1];
        addQueue(url)
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
    queue.push(url)
    var i = queue.length - 1
    var x = queue[i]
    queue[i] = []
    queue[i][0] = x
    queue[i][1] = String(title)
    if (queue.length > 1) {
        msg.channel.send(`Added ${title} to the queue`);
    }
    else {
        playSong(voiceChannel);
    }
}

async function playSong(voiceChannel){
    voiceChannel.join().then(connection => {
        const stream = ytdl(queue[0][0], { filter: 'audioonly' });
        const title = queue[0][1]
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
}