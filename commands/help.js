const Discord = require('discord.js')
var fs = require('fs')
var files = fs.readdirSync("./commands/")
exports.run = async (bot, msg, args) => {
    var commands = []
    for (var i in files) {
        let command = files[i]
        let usage = 'N/A'
        try {
            delete require.cache[require.resolve(`./${command}`)];
            let commandFile = require(`./${command}`);
            usage = commandFile.usage()
        } catch (e) {
            console.log(e.stack);
        }
        commands.push({name: files[i], usage: usage})
    }
    if (args.length === 0) {
        const commandsEmbed = new Discord.MessageEmbed()
            .setTitle('All Commands')
        for (var j in commands) {
            let command = commands[j]
            commandsEmbed.addField(command.name.slice(0, -3), command.usage)
        }
        msg.author.send(commandsEmbed)
    }
}

exports.usage = () => {
    return "To get information on how to use this bot"
}