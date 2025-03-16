const UserService = require('../../utils/services/userService'); // Import the user balance schema
const serverSettings = require('../../utils/models/serverSettings'); // Import server settings
const botMessages = require('../../utils/helpers/botMessages');
module.exports = {
    name: "quests",
    description: "Check your active and available quests.",
    usage: "{prefix}quests",
    adminOnly: false,
    tag: "quests", // Hidden tag for sorting
    async run(client, message, args, prefix) {
        try {

            // Fetch the user's balance
            const quests = await UserService.getQuestStatus(message.author.id, message.guild.id);
            if (!quests.activeQuest.name || !quests.availableQuests.length <= 0) {
                return message.reply("You don't have any quests right now. Create tasks to unlock quests.");
            }
            message.reply(
                botMessages.questList(quests)
            );
        } catch (error) {
            console.error(`Error fetching quests for user ${message.author.id}:`, error);
            message.reply("An error occurred while checking your quests. Please try again later.");
        }
    },
};