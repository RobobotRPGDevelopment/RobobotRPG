const mongoose = require('mongoose');

// Define the schema for the task list
const taskSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    name: { type: String, required: true },
    name_lower: { type: String, required: true },
    category: { type: String, required: false},
    difficulty: { type: Number, required: false},
    completed: { type: Boolean, default: false},
    dueDate: { type: Date, required: false},
}, { timestamps: true });

// Create compound index for userId and guildId
taskSchema.index({ userId: 1, guildId: 1 });

// Create and export the model
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;