const createRecord = require('../utils/createRecord');
const UserBalance = require('../utils/userBalance'); // Import the user balance schema
const UserSkills = require('../utils/userSkills');
const serverSettings = require('../utils/serverSettings'); // Import server settings

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
            // Fetch the server's currency settings
            await createRecord.createRecord(
                member.id, 
                message.guild.id, 
                settings, 
                prefix, 
                UserBalance, 
                createRecord.successBankMessage,
                createRecord.existingBankMessage,
                message  // Pass the message object
            );
        } catch (error) {
            console.error(`Error creating new balance record for user ${member}, id ${member.id}:`, error);
            message.reply("An error occurred while creating your bank account. Please try again later.");
        }
    // Skills
        try {
            await createRecord.createRecord(
                member.id, 
                message.guild.id, 
                settings, 
                prefix, 
                UserSkills, 
                createRecord.successSkillsMessage, 
                createRecord.existingSkillsMessage,
                message  // Pass the message object
            );
        } catch (error) {
            console.error(`Error creating new skills record for user ${member}, id ${member.id}:`, error);
            message.reply("An error occurred while joining the village. Please try again later.");
        }
    },
};