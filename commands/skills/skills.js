const UserSkills = require('../../utils/userSkills'); // Import the user balance schema
const serverSettings = require('../../utils/serverSettings'); // Import server settings
const botMessages = require('../../utils/botMessages');
module.exports = {
    name: "skills",
    description: "Check your current skill levels.",
    usage: "{prefix}skills",
    adminOnly: false,
    tag: "skills", // Hidden tag for sorting
    async run(client, message, args, prefix) {
        try {
            // Fetch the user's balance
            const userSkills = await UserSkills.findOne({
                userId: message.author.id,
                guildId: message.guild.id,
            });
            if (!userSkills) {
                return message.reply("You must be registered to view your skills and access your bank account. Run " + prefix + "register to join the village.");
            }
            // Fetch the server's settings to view allowed/enabled skills
            // const settings = await serverSettings.findOne({ guildId: message.guild.id });
            // const currencyName = settings ? settings.currencyName : "Coins";
            // const currencySymbol = settings ? settings.currencySymbol : "$";
            message.reply(
                botMessages.skillsList(userSkills)
            );
        } catch (error) {
            console.error(`Error fetching skills for user ${message.author.id}:`, error);
            message.reply("An error occurred while checking your skills. Please try again later.");
        }
    },
};