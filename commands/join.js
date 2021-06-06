const discord = require('discord.js')

exports.run = async (bot, msg, args) => {
    if (msg.member.voice.channel){
        const connection = await msg.member.voice.channel.join();
    }
    else{
        msg.reply('You need to join a voice channel first!');
    }
}

exports.usage = () => {
    return "Summon the bot to a voice channel"
}