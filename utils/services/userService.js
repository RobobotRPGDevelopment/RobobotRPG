const User = require('../models/User');
const UserCompletedQuests = require('../models/UserCompletedQuests');
const UserSkills = require('../models/userSkills');

class UserService {
    /**
     * Create a new user record
     */
    static async createUser(userId, guildId, settings) {
        const user = await User.create({
            userId,
            guildId,
            balance: 0
        });

        // Initialize skills
        await UserSkills.create({
            userId,
            guildId
        });
        return user;
    }

    /**
     * Get or create a user record
     */
    static async getOrCreateUser(userId, guildId, settings) {
        let user = await User.findOne({ userId, guildId });
        console.log("user is", user);
        if (!user) {
            user = await this.createUser(userId, guildId, settings);
            return { user, isNew: true }; // Return object with both values
        }
        return { user, isNew: false }; // Return object with both values
    }

    /**
     * Create skills document for a user
     */
    static async createSkills(userId, guildId) {
        const skills = await UserSkills.create({ userId, guildId });
        return skills;
    }

    /**
     * Get or create skills document for a user
     */
    static async getOrCreateSkills(userId, guildId) {
        let skills = await UserSkills.findOne({ userId, guildId });
        if (!skills) {
            skills = await this.createSkills(userId, guildId);
            return { skills, isNew: true }; // Return object with both values
        }
        return { skills, isNew: false }; // Return object with both values
    }

    /**
     * Handle quest acceptance
     */
    static async acceptQuest(userId, guildId, questIndex) {
        const user = await User.findOne({ userId, guildId })
            .populate('availableQuests.quest');
        
        if (!user) throw new Error('User not found');
        
        const result = await user.acceptQuest(questIndex);
        await user.save();
        
        return result;
    }

    /**
     * Handle quest completion
     */
    static async completeQuest(userId, guildId) {
        const user = await User.findOne({ userId, guildId })
            .populate('activeQuest.quest');
        
        if (!user) throw new Error('User not found');
        
        const result = await user.completeQuest();
        await user.save();
        
        return result;
    }

    /**
     * Get user's quest status
     */
    static async getQuestStatus(userId, guildId) {
        const user = await User.findOne({ userId, guildId })
            .populate('activeQuest.quest')
            .populate('availableQuests.quest');
        
        if (!user) throw new Error('User not found');
        
        return {
            activeQuest: user.activeQuest,
            availableQuests: user.availableQuests
        };
    }

    /**
     * Get user's completed quests
     */
    static async getCompletedQuests(userId, guildId) {
        const completedQuests = await UserCompletedQuests.findOne({ userId, guildId })
            .populate('completedQuests.quest');
        
        return completedQuests?.completedQuests || [];
    }

    /**
     * Get user's balance with formatted currency
     */
    static async getBalance(userId, guildId, settings) {
        const user = await User.findOne({ userId, guildId });
        if (!user) {
            throw new Error('User not found');
        }

        const currencyName = settings?.currencyName || "Coins";
        const currencySymbol = settings?.currencySymbol || "$";

        return {
            balance: user.balance,
            formatted: `${currencySymbol}${user.balance}`,
            raw: user.balance,
            currencyName,
            currencySymbol
        };
    }
}

module.exports = UserService; 