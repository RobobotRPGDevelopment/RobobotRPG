const TaskService = require("../../utils/services/taskService");

module.exports = {
    name: "createtask",
    description: "Create a task for a user.",
    usage: '{prefix}createtask "Task Name" category (optional: difficulty)',
    adminOnly: false,
    tag: "tasks",
    async run(client, message, args, prefix) {
        if (args.length < 2) {
            return message.reply(`Usage: ${prefix}createtask "Task Name" category (optional: difficulty).`);
        }
        const taskName = args[0];
        const category = args[1];
        const taskData = {
            userId: message.author.id,
            guildId: message.guild.id,
            name: taskName,
            category: category
        };
        if (args.length >= 3 && !isNaN(parseInt(args[2]))) {
            taskData.difficulty = parseInt(args[2]);
        }

        try {
            const task = await TaskService.createTask(taskData);
            let response = `Task created: **${taskName}**\n` + `Category: ${category}`;
            if (task.difficulty) {
                response += `\nDifficulty: ${"⭐".repeat(task.difficulty)}`;
            }
            message.reply(response);
        }
        catch (error) {
            console.error(error);
            return message.reply("An error occurred while creating the task. Please try again later.");
        }
    }
};