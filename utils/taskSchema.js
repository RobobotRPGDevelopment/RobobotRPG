const mongoose = require('mongoose');

// Define the schema for the task list
const taskSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    name: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date, required: false},
    category: { type: String, required: false},
    difficulty: { type: Number, required: false},
}, { timestamps: true });

// Create and export the model
const task = mongoose.model('Task', taskSchema);
module.exports = task;

