const UserSkills = require("../models/userSkills");
const Task = require("../models/Task");

const SKILL_HIERARCHY = {
    primary: ["woodcutting", "mining", "herbalism"],
    secondary: ["alchemy", "swordsmanship", "archery"],
    tertiary: ["magic", "meditation"]
};

class SkillsService {
    static async findOrCreateParadigm(userId, guildId, taskCategory) {
        taskCategory = taskCategory.toLowerCase().trim();
        const userSkills = await this.getSkills(userId, guildId);
        const paradigms = userSkills.paradigms;
        const existingParadigm = paradigms.find(p => p.category === taskCategory);
        
        if (!existingParadigm) {
            const newParadigm = await this.createParadigm(userId, guildId, taskCategory, userSkills);
            return { paradigm: newParadigm, isNew: true };
        }
        return { paradigm: existingParadigm, isNew: false };
    }

    static async createParadigm(userId, guildId, taskCategory, userSkills) {
        taskCategory = taskCategory.toLowerCase().trim();
        if(!userSkills) {
            userSkills = await this.getSkills(userId, guildId);
        }
        const newSkill = await this.findNewSkill(userId, guildId, userSkills);
        
        if(!newSkill) {
            // TODO: All skills are unlocked, add new category to existing skill
            return this.addCategoryToExistingSkill(userId, guildId, taskCategory);
        }
        const newParadigm = {
            category: taskCategory,
            skill: newSkill
        };
        userSkills.paradigms.push(newParadigm);
        await userSkills.save();
        return newParadigm;
    }

    static async addCategoryToExistingSkill(userId, guildId, taskCategory) {
        const userSkills = await this.getSkills(userId, guildId);
        
        // Find skill with fewest categories
        const skillCounts = new Map();
        SKILL_HIERARCHY.primary.concat(SKILL_HIERARCHY.secondary, SKILL_HIERARCHY.tertiary)
            .forEach(skill => skillCounts.set(skill, 0));
        
        userSkills.paradigms.forEach(paradigm => {
            const count = skillCounts.get(paradigm.skill) || 0;
            skillCounts.set(paradigm.skill, count + 1);
        });

        // Find skill with lowest count
        let lowestCount = Infinity;
        let selectedSkill = null;
        
        skillCounts.forEach((count, skill) => {
            if (count < lowestCount) {
                lowestCount = count;
                selectedSkill = skill;
            }
        });

        if (!selectedSkill) {
            throw new Error("No skills available");
        }

        const newParadigm = {
            category: taskCategory,
            skill: selectedSkill
        };
        
        userSkills.paradigms.push(newParadigm);
        await userSkills.save();
        return newParadigm;
    }

    /*
    * Returns a random new skill of the lowest tier available
    */
    static async findNewSkill(userId, guildId, userSkills) {
        if(!userSkills) {
            userSkills = await this.getSkills(userId, guildId);
        }
        // array = woodcutting => if (in the paradigm, one skill matches woodcutting, do NOT INCLUDE)
        const paradigms = userSkills.paradigms;
        const availablePrimarySkills = SKILL_HIERARCHY.primary
            .filter(skill => !paradigms.some(paradigm => paradigm.skill === skill));
        if(availablePrimarySkills.length > 0) {
            return availablePrimarySkills[Math.floor(Math.random() * availablePrimarySkills.length)];
        }

        // Try secondary skills
        const availableSecondarySkills = SKILL_HIERARCHY.secondary
            .filter(skill => !paradigms.some(paradigm => paradigm.skill === skill));
        if(availableSecondarySkills.length > 0) {
            return availableSecondarySkills[Math.floor(Math.random() * availableSecondarySkills.length)];
        }

        const availableTertiarySkills = SKILL_HIERARCHY.tertiary
            .filter(skill => !paradigms.some(paradigm => paradigm.skill === skill));
        if(availableTertiarySkills.length > 0) {
            return availableTertiarySkills[Math.floor(Math.random() * availableTertiarySkills.length)];
        }
        return null;
    }

    static async getSkills(userId, guildId) {
        const userSkills = await UserSkills.findOne({ userId, guildId });
        if (!userSkills) {
            throw new Error("User not found");
        }
        return userSkills;
    }
}

module.exports = SkillsService;