const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: Number, required: true },
    category: { type: String, required: true },
    requirements: { 
        requiredSkills: [{ 
            skill: String,
            level: Number,
        }],
        secondarySkills: [{ 
            skill: String,
            level: Number,
        }],
    },
    repeatable: { type: Number, required: true }, // 0 for not repeatable
    baseRewardEXP: { type: Number, required: true },
    baseRewardCurrency: { type: Number, required: true },
    rewardText: { type: String, required: true },
    failureText: { type: String, required: true },
});

module.exports = mongoose.model('Quest', questSchema);