const mongoose = require('mongoose');

// Define the schema for the task list
const taskListSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    tasks: [
        {
            description: { type: String, required: true },
            completed: { type: Boolean, default: false },
        },
    ],
}, { timestamps: true });

// Create and export the model
const taskList = mongoose.model('TaskList', taskListSchema);

module.exports = taskList;

