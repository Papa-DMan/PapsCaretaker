import { ChatInputCommandInteraction, CacheType, Message } from 'discord.js';
import * as fs from 'fs';
var rootdir = ".";


module.exports = {
    name: 'wotd',
    description: 'Shows the word of the day.',
    usage: "wotd [enable|disable]",
    options: [{
        name: 'enable',
        description: 'Enables the word of the day in this channel.',
        type: 1
    }, {
        name: 'disable',
        description: 'Disables the word of the day in this channel.',
        type: 1
    }],
    execute: execute,
    __internal_requires_directory: true,
    __internal_setdir(dir: string) {
        rootdir = dir;
    },
    interact: async function (interaction: ChatInputCommandInteraction<CacheType>) {
        var sc = interaction.options.getSubcommand()
        switch (sc) {
            case "enable":
                enableIntr(interaction);
                break;
            case "disable":
                disableIntr(interaction);
                break;
            default:
                await getTweet().then(tweet => {
                    interaction.reply(tweet);
                });
                break;
        }
    }

}

async function execute(message: Message, args: string[]) {
    if (args.length === 0) {
        await getTweet().then(tweet => {
            if (tweet !== "") {
                message.channel.send(tweet);
            }
        });
    }
    else if (args[0] === "enable") {
        var channels = require(`${rootdir}/databases/twitterchan.json`);
        if (channels.includes(message.channel.id)) {
            message.channel.send("Word of the day is already enabled in this channel.");
        }
        else {
            channels.push(message.channel.id);
            fs.writeFileSync(`${rootdir}/databases/twitterchan.json`, JSON.stringify(channels));
            message.channel.send("Word of the day is now enabled in this channel.");
        }
    }
    else if (args[0] === "disable") {
        var channels = require(`${rootdir}/databases/twitterchan.json`);
        if (!channels.includes(message.channel.id)) {
            message.channel.send("Word of the day is not enabled in this channel.");
        }
        else {
            channels.splice(channels.indexOf(message.channel.id), 1);
            fs.writeFileSync(`${rootdir}/databases/twitterchan.json`, JSON.stringify(channels));
            message.channel.send("Word of the day is now disabled in this channel.");
        }
    }
}



async function getTweet(): Promise<string> {
    var tweet = await fs.readFileSync(`${rootdir}/databases/tweet.txt`, "utf8");
    return tweet;
}

async function enableIntr(interaction: ChatInputCommandInteraction<CacheType>) {
    var channels = require(`${rootdir}/databases/twitterchan.json`);
    if (channels.includes(interaction.channel.id)) {
        interaction.reply("Word of the day is already enabled in this channel.");
    }
    else {
        channels.push(interaction.channel.id);
        fs.writeFileSync(`${rootdir}/databases/twitterchan.json`, JSON.stringify(channels));
        interaction.reply("Word of the day is now enabled in this channel.");
    }
}

async function disableIntr(interaction: ChatInputCommandInteraction<CacheType>) {
    var channels = require(`${rootdir}/databases/twitterchan.json`);
    if (!channels.includes(interaction.channel.id)) {
        interaction.reply("Word of the day is not enabled in this channel.");
    }
    else {
        channels.splice(channels.indexOf(interaction.channel.id), 1);
        fs.writeFileSync(`${rootdir}/databases/twitterchan.json`, JSON.stringify(channels));
        interaction.reply("Word of the day is now disabled in this channel.");
    }
}