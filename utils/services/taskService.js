const Task = require('../models/Task');

class TaskService {
    static async createTask(taskData) {
        const task = await Task.create(taskData);
        return task;
    }

    static async findByUser(userId, guildId) {
        const tasks = await Task.find({ userId, guildId });
        return tasks; // Will be [] if no tasks found
    }

    static async countByUser(userId, guildId) {
        return await Task.countDocuments({ userId, guildId });
    }

    static async findByUserAndName(userId, guildId, name) {
        const task = await Task.findOne({ userId, guildId, name });
        return task; // Will be null if no task found
    }
}

module.exports = TaskService;
