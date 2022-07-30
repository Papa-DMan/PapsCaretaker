import { ChatInputCommandInteraction, CacheType } from "discord.js";

module.exports = {
    name: 'ping',
    description: "Pong!",
    usage: "ping",
    execute(message, args) {
        message.channel.send('Pong!');
    },
    interact (interaction: ChatInputCommandInteraction<CacheType>) {
        interaction.reply('Pong!');
    }
}
