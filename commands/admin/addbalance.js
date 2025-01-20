const UserBalance = require('../../utils/userBalance'); // Import user balance schema
const serverSettings = require('../../utils/serverSettings'); // Import server settings

module.exports = {
    name: "addbalance",
    description: "Allows admins to add balance to a user.",
    usage: "{prefix}addbalance @user, 100",
    adminOnly: true,
    tag: "admin", // Hidden tag for sorting
    async run(client, message, args) {
        if (!message.member.permissions.has("Administrator")) {
            return message.reply("You do not have permission to use this command.");
        }

        if (args.length < 2) {
            return message.reply("Usage: $addbalance {user} {amount}");
        }

        const userMention = args[0];
        const amount = parseFloat(args[1]);

        if (isNaN(amount) || amount <= 0) {
            return message.reply("Please provide a valid amount greater than 0.");
        }

        const userIdMatch = userMention.match(/^<@!?(\d+)>$/);
        if (!userIdMatch) {
            return message.reply("Please mention a valid user.");
        }
        const userId = userIdMatch[1];

        try {
            let userBalance = await UserBalance.findOne({
                userId,
                guildId: message.guild.id,
            });

            if (!userBalance) {
                userBalance = await UserBalance.create({
                    userId,
                    guildId: message.guild.id,
                });

                message.reply(`Created a new balance record for <@${userId}>.`);
            }

            userBalance.balance += amount;
            await userBalance.save();

            const settings = await serverSettings.findOne({ guildId: message.guild.id });
            const currencyName = settings ? settings.currencyName : "Coins";
            const currencySymbol = settings ? settings.currencySymbol : "$";

            message.reply(
                `Successfully added ${currencySymbol}${amount} ${currencyName} to <@${userId}>'s balance. New balance: ${currencySymbol}${userBalance.balance} ${currencyName}`
            );
        } catch (error) {
            console.error(`Error adding balance for user ${userId}:`, error);
            message.reply("An error occurred while adding balance. Please try again later.");
        }
    },
};
