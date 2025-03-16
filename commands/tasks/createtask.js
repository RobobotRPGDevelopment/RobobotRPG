const TaskService = require("../../utils/services/taskService");
const SkillsService = require("../../utils/services/skillsService");
module.exports = {
    name: "createtask",
    description: "Create a task for a user.",
    usage: '{prefix}createtask "Task Name" category (optional: difficulty)',
    adminOnly: false,
    tag: "tasks",
    async run(client, message, args, prefix) {
        if (args.length < 1) {
            return message.reply(`Usage: ${prefix}createtask "Task Name" category (optional: difficulty).`);
        }
        const taskName = args[0];
        const category = args[1];
        if (category == undefined) {
            client.nextMessageAuthor = message.author.id;
            client.nextMessageHandler = async (client, message) => {
                console.log("running next message handler");
                const category = message.content;
                args = [taskName, category];
                this.run(client, message, args, prefix);
                client.listenNextMessage = false;
            }
            client.listenNextMessage = true;
            return message.reply("What category would you like to set this task to?");
        }

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
            const {task, err} = await TaskService.createTask(taskData);
            if (err == "Maximum tasks reached") {
                return message.reply("You have reached the maximum number of tasks. Please complete some tasks before creating more.");
            }
            let response = `Task created: **${taskName}**\n` + `Category: **${category}**`;
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
                let skill = paradigm.paradigm.skill
                let skillUppercase = skill.charAt(0).toUpperCase() + skill.slice(1);
                message.reply(`You have unlocked a new skill: **${skillUppercase}** has been unlocked!\n` +
                    `A paradigm has been created between ${category} tasks and ${skill}!\n` +
                    `Any ${category} tasks are now inexplicably interwoven with your ${skill} ability!\n` +
                    `You can now use the ${prefix}paradigms command to view your paradigms.`
                );
            }
            else {
                //message.reply(`Paradigm already exists: ${paradigm.paradigm.skill}`);
            }
        }
        catch (error) {
            console.error(error);
            return message.reply("An error occurred while finding or creating the paradigm. Please try again later.");
        }
    }
};