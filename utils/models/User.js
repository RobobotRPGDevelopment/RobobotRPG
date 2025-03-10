const mongoose = require('mongoose');
const UserCompletedQuests = require('./UserCompletedQuests');

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    guildId: { type: String, required: true },
    balance: { type: Number, default: 0 },
    activeQuest: {
        quest: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest' },
        completed: { type: Boolean, default: false },
    },
    availableQuests: [{
        quest: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest' },
    }],
});

// Quests
UserSchema.methods.acceptQuest = async function(questIndex) {
    if (this.activeQuest.quest) {
        throw new Error('Already have an active quest');
    }
    
    if (questIndex < 0 || questIndex >= this.availableQuests.length) {
        throw new Error('Invalid quest index');
    }

    // Move quest from available to active
    const selectedQuest = this.availableQuests[questIndex];
    this.activeQuest = {
        quest: selectedQuest.quest,
    };
    
    // Remove from available quests
    this.availableQuests.splice(questIndex, 1);
    return this.activeQuest;
};

UserSchema.methods.completeQuest = async function() {
    // Check if there's an active quest
    if (!this.activeQuest.quest) {
        throw new Error('No active quest to complete');
    }

    // Make sure the quest is populated
    await this.populate('activeQuest.quest');
    const completedQuest = this.activeQuest.quest;

    // Calculate rewards based on quest difficulty
    const rewardedCurrency = completedQuest.baseRewardCurrency;
    const rewardedEXP = completedQuest.baseRewardEXP;

    // Find or create UserCompletedQuests document
    let userCompletedQuests = await UserCompletedQuests.findOne({
        userId: this.userId,
        guildId: this.guildId
    });

    if (!userCompletedQuests) {
        userCompletedQuests = new UserCompletedQuests({
            userId: this.userId,
            guildId: this.guildId,
            completedQuests: []
        });
    }

    // Add to completed quests
    userCompletedQuests.completedQuests.push({
        quest: completedQuest._id,
        completedAt: new Date(),
        rewardedExp: rewardedExp,
        rewardedCurrency: rewardedCurrency
    });

    // Update user's balance
    this.balance += rewardedCurrency;

    // Clear active quest
    this.activeQuest = {
        quest: null,
        completed: false
    };

    // Save both documents
    await Promise.all([
        userCompletedQuests.save(),
        this.save()
    ]);

    return {
        quest: completedQuest,
        rewards: {
            skills: rewardedEXP,
            currency: rewardedCurrency
        }
    };
};

UserSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);