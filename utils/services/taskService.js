const Task = require('../models/Task');
const MAX_TASKS = 5;
class TaskService {
    static async createTask(taskData) {
        const task = await Task.create(taskData);
        const taskCount = await Task.countDocuments({ userId: taskData.userId, guildId: taskData.guildId });
        if (taskCount >= MAX_TASKS) {
            return {task: null, err: "Maximum tasks reached"};
        }
        return {task: task, err: null};
    }
    static async setPendingTask(userId, guildId, name) {
        const user = await User.findOne({ userId, guildId });
        user.pendingTask.name = name;
        await user.save();
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
