const Task = require('../models/Task');

class TaskService {
    static async createTask(userId, guildId, taskData) {
        const task = await Task.create({
            userId,
            guildId,
            ...taskData
        });
        return task;
    }
}

module.exports = TaskService;
