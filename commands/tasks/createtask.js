const Task = require("../../utils/taskSchema");

module.exports = {
    name: "createtask",
    description: "Create a task for a user.",
    usage: '{prefix}createtask "Task Name" category difficulty',
    adminOnly: false,
    tag: "tasks",
    async run(client, message, args, prefix) {
        if (args.length < 2) {
            return message.reply(`Usage: ${prefix}createtask "Task Name" category difficulty.`);
        }
        const taskName = args[0];
        const category = args[1];
        
        // Check if the third argument is a number (difficulty) or a string (description)
        let difficulty = 1;
        
        if (args.length >= 3) {
            // If the third argument is a number, it's the difficulty
            if (!isNaN(parseInt(args[2]))) {
                difficulty = parseInt(args[2]);
            // TODO: This is where we will set the due date
            //     // If there's a fourth argument, it's the description
            //     if (args.length >= 4) {
            //         description = args[3];
            //     }
            // } else {
            //     // If the third argument is not a number, it's the description
            //     description = args[2];
            // }
            }
        }
        
        try {
            // Create a new task with auto-generated taskId
            const newTask = await Task.create({
                userId: message.author.id,
                guildId: message.guild.id,
                name: taskName,
                category: category,
                difficulty: difficulty
            });
            
            // Calculate rewards based on difficulty
            const xpReward = difficulty * 50;
            const coinReward = difficulty * 25;
            
            message.reply(
                `Task created: **${taskName}**\n` +
                `Category: ${category}\n` +
                `Difficulty: ${"⭐".repeat(difficulty)}`
            );
        }
        catch (error) {
            console.error(error);
            return message.reply("An error occurred while creating the task. Please try again later.");
        }
    }
};