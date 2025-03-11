const User = require('../../utils/models/User'); // Import the user schema
const UserSkills = require('../../utils/models/userSkills');
const UserService = require('../../utils/services/userService');
const serverSettings = require('../../utils/models/serverSettings'); // Import server settings

module.exports = {
    name: "register",
    description: "Create a bank account.",
    usage: "{prefix}register",
    adminOnly: false,
    tag: "utility", // Hidden tag for sorting
    async run(client, message, args, prefix) {
        let member;
        let settings;
    // Balance
        try {
            settings = await serverSettings.findOne({ guildId: message.guild.id });
            member = message.author;

            const {user, isNew} = await UserService.getOrCreateUser(member.id, message.guild.id, settings);
            if (isNew) {
                // Fetch the server's currency settings
                const currencySymbol = settings ? settings.currencySymbol : "$";
                const currencyName = settings ? settings.currencyName : "Coins";
                message.reply(`You opened a bank account. Your initial balance is: ${currencySymbol}0`);
            }
            else {
                message.reply(`You already have a bank account. Run ${prefix}balance to check your balance.`);
            }
        } catch (error) {
            console.error(`Error creating new balance record for user ${member}, id ${member.id}:`, error);
            message.reply("An error occurred while creating your bank account. Please try again later.");
        }
    // Skills
        try {
            const {skills, isNew} = await UserService.getOrCreateSkills(member.id, message.guild.id);
            if (isNew) {
                message.reply(`You joined the village. Run ${prefix}skills at any time to view your skill levels.`);
            }
            else {
                message.reply(`You have already joined the village. Run ${prefix}skills to view your skill levels.`);
            }
        } catch (error) {
            console.error(`Error creating new skills record for user ${member}, id ${member.id}:`, error);
            message.reply("An error occurred while joining the village. Please try again later.");
        }
    },
};