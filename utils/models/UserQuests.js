const mongoose = require('mongoose');

const userQuestsSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    quests: { type: Array, default: [] },
});

// Create a compound index for userId and guildId
userQuestsSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = mongoose.model('UserQuests', userSkillsSchema);