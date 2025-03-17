const mongoose = require('mongoose');

const userCompletedTasksSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    completedTasks: [{
        task: {
            name: { type: String, required: true },
            name_lower: { type: String, required: true },
            category: { type: String, required: false},
            difficulty: { type: Number, required: false},
            completed: { type: Boolean, default: false},
            dueDate: { type: Date, required: false},
        },
        completedAt: { type: Date, default: Date.now },
        rewardedExp: [{
            skill: String,
            amount: Number
        }],
        rewardedCurrency: Number
    }]
});

userCompletedTasksSchema.statics.findByUser = function(userId, guildId) {
    return this.find({ userId, guildId });
};

userCompletedTasksSchema.statics.countByUser = function(userId, guildId) {
    return this.countDocuments({ userId, guildId });
};

// Create compound index for userId and guildId
userCompletedTasksSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = mongoose.model('UserCompletedTasks', userCompletedTasksSchema);
