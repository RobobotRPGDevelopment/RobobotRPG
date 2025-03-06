const Task = require("../../utils/taskSchema");
module.exports = {
    name: "createtask",
    description: "Create a task for a user.",
    usage: "{prefix}createtask {task name} {category}",
    adminOnly: true,
    tag: "admin",
    async run(client, message, args, prefix) {
        if (args.length < 2) {
            return message.reply(`Usage: ${prefix}createtask {task name} {category}.`);
        }
        //TODO: If dropped category/difficulty, prompt user in next message.
        const user = message.author;
        const task = args[1];
        const category = args[2];
        try {
            await Task.create({
                userId: user.id,
                guildId: message.guild.id,
                name: task,
                category: category
            });
            message.reply(`Task created: ${task}`);
        }
        catch (error) {
            console.error(error);
            return message.reply("An error occurred while creating the task. Please try again later.");
        }
    }
}