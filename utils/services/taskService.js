const Task = require('../models/Task');
const UserCompletedTasks = require('../models/UserCompletedTasks');
const MAX_TASKS = 5;
const didYouMean = require('didyoumean');
class TaskService {
    static async createTask(taskData) {
        taskData.name_lower = taskData.name.toLowerCase();
        const task = await Task.create(taskData);
        const taskCount = await Task.countDocuments({ userId: taskData.userId, guildId: taskData.guildId });
        if (taskCount >= MAX_TASKS) {
            return {task: null, err: "Maximum tasks reached"};
        }
        return {task: task, err: null};
    }
    static async finishTask(userId, guildId, name_lower) {
        const {task, err, didYouMean} = await this.findByUserAndName(userId, guildId, name_lower);
        if (err === "Task not found") {
            if (didYouMean) {
                return {task: null, err: "Task not found", didYouMean: didYouMean};
            } else {
                return {task: null, err: "Task not found"};
            }
        }
        task.completed = true;
        await task.save();
        await this.addCompletedTask(userId, guildId, {
            name: task.name,
            name_lower: task.name_lower,
            category: task.category,
            dueDate: task.dueDate,
        });
        return {task: task, err: null};
    }
    static async findByUser(userId, guildId) {
        const tasks = await Task.find({ userId, guildId });
        return tasks; // Will be [] if no tasks found
    }

    static async countByUser(userId, guildId) {
        return await Task.countDocuments({ userId, guildId });
    }

    static async findByUserAndName(userId, guildId, name) {
        const nameLower = name.toLowerCase();
        const task = await Task.findOne({ userId, guildId, name_lower: nameLower });
        if (!task) {
            const tasks = await this.findByUser(userId, guildId);
            const taskNames = tasks.map(t => t.name_lower);
            const suggestion = didYouMean(nameLower, taskNames);
            return {task: null, err: "Task not found", didYouMean: suggestion};
        }
        return {task: task, err: null}; // Will be null if no task found
    }
    // COMPLETED TASKS
    static async addCompletedTask(userId, guildId, taskId) {
        const result = await UserCompletedTasks.findOneAndUpdate(
            { userId, guildId },
            { $push: { completedTasks: taskId } },
            { upsert: true, new: true }
        );
        return result;
    }
    static async findCompletedTasks(userId, guildId) {
        const completedTasks = await UserCompletedTasks.findOne({ userId, guildId });
        return completedTasks;
    }

    static async createCompletedTasks(userId, guildId) {
        const completedTasks = await UserCompletedTasks.create({ userId, guildId });
        return completedTasks;
    }

    static async getOrCreateCompletedTasks(userId, guildId) {
        let completedTasks = await UserCompletedTasks.findOne({ userId, guildId });
        if (!completedTasks) {
            completedTasks = await this.createCompletedTasks(userId, guildId);
            return {completedTasks, isNew: true};
        }
        return {completedTasks, isNew: false};
    }
}

module.exports = TaskService;
