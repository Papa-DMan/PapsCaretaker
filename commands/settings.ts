import { Message, ChatInputCommandInteraction, CacheType } from 'discord.js';
import * as fs from 'fs';

var rootdir = ".";

module.exports = {
    name: 'settings',
    description: "Display settings of the bot in the current guild.",
    usage: "settings",
    options: [{
        name: 'show',
        description: 'Shows the settings of the bot in the current guild.',
        type: 1
    }, {
        name: 'set',
        description: 'sets a setting of the bot in the current guild.',
        type: 2,
        options: [{
            name: 'prefix',
            description: 'Sets the prefix of the bot in the current guild.',
            type: 1
        }, {
            name: 'language',
            description: 'Sets the language of the bot in the current guild.',
            type: 1
        }]
    }, {
        name: 'reset',
        description: 'Resets the settings of the bot in the current guild.',
        type: 1
    }],
    execute : execute,
    interact : interact,
    __internal_requires_directory: true,
    __internal_setdir(dir: string) {
        rootdir = dir;
    },
}

/**
 * @brief Accesses the local settings database and returns the settings of the bot in the current guild.
 * @param message the message object
 * @param args the array of arguments
 */
function execute(message: Message, args: string[]) {
    if (args[0] === "show" || args.length === 0) {
        var settings = require(`${rootdir}/databases/guildsettings.json`);
        var guild = message.guild;
        var prefix = settings[guild.id].prefix;
        var language = settings[guild.id].language;
        message.channel.send(`Prefix: ${prefix}\nLanguage: ${language}`);
    }
    else if (args[0] === "set") {
        var settings = require(`${rootdir}/databases/guildsettings.json`);
        var guild = message.guild;
        if (args[1] === "prefix") {
            settings[guild.id].prefix = args[2];
            fs.writeFileSync(`${rootdir}/databases/guildsettings.json`, JSON.stringify(settings));
            message.channel.send("Prefix set.");
        }
        else if (args[1] === "language") {
            settings[guild.id].language = args[2];
            fs.writeFileSync(`${rootdir}/databases/guildsettings.json`, JSON.stringify(settings));
            message.channel.send("Language set.");
        }
        else {
            message.channel.send("No settings found.");
        }
    }
    else if (args[0] === "reset") {
        reset(message.guild.id);
        message.channel.send("Settings reset.");
    }
    else {
        message.channel.send("No settings found.");
    }
}
/**
 * @brief Respondes to the interactrion created with the settings slash command.
 * @param interaction the interaction object
 */
async function interact(interaction: ChatInputCommandInteraction<CacheType>) {
    var sc = interaction.options.getSubcommand()
    var args = sc.split(" ").slice(1);
    var tsetting = require(`${rootdir}/databases/guildsettings.json`);
    var guild = interaction.guild;
    if (tsetting[guild.id] === undefined) {
        reset(guild.id);
    }
    switch(sc) {
        case "show": {
            var settings = require(`${rootdir}/databases/guildsettings.json`);
            var guild = interaction.guild;
            var prefix = settings[guild.id].prefix;
            var language = settings[guild.id].language;
            interaction.reply(`Prefix: ${prefix}\nLanguage: ${language}`);
            break;
        }
        case "set": {
            var settings = require(`${rootdir}/databases/guildsettings.json`);
            var guild = interaction.guild;
            if (args[0] === "prefix") {
                settings[guild.id].prefix = args[1];
                fs.writeFileSync(`${rootdir}/databases/guildsettings.json`, JSON.stringify(settings));
                interaction.reply("Prefix set.");
            }
            else if (args[0] === "language") {
                settings[guild.id].language = args[1];
                fs.writeFileSync(`${rootdir}/databases/guildsettings.json`, JSON.stringify(settings));
                interaction.reply("Language set.");
            }
            break;
        }
        case "reset": {
            reset(interaction.guild.id)
            interaction.reply("Settings reset.");
            break;
        }
        default:
            interaction.reply("No settings found.");
            break;
    }


}

/**
 * @brief Resets the settings of the bot in the current guild.
 * @param guildid the id of the guild
 */
function reset(guildid: string) {
    var settings = require(`${rootdir}/databases/guildsettings.json`);
    settings[guildid] = {
        prefix: "!",
        language: "en"
    };
    fs.writeFileSync(`${rootdir}/databases/guildsettings.json`, JSON.stringify(settings));
}

