const mongoose = require('mongoose');
const UserCompletedQuests = require('./UserCompletedQuests');

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    balance: { type: Number, default: 0 },
    
    // Quest-related fields
    activeQuest: {
        quest: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest' },
        startedAt: { type: Date },
        completed: { type: Boolean, default: false }
    },
    
    availableQuests: [{
        quest: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest' },
        expiresAt: { type: Date, default: null }
    }]
    }, 
    {
    timestamps: true,
    methods: {
        async acceptQuest(questIndex) {
            if (this.activeQuest.quest) {
                throw new Error('Already have an active quest');
            }
            
            if (questIndex < 0 || questIndex >= this.availableQuests.length) {
                throw new Error('Invalid quest index');
            }
            
            const selectedQuest = this.availableQuests[questIndex];
            this.activeQuest = {
                quest: selectedQuest.quest,
                startedAt: new Date(),
                completed: false
            };
            
            this.availableQuests.splice(questIndex, 1);
            return this.activeQuest;
        },

        async completeQuest() {
            if (!this.activeQuest.quest) {
                throw new Error('No active quest to complete');
            }

            if (!this.activeQuest.completed) {
                throw new Error('Quest not yet completed');
            }

            const completedQuest = this.activeQuest.quest;
            
            // Record completion - this saves automatically due to findOneAndUpdate
            await UserCompletedQuests.findOneAndUpdate(
                { userId: this.userId, guildId: this.guildId },
                {
                    $push: {
                        completedQuests: {
                            quest: completedQuest._id,
                            completedAt: new Date(),
                            rewardedExp: completedQuest.reward.experience,
                            rewardedCurrency: completedQuest.reward.currency
                        }
                    }
                },
                { upsert: true, new: true }
            );

            // Update balance
            this.balance += completedQuest.reward.currency;

            // Clear active quest
            this.activeQuest = {
                quest: null,
                completed: false
            };

            // Note: We don't save here because the service layer will handle saving
            return {
                quest: completedQuest,
                rewards: {
                    experience: completedQuest.reward.experience,
                    currency: completedQuest.reward.currency
                }
            };
        },
    }
});

UserSchema.index({ userId: 1, guildId: 1 }, { unique: true });

// Validations
UserSchema.path('availableQuests').validate(function(quests) {
    return quests.length <= 3;
}, 'Cannot have more than 3 available quests');

module.exports = mongoose.model('User', UserSchema);