// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const token = process.env.TOKEN;

// Import server settings schema for prefix handling
const serverSettings = require('./utils/serverSettings');

// Import expiration check function
const checkExpiredVotes = require('./utils/expirationCheck');

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Database Connectivity
(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB.');
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();

// Command Handling
//client.commands = new Collection(); // Collection for slash commands
client.prefixCommands = new Map(); // Collection for prefix commands

// Recursive function to get all command files
const getAllCommandFiles = (dirPath, arrayOfFiles = []) => {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // Recursively get files from subdirectories
            arrayOfFiles = getAllCommandFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith('.js')) {
            // Add only valid JavaScript files to the array
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
};

// Define the commands folder and get all command files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = getAllCommandFiles(commandsPath);
    //commands is an array with all command file links

// Debug log to verify file paths
console.log('Command files being loaded:', commandFiles);

// Load commands into the appropriate collection
for (const file of commandFiles) {
    try {
        const command = require(file); // Use the full path to require the file

        if ('data' in command && 'execute' in command) {
            // Slash commands
            client.commands.set(command.data.name, command);
        } else if ('name' in command && 'run' in command) {
            // Prefix commands
            client.prefixCommands.set(command.name, command);
            console.log(`Loaded prefix command: ${command.name}`);
        } else {
            console.log(`[WARNING] The command at ${file} is missing required properties.`);
        }
    } catch (error) {
        console.error(`[ERROR] Failed to load command at ${file}:`, error.message);
    }
}

// Debug: Log all loaded prefix commands
console.log('All Loaded Prefix Commands:', Array.from(client.prefixCommands.keys()));

// Event Handling
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Dynamic Prefix Command Handler
client.on('messageCreate', async (message) => {
    console.log('Number of messageCreate listeners:', client.listenerCount('messageCreate'));
    if(client.listenerCount('messageCreate') > 1) {
        console.log('MessageCreate listener already exists.');
        return;
    }
    if (message.author.bot || !message.guild) return;

    try {
        const defaultPrefix = '$'; // Default prefix
        const settings = await serverSettings.findOne({ guildId: message.guild.id });
        const prefix = settings ? settings.prefix : defaultPrefix;

        // Debug: Log detected prefix
        console.log(`Detected prefix for guild ${message.guild.name}: ${prefix}`);

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Debug: Log command and arguments
        console.log(`Command detected: ${commandName}, Args: ${args}`);

        const prefixCommand = client.prefixCommands.get(commandName);
        if (!prefixCommand) {
            console.log(`Command "${commandName}" not found.`);
            return;
        }

        await prefixCommand.run(client, message, args, prefix);
        console.log(`Executed command: ${commandName}`);
    } catch (error) {
        console.error('Error handling messageCreate event:', error);
    }
});

// Periodic Expiration Check
setInterval(() => {
    checkExpiredVotes(client); // Call the expiration check function
}, 60 * 1000); // Runs every minute

// Log in to Discord with your client's token
client.login(token);
