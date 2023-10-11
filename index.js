"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let TOKEN = "NzAyMzk4MzE3NDYzODYzMzQ3.GKqcBO.Zg5Ht3Z-ZtkfCpGFWBre14M53rCqr2-Ad00M-E";
let CLIENT_ID = "702398317463863347";
const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
];
const ping_data = new discord_js_1.SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!');
const wake_data = new discord_js_1.SlashCommandBuilder()
    .setName('wake')
    .setDescription('Wakes up a deafened user in a voice channel')
    .addUserOption(option => option.setName('user')
    .setDescription('The user to wake up')
    .setRequired(true));
const commands_data = [
    ping_data,
    wake_data
];
function registerSlashCommands() {
    return __awaiter(this, void 0, void 0, function* () {
        const rest = new discord_js_1.REST({ version: '10' }).setToken(TOKEN);
        try {
            console.log('Started refreshing application (/) commands.');
            yield rest.put(discord_js_1.Routes.applicationCommands(CLIENT_ID), { body: commands_data });
            console.log('Successfully reloaded application (/) commands.');
        }
        catch (error) {
            console.error(error);
        }
    });
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function getRandomChannel(guild) {
    const channels = guild.channels.cache.filter(channel => channel.type === discord_js_1.ChannelType.GuildVoice);
    if (channels.size === 0)
        return null;
    const index = Math.floor(Math.random() * channels.size);
    return channels.at(index);
}
const discord_js_2 = require("discord.js");
const client = new discord_js_2.Client({ intents: [discord_js_2.GatewayIntentBits.Guilds, discord_js_2.GatewayIntentBits.GuildMembers, discord_js_2.GatewayIntentBits.GuildModeration, discord_js_2.GatewayIntentBits.GuildVoiceStates] });
client.on('ready', () => {
    if (!client.user)
        return console.log("No user");
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isChatInputCommand())
        return;
    if (interaction.commandName === 'ping') {
        yield interaction.reply('Pong!');
    }
    if (interaction.commandName === 'wake') {
        const user = interaction.options.getMember('user');
        yield interaction.reply(`Waking up ${user.displayName}...`);
        console.log(`Waking up ${user.displayName}...`);
        while (user.voice.selfDeaf || user.voice.channelId === null) {
            const channel = getRandomChannel(user.guild);
            console.log(channel);
            if (channel) {
                try {
                    yield user.voice.setChannel(channel);
                    yield delay(500);
                }
                catch (error) {
                    yield delay(500);
                }
            }
            else {
                break;
            }
        }
        interaction.editReply(`Woke up ${user.displayName}!`);
    }
}));
registerSlashCommands();
client.login(TOKEN);
