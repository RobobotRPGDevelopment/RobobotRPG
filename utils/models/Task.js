const mongoose = require('mongoose');

// Define the schema for the task list
const taskSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    name: { type: String, required: true },
    completed: { type: Boolean, default: false, required: true },
    dueDate: { type: Date, required: false},
    category: { type: String, required: false},
    difficulty: { type: Number, required: false},
}, { timestamps: true });

// Create compound index for userId and guildId
taskSchema.index({ userId: 1, guildId: 1 });

taskSchema.statics.findByUser = function(userId, guildId) {
    return this.find({ userId, guildId });
};

taskSchema.statics.countByUser = function(userId, guildId) {
    return this.countDocuments({ userId, guildId });
};

taskSchema.statics.findByUserAndName = function(userId, guildId, name) {
    return this.findOne({ userId, guildId, name });
};

// Create and export the model
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;