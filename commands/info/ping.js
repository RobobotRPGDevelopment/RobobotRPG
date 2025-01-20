module.exports = {
	name: "ping",
    description: "Checks if the bot is responding.",
    usage: "{prefix}ping",
    adminOnly: false,
    tag: "info", // Hidden tag for sorting
    run: (client, message, args) => {
        message.reply("pong!")
    }
};