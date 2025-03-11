const Vote = require('../../utils/models/voteSchema');
// const { adminOnly } = require('./roll');

module.exports = {
    name: "createvote",
    description: "Creates a new vote with a specified topic and expiration period.",
    usage: "{prefix}createvote {vote topic} {expiration in hours} (e.g., {prefix}createvote \"Should we add new features?\", 2)",
    adminOnly: false,
    tag: "voting", // Hidden tag for sorting
    async run(client, message, args, prefix) {
        if (args.length < 2) {
            return message.reply(`Usage: ${prefix}createvote {vote topic} {expiration in hours}.`);
        }

        const expirationHours = parseInt(args.pop());
        if (isNaN(expirationHours) || expirationHours < 1 || expirationHours > 24) {
            return message.reply("Expiration must be a number between 1 and 24 (in hours).");
        }

        const topic = args.join(" ");
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + expirationHours);

        try {
            const existingVote = await Vote.findOne({ guildId: message.guild.id });
            if (existingVote) {
                return message.reply("A vote is already active in this server. End it with ${prefix}endvote before creating a new one.");
            }

            await Vote.create({
                guildId: message.guild.id,
                channelId: message.channel.id,
                creatorId: message.author.id,
                topic,
                expiration,
                votes: {},
            });

            return message.reply(`Vote created: **${topic}**\nExpiration: ${expiration.toLocaleString()}`);
        } catch (error) {
            console.error("Error creating vote:", error);
            return message.reply("An error occurred while creating the vote. Please try again later.");
        }
    },
};
