const UserService = require('../../utils/services/userService');
const serverSettings = require('../../utils/models/serverSettings');

module.exports = {
    name: "balance",
    description: "Check your current balance.",
    usage: "{prefix}balance",
    adminOnly: false,
    tag: "economy", // Hidden tag for sorting
    async run(client, message, args, prefix) {
        try {
            // Fetch server settings first
            const settings = await serverSettings.findOne({ guildId: message.guild.id });
            // Get balance through userService (service files are gonna be used from here on out by commands)
            const balance = await UserService.getBalance(
                message.author.id,
                message.guild.id,
                settings
            );

            message.reply(`Your current balance is: ${balance.formatted}`);
            
        } catch (error) {
            if (error.message === 'User not found') {
                return message.reply(`You don't have a bank account yet. Use ${prefix}register to create one.`);
            }
            console.error(`Error in balance command:`, error);
            message.reply("An error occurred while checking your balance. Please try again later.");
        }
    },
};
