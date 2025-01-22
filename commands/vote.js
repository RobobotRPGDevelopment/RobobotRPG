const Vote = require('../utils/voteSchema'); // Import the vote schema
const { adminOnly } = require('./roll');

module.exports = {
    name: "vote",
    description: "Casts a vote on the active topic.",
    usage: "{prefix}vote {yes|no} (e.g., {prefix}vote yes)",
    adminOnly: false,
    tag: "voting", // Hidden tag for sorting
    async run(client, message, args, prefix) {
        if (args.length < 1 || !["yes", "no"].includes(args[0].toLowerCase())) {
            return message.reply(`Usage: ${prefix}vote {yes|no} (e.g., ${prefix}vote yes).`);
        }

        const userVote = args[0].toLowerCase();

        try {
            const activeVote = await Vote.findOne({ guildId: message.guild.id });
            if (!activeVote) {
                return message.reply("There is no active vote in this server.");
            }

            // Check if the user has already voted
            const previousVote = activeVote.votes.get(message.author.id);

            if (previousVote) {
                if (previousVote === userVote) {
                    // User voted the same option
                    return message.reply("You have already voted.");
                } else {
                    // User wants to change their vote
                    await message.reply("You have already voted. Would you like to change your vote? (y/n)");

                    const filter = (response) =>
                        response.author.id === message.author.id &&
                        ["y", "n"].includes(response.content.toLowerCase());
                    const collector = message.channel.createMessageCollector({
                        filter,
                        time: 15000, // 15 seconds timeout
                        max: 1,
                    });

                    collector.on("collect", async (response) => {
                        if (response.content.toLowerCase() === "y") {
                            activeVote.votes.set(message.author.id, userVote);
                            await activeVote.save();
                            const totalVotes = activeVote.votes.size;
                            const memberCount = (
                                await message.guild.members.fetch()
                            ).filter((member) => !member.user.bot).size;

                            return message.reply(
                                `Your vote has been updated to **${userVote}**.\n**${totalVotes}/${memberCount}** votes cast.`
                            );
                        } else {
                            return message.reply("Your vote has not been changed.");
                        }
                    });

                    collector.on("end", (collected) => {
                        if (!collected.size) {
                            message.reply("Vote change timed out. Your vote was not updated.");
                        }
                    });

                    return;
                }
            }

            // If the user hasn't voted yet, cast their vote
            activeVote.votes.set(message.author.id, userVote);
            await activeVote.save();

            const totalVotes = activeVote.votes.size;
            const memberCount = (await message.guild.members.fetch()).filter(member => !member.user.bot).size;

            return message.reply(
                `You voted **${userVote}**.\n**${totalVotes}/${memberCount}** votes cast.`
            );
        } catch (error) {
            console.error("Error casting vote:", error);
            return message.reply("An error occurred while casting your vote. Please try again later.");
        }
    },
};
