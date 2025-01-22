module.exports = {
    name: "createtask",
    description: "Create a task for a user.",
    usage: "{prefix}createtask {task name} {difficulty}",
    adminOnly: true,
    tag: "admin",
    async run(client, message, args, prefix) {
        const user = message.mentions.users.first();
        const task = args[1];
        const reward = args[2];
    }
}