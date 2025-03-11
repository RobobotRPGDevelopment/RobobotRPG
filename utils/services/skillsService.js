const userSkills = require("../models/userSkills");
const Task = require("../models/Task");
const skillHeirarchy = {
    primary: ["woodcutting", "mining", "herbalism"],
    secondary: ["alchemy", "swordsmanship", "archery"],
    tertiary: ["magic", "meditation"]
}
class SkillsService {
    static async findOrCreateParadigm(userId, guildId, taskCategory) {
        taskCategory = taskCategory.toLowerCase().trim();
        const userSkills = await userSkills.findOne({ userId, guildId });
        if (!userSkills) {
            throw new Error("User not found");
        }
        const paradigm = userSkills.paradigms.find(p => p.category === taskCategory);
        if (!paradigm) {
            // do stuff TODO
        }
        userSkills.paradigms.push({ category: taskCategory, skill: "magic" });
        await userSkills.save();
        return userSkills;

    }
    static async createParadigm(userId, guildId, taskCategory) {
        const userSkills = await userSkills.findOne({ userId, guildId });
        if (!userSkills) {
            throw new Error("User not found");
        }
        userSkills.paradigms.push({ category: taskCategory, skill: "magic" });
        await userSkills.save();
        return userSkills;
    }
    static async findNewSkill(userId, guildId) {
        const paradigms = await this.getParadigms(userId, guildId);

    }
    static async getParadigms(userId, guildId) {
        const userSkills = await userSkills.findOne({ userId, guildId });
        if (!userSkills) {
            throw new Error("User not found");
        }
        return userSkills.paradigms;
    }
}