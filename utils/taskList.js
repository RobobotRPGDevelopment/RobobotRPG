const mongoose = require('mongoose');

// Define the schema for the task list
const taskListSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    tasks: [
        {
            description: { type: String, required: true },
            completed: { type: Boolean, default: false },
            dueDate: { type: Date, required: false},
            difficulty: { type: Number, required: false},    
        },
    ],
}, { timestamps: true });

// Create and export the model
const tasksList = mongoose.model('TasksList', taskListSchema);

module.exports = tasksList;

