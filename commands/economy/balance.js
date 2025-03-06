const UserBalance = require('../../utils/userBalance'); // Import the user balance schema
const serverSettings = require('../../utils/serverSettings'); // Import server settings

module.exports = {
    name: "balance",
    description: "Check your current balance.",
    usage: "{prefix}balance",
    adminOnly: false,
    tag: "economy", // Hidden tag for sorting
    async run(client, message, args, prefix) {
        try {
            // Fetch the user's balance
            const userBalance = await UserBalance.findOne({
                userId: message.author.id,
                guildId: message.guild.id,
            });

            if (!userBalance) {
                return message.reply("You do not have a balance record. Run " + prefix + "register to open a bank account.");
            }

            // Fetch the server's currency settings
            const settings = await serverSettings.findOne({ guildId: message.guild.id });
            const currencyName = settings ? settings.currencyName : "Coins";
            const currencySymbol = settings ? settings.currencySymbol : "$";

            message.reply(
                `Your current balance is: ${currencySymbol}${userBalance.balance} ${currencyName}`
            );
        } catch (error) {
            console.error(`Error fetching balance for user ${message.author.id}:`, error);
            message.reply("An error occurred while checking your balance. Please try again later.");
        }
    },
};
