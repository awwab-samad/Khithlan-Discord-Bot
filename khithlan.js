require('dotenv').config();

const Discord = require('discord.js');
const { updateBotStatus } = require('./Functions/updateBot.js');

// Create a new Discord client
const { Client, GatewayIntentBits } = Discord;
const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Set your bot's mention prefix
const mentionBot = '<@1203705379658399774>';

const prefix = '!';

let isBotOnline = false;

// Bot is online
client.on('ready', () => {
  console.log(`${client.user.tag} is online!`);
  isBotOnline = true;
  updateBotStatus(client, isBotOnline);
});

// Bot is offline
process.on('SIGINT', () => {
  console.log(`${client.user.tag} is offline`);
  isBotOnline = false;
  updateBotStatus(client, isBotOnline); // Set presence to 'dnd'
  process.exit(); // Ensure the process exits after cleanup
});

client.on('messageCreate', (message) => {
  //console.log(`\nMessage log: ${message.content}\nUser: ${message.author.username}\nServer: ${message.guild.name}`);
  
  // Ignore messages from bots
  if (message.author.bot) return;

  // Check if the message starts with the prefix or is a mention
  if (message.content.startsWith(prefix)) {
    // Get the command and arguments
    const [command, ...args] = message.content.slice(prefix.length).split(' ');

    // Process commands
    switch (command.toLowerCase()) {
      case 'ping':
        message.channel.send('Server ping: ' + client.ws.ping + 'ms');
        message.channel.send('Delay: ' + (Date.now() - message.createdTimestamp - client.ws.ping) + 'ms');
        break;

      case 'server-stats':
        const serverName = message.guild.name;
        const serverCreatedAt = message.guild.createdAt.toLocaleDateString();
        const totalMembers = message.guild.members.cache.filter(member => !member.user.bot).size;
        const totalBots = message.guild.members.cache.filter(member => member.user.bot).size;
        const totalChannels = message.guild.channels.cache.size;
        
        message.channel.send(`Server name: ${serverName}\nCreated at: ${serverCreatedAt}\nTotal members: ${totalMembers}\nTotal bots: ${totalBots}\nTotal channels: ${totalChannels}`);
        break;

      case 'user-info':
        message.channel.send(`Username: ${message.author.username}\nID: ${message.author.id}\nAccount created: ${message.author.createdAt.toLocaleDateString()}`);
        break;

      case 'avatar':
        message.reply(message.author.displayAvatarURL());
        break;

      case 'server-avatar':
        message.reply(message.guild.iconURL());
        break;

      case 'root':
        message.channel.send('The root letters of خِذْلَانْ are خ ذ ل');
        break;

      case 'salam':
        // Fetch member data to get nickname and display name
        message.guild.members.fetch(message.author)
          .then(member => {
            // Use the nickname if available, otherwise use the display name
            const memberNickname = member.nickname;
            const displayName = memberNickname || member.displayName;
            message.reply(`وعليكم السلام يا ${displayName}!\nHow are you today? :D`);
          });
        break;

      case 'khithlan':
        message.channel.send(`Hi there! I'm Khithlan (خذلان)! We are a nonprofit, humanitarian-focused organization dedicated to promoting positive change. Our mission is to create projects that connect individuals and inspire action against silence and injustice, utilizing the collective, diverse skills of our community.`);
        break;

      
    }
  } else {
    
    // Get the message content
    const messageContent = message.content.toLowerCase();

    // Process messages
    switch (messageContent) {
      case 'what does خذلان mean?':
      case 'what does khithlan mean?':
        message.channel.send(`The word خِذْلَانْ in Arabic means letting down, abandoning or forsaking. It can be used to refer to an act of betrayal or breach of trust.`);
        break;
    }
  }
});

// Log in to Discord with the bot token
client.login(process.env.TOKEN);
