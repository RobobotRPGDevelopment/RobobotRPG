const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    guildId: { type: String, required: true }, // Server ID
    channelId: { type: String, required: true }, // Channel where the vote was created
    creatorId: { type: String, required: true }, // ID of the vote creator
    topic: { type: String, required: true }, // Vote topic
    expiration: { type: Date, required: true }, // Expiration time (in hours)
    votes: {
        type: Map,
        of: String, // User ID mapped to their vote ("yes" or "no")
    },
});

module.exports = mongoose.model('Vote', voteSchema);
