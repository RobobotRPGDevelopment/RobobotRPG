const Vote = require('../../utils/models/voteSchema'); // Import the vote schema
// const { adminOnly } = require('./roll');

module.exports = {
    name: "endvote",
    description: "Ends the current vote (only the creator can end it).",
    usage: "{prefix}endvote",
    adminOnly: false,
    tag: "voting", // Hidden tag for sorting
    async run(client, message, args, prefix) {
        try {
            const activeVote = await Vote.findOne({ guildId: message.guild.id });

            if (!activeVote) {
                return message.reply("There is no active vote in this server.");
            }

            if (activeVote.creatorId !== message.author.id) {
                return message.reply("Only the creator of the vote can end it.");
            }

            const yesVotes = Array.from(activeVote.votes.values()).filter(v => v === "yes").length;
            const noVotes = Array.from(activeVote.votes.values()).filter(v => v === "no").length;

            // Delete the vote using deleteOne
            await Vote.deleteOne({ _id: activeVote._id });

            return message.reply(
                `The vote has ended!\n**Topic:** ${activeVote.topic}\n**Results:**\n- Yes: ${yesVotes}\n- No: ${noVotes}`
            );
        } catch (error) {
            console.error("Error ending vote:", error);
            return message.reply("An error occurred while ending the vote. Please try again later.");
        }
    },
};
