const serverSettings = require('../../utils/serverSettings'); // Import the schema

module.exports = {
    name: "setcurrency",
    description: "Set the currency symbol and name for the server.",
    usage: "{prefix}setcurrency $, Dollar",
    adminOnly: true,
    tag: "admin", // Hidden tag for sorting
    async run(client, message, args) {
        if (!message.member.permissions.has("Administrator")) {
            return message.reply("You do not have permission to use this command.");
        }

        if (args.length < 2) {
            return message.reply("Usage: $setcurrency {currency symbol}, {currency name}");
        }

        const input = args.join(" ").split(",");
        const currencySymbol = input[0]?.trim();
        const currencyName = input[1]?.trim();

        if (!currencySymbol || !currencyName) {
            return message.reply("Both a currency symbol and name are required.");
        }

        try {
            const settings = await serverSettings.findOneAndUpdate(
                { guildId: message.guild.id },
                { currencyName, currencySymbol },
                { upsert: true, new: true }
            );

            message.reply(
                `Currency has been updated! Symbol: ${settings.currencySymbol}, Name: ${settings.currencyName}`
            );
        } catch (error) {
            console.error("Error setting currency:", error);
            message.reply("An error occurred while setting the currency. Please try again later.");
        }
    },
};
