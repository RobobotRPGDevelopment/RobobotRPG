module.exports = {
    name: "server",
    description: "Provides information about the server.",
    usage: "{prefix}server",
    adminOnly: false,
    tag: "info", // Hidden tag for sorting
    run: async (client, message, args, prefix) => {
        // Make sure the code is set up for message commands
        if (!message.guild) {
            return message.reply('This command can only be used in a server.');
        }

        // Sending a response with server information
        await message.reply(`This server is ${message.guild.name} and has ${message.guild.memberCount} members.`);
    },
};
