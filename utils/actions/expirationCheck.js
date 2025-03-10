const Vote = require('./voteSchema'); // Adjust path based on where the schema is stored

/**
 * Function to check for expired votes and process them.
 * @param {Client} client - The Discord.js client instance.
 */
async function checkExpiredVotes(client) {
    try {
        const now = new Date();
        const expiredVotes = await Vote.find({ expiration: { $lte: now } });

        for (const vote of expiredVotes) {
            const yesVotes = Array.from(vote.votes.values()).filter(v => v === "yes").length;
            const noVotes = Array.from(vote.votes.values()).filter(v => v === "no").length;

            // Fetch the channel where the vote was created
            const channel = await client.channels.fetch(vote.channelId);
            if (channel) {
                channel.send(
                    `The vote has expired!\n**Topic:** ${vote.topic}\n**Results:**\n- Yes: ${yesVotes}\n- No: ${noVotes}`
                );
            }

            // Remove the vote from the database
            await vote.delete();
        }
    } catch (error) {
        console.error("Error processing expired votes:", error);
    }
}

module.exports = checkExpiredVotes;
