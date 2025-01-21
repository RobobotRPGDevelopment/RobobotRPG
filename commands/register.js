const UserBalance = require('../utils/userBalance'); // Import the user balance schema
const serverSettings = require('../utils/serverSettings'); // Import server settings

module.exports = {
    name: "register",
    description: "Create a bank account.",
    usage: "{prefix}register",
    adminOnly: false,
    tag: "economy", // Hidden tag for sorting
    async run(client, message, args, prefix) {
        try {
            member = message.author;
            // Fetch the user's balance
            const existingUser = await UserBalance.findOne({
                userId: member.id,
                guildId: message.guild.id,
            });
            if (existingUser) {
                return message.reply("You already have a bank account. Run " + prefix + "balance to check your balance.");
            }
            else {
                await UserBalance.create({
                    userId: member.id,
                    guildId: message.guild.id,
                });
            // Fetch the server's currency settings
                const settings = await serverSettings.findOne({ guildId: message.guild.id });
                const currencyName = settings ? settings.currencyName : "Coins";
                const currencySymbol = settings ? settings.currencySymbol : "$";

                message.reply(
                    `You opened a bank account. Your initial balance is: ${currencySymbol}0 ${currencyName}`
                );
            }
        } catch (error) {
            console.error(`Error creating new balance record for user ${member}, id ${member.id}:`, error);
            message.reply("An error occurred while creating your bank account. Please try again later.");
        }
    },
};