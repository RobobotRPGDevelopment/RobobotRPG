const serverSettings = require('../../utils/serverSettings');

module.exports = {
    name: "setprefix",
    description: "Change the command prefix for this server.",
    usage: "{prefix}bet {chained command} {bet argument} {amount} (e.g., {prefix}bet {prefix}flip Heads 50)",
    adminOnly: true,
    tag: "admin", // Hidden tag for sorting
    run: async (client, message, args) => {
        console.log('Setprefix command triggered.');
        console.log('Guild ID:', message.guild.id);
        console.log('User:', message.author.tag);
        console.log('New Prefix:', args[0]);

        // Check if the user has administrator permissions
        if (!message.member || !message.member.permissions.has('ADMINISTRATOR')) {
            console.log(`User ${message.author.tag} does not have administrator permissions.`);
            return message.reply('You need to be an administrator to change the prefix.');
        }

        // Validate the new prefix
        const newPrefix = args[0];
        if (!newPrefix || newPrefix.length > 3) {
            console.log('Invalid prefix provided:', newPrefix);
            return message.reply('Please provide a valid prefix (1-3 characters).');
        }

        try {
            // Use findOneAndUpdate to update or create the entry
            const result = await serverSettings.findOneAndUpdate(
                { guildId: message.guild.id }, // Find the document by guildId
                { $set: { prefix: newPrefix } }, // Update the prefix
                { upsert: true, new: true } // Create if it doesn't exist, return the updated document
            );

            console.log(`Prefix updated for guild ${message.guild.id}: ${result.prefix}`);
            return message.reply(`Prefix updated to: \`${newPrefix}\``);
        } catch (error) {
            console.error('Error updating prefix:', error);
            return message.reply('An error occurred while updating the prefix.');
        }
    },
};
