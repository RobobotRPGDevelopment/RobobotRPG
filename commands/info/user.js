module.exports = {
    name: "user",
    description: "Provides information about the user.",
    usage: "{prefix}user",
    adminOnly: false,
    tag: "info", // Hidden tag for sorting
    run: async (client, message, args, prefix) => {
        // Ensure the message is in a guild
        if (!message.guild) {
            return message.reply('This command can only be used in a server.');
        }

        // Sending a response with user information
        const member = message.member; // Member object of the user
        await message.reply(`This command was run by ${member.user.username}, who joined on ${member.joinedAt.toDateString()}.`);
    },
};