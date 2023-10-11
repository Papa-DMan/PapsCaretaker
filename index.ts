import { ChannelType, REST, Routes, SlashCommandBuilder } from 'discord.js';

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
];

const ping_data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

const wake_data = new SlashCommandBuilder()
  .setName('wake')
  .setDescription('Wakes up a deafened user in a voice channel')
  .addUserOption(option => 
    option.setName('user')
      .setDescription('The user to wake up')
      .setRequired(true)
  );

const commands_data = [
  ping_data,
  wake_data
];

async function registerSlashCommands() {
  const rest = new REST({ version: '10' }).setToken(TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');
  
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands_data });
  
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

function getRandomChannel(guild: Guild) {
  const channels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice);
  if (channels.size === 0) return null;
  const index = Math.floor(Math.random() * channels.size);
  return channels.at(index) as VoiceChannel;
}

import { Client, GatewayIntentBits, Guild, GuildMember, VoiceChannel, VoiceState } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildVoiceStates] });

client.on('ready', () => {
  if (!client.user) return console.log("No user")
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
  if (interaction.commandName === 'wake') {
    const user = interaction.options.getMember('user') as GuildMember;
    await interaction.reply(`Waking up ${user.displayName}...`);
    console.log(`Waking up ${user.displayName}...`)
    while(user.voice.selfDeaf || user.voice.channelId === null) {
      const channel = getRandomChannel(user.guild);
      console.log(channel);
      if (channel) {
        try {
          await user.voice.setChannel(channel);
          await delay(500);
        } catch (error) {
          await delay(500);
        }
      } else {
        break;
      }
    }
    interaction.editReply(`Woke up ${user.displayName}!`);
  }
});

registerSlashCommands();
client.login(TOKEN);