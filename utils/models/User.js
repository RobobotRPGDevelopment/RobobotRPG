const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    guildId: { type: String, required: true },
    balance: { type: Number, default: 0 },
    activeQuests: {
        type: [{
            questId: String,
            progress: Number,
            started: Date
        }],
        validate: [array => array.length <= 3, 'Cannot have more than 3 active quests']
    }
});

UserSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = mongoose.model('UserSchema', UserSchema);