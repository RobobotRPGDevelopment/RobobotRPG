const TaskService = require("../../utils/services/taskService");
const SkillsService = require("../../utils/services/skillsService");
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
        try {
            const paradigm = await SkillsService.findOrCreateParadigm(message.author.id, message.guild.id, category);
            if(paradigm.isNew) {
                let skill = paradigm.Paradigm.skill.charAt(0).toUpperCase() + paradigm.Paradigm.skill.slice(1);
                message.reply(`You have unlocked a new skill: **${skill}** unlocked!\n` +
                    `A paradigm has been created between ${category} tasks and ${skill}!\n` +
                    `Any ${category} tasks are now completely interwoven with your ${skill} ability!\n` +
                    `You can now use the ${prefix}paradigm command to view your paradigms.`
                );
            }
            else {
                message.reply(`Paradigm already exists: ${category}`);
            }
        }
        catch (error) {
            console.error(error);
            return message.reply("An error occurred while finding or creating the paradigm. Please try again later.");
        }
    }
};