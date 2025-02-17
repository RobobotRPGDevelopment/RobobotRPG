const mongoose = require('mongoose');

const userSkillsSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    guildId: { type: String, required: true },
    skills: {
        magic: Number,
        woodcutting: Number,
        mining: Number,
        crafting: Number,
        alchemy: Number,
        meditation: Number,
        swordsmanship: Number,
        archery: Number
    },
});

module.exports = mongoose.model('UserSkills', userSkillsSchema);