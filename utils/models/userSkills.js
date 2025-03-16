const mongoose = require('mongoose');

// Define available skills as a constant for reuse
const AVAILABLE_SKILLS = [
    'magic',
    'woodcutting',
    'mining',
    'herbalism',
    'alchemy',
    'meditation',
    'swordsmanship',
    'archery'
];

const userSkillsSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    skills: {
        magic: {
            level: { type: Number, default: 0 },
            experience: { type: Number, default: 0 },
            difficulty: { type: Number, default: 1 },
            unlocked: { type: Boolean, default: false },
        },
        woodcutting: {
            level: { type: Number, default: 0 },
            experience: { type: Number, default: 0 },
            difficulty: { type: Number, default: 1 },
            unlocked: { type: Boolean, default: false }
        },
        mining: {
            level: { type: Number, default: 0 },
            experience: { type: Number, default: 0 },
            difficulty: { type: Number, default: 1 },
            unlocked: { type: Boolean, default: false }
        },
        herbalism: {
            level: { type: Number, default: 0 },
            experience: { type: Number, default: 0 },
            difficulty: { type: Number, default: 1 },
            unlocked: { type: Boolean, default: false }
        },
        alchemy: {
            level: { type: Number, default: 0 },
            experience: { type: Number, default: 0 },
            difficulty: { type: Number, default: 1 },
            unlocked: { type: Boolean, default: false }
        },
        meditation: {
            level: { type: Number, default: 0 },
            experience: { type: Number, default: 0 },
            difficulty: { type: Number, default: 1 },
            unlocked: { type: Boolean, default: false }
        },
        swordsmanship: {
            level: { type: Number, default: 0 },
            experience: { type: Number, default: 0 },
            difficulty: { type: Number, default: 1 },
            unlocked: { type: Boolean, default: false }
        },
        archery: {
            level: { type: Number, default: 0 },
            experience: { type: Number, default: 0 },
            difficulty: { type: Number, default: 1 },
            unlocked: { type: Boolean, default: false }
        },
    },
    paradigms: [{
        category: { 
            type: String, 
            required: true,
            lowercase: true,
            trim: true
        },
        skill: {
            type: String,
            required: true,
            enum: AVAILABLE_SKILLS
        }
    }]
});

// Create a compound index for userId and guildId
userSkillsSchema.index({ userId: 1, guildId: 1 }, { unique: true });

// Create a compound index for paradigms category to ensure no duplicate categories per user
userSkillsSchema.index({ userId: 1, guildId: 1, 'paradigms.category': 1 }, { unique: true });

module.exports = mongoose.model('UserSkills', userSkillsSchema);