const Discord = require.resolve('discord.js');
const search = require('yt-search');
const ytdl = require('ytdl-core');
const opus = require('@discordjs/opus');
const ffmpeg = require('ffmpeg-static');
let old;
exports.run = async (bot, msg, args, musicUrls) => {
    if (msg.channel.type !== 'text') return;
    let url = args[1];


    const voiceChannel = msg.member.voice.channel;
    let flag = musicUrls.some(element => element === url);
    if (!voiceChannel) {
        return msg.reply('You need to join a voice channel first!');
    }
    if (!flag){
        const title = ytdl.name(url);
        musicUrls.push(url);
        if(voiceChannel != null){
            if(voiceChannel.connection){
                msg.channel.send(`Added ${title} to the queue`)
            }
            else {
                try{
                    const voiceConnection = await voiceChannel.join();
                    await playSong(messagechannel, voiceConnection, voiceChannel);
                }
                catch(ex){
                    console.log(ex);
                }
            }
        }
   
    }
}

async function playSong(messageChannel, voiceConnection, voiceChannel){
    const stream = ytdl(musicUrls[0], {filter : 'audioonly'})
    const dispatcher = voiceConnection.playStream(stream);

    dispatcher.on('finish', () => {
        musicUrls.shift();

        if(musirUrls.length == 0)
            voiceChannel.leave();
        else{
            setTimeout(() => {
                playSong(messageChannel, voiceChannel, voiceChannel);
            }, 1000)
        }
    });
}