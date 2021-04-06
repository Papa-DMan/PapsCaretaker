exports.run = async (bot, msg, args, queue, search, ytdl, ffmpeg, fs, pkg, opus,) => {
    async function playSong(voiceChannel){
        voiceChannel.join().then(connection => {
            const stream = ytdl('https://www.youtube.com/watch?v=igc9XClqvMM', { filter: 'audioonly' });
            const title = "hoob's anthom"
            msg.channel.send(`Now playing ${title}`);
            const dispatcher = connection.play(stream);
            dispatcher.on("finish", () => {
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