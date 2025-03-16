const TaskService = require('../../utils/services/taskService'); // Import the user balance schema
const serverSettings = require('../../utils/models/serverSettings'); // Import server settings
const botMessages = require('../../utils/helpers/botMessages');
module.exports = {
    name: "tasks",
    description: "Check your current tasks.",
    usage: "{prefix}tasks",
    adminOnly: false,
    tag: "tasks", // Hidden tag for sorting
    async run(client, message, args, prefix) {
        try {
            // Fetch the user's balance
            const tasks = await TaskService.findByUser(message.author.id, message.guild.id);
            if (tasks.length <= 0) {
                return message.reply("You don't have any tasks right now. Run " + prefix + `createtask "Task Name" category (optional: difficulty).`);
            }
            message.reply(
                botMessages.taskList(tasks)
            );
        } catch (error) {
            console.error(`Error fetching tasks for user ${message.author.id}:`, error);
            message.reply("An error occurred while checking your tasks. Please try again later.");
        }
    },
};