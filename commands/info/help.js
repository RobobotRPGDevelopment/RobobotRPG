const serverSettings = require('../../utils/serverSettings'); // Import server settings
const { adminOnly } = require('../roll');

module.exports = {
    name: "help",
    description: "Displays a list of commands or details about a specific command.",
    usage: "{prefix}help [command] (e.g., {prefix}help roll)",
    adminOnly: false,
    tag: "info", // Hidden tag for sorting
    async run(client, message, args) {
        try {
            const commands = client.prefixCommands;

            // Fetch the current prefix from the database
            const settings = await serverSettings.findOne({ guildId: message.guild.id });
            const prefix = settings ? settings.prefix : "$";

            // If no arguments, display all commands sorted by hidden tags
            if (!args.length) {
                const sortedCommands = Array.from(commands.values())
                    .sort((a, b) => {
                        const tagOrder = { voting: 1, probability: 2, economy: 3 };
                        const aTag = tagOrder[a.tag] || 99; // Default to 99 if no tag
                        const bTag = tagOrder[b.tag] || 99; // Default to 99 if no tag
                        return aTag - bTag;
                    })
                    .map(cmd => `${prefix}${cmd.name}: ${cmd.description}`)
                    .join("\n");

                return message.reply(
                    `Here are the available commands:\n\n${sortedCommands}\n\nUse ${prefix}help [command] to get more details about a specific command.`
                );
            }

            // If a specific command is requested
            const commandName = args[0].startsWith(prefix)
                ? args[0].substring(prefix.length)
                : args[0];
            const command = commands.get(commandName);

            if (!command) {
                return message.reply(`The command "${args[0]}" does not exist.`);
            }

            // Display detailed help for the specific command
            return message.reply(
                `**Command:** ${prefix}${command.name}\n` +
                `**Description:** ${command.description}\n` +
                `**Usage:** ${command.usage.replace(/{prefix}/g, prefix) || "No usage information available."}`
            );
        } catch (error) {
            console.error("Error in help command:", error);
            return message.reply("An error occurred while fetching the help menu. Please try again later.");
        }
    },
};
