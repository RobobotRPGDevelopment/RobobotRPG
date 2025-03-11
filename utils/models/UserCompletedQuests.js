const mongoose = require('mongoose');

const userCompletedQuestsSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    completedQuests: [{
        quest: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest' },
        completedAt: { type: Date, default: Date.now },
        rewardedExp: [{
            skill: String,
            amount: Number
        }],
        rewardedCurrency: Number
    }]
});

userCompletedQuestsSchema.statics.findByUser = function(userId, guildId) {
    return this.find({ userId, guildId });
};

userCompletedQuestsSchema.statics.countByUser = function(userId, guildId) {
    return this.countDocuments({ userId, guildId });
};

// Create compound index for userId and guildId
userCompletedQuestsSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = mongoose.model('UserCompletedQuests', userCompletedQuestsSchema);
