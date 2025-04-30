const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    task: { 
        type: String, 
        required: true 
    },
    done: { 
        type: Boolean, 
        default: false 
    },
    dueDate: { 
        type: Date, 
        default: null // Set default as null, but can be updated with a valid date
    },
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'], // Restrict to Low, Medium, or High
        default: 'Medium' // Default priority is Medium
    }
}, { timestamps: true }); // Automatically create createdAt and updatedAt fields

const TodoModel = mongoose.model('Todo', TodoSchema);
module.exports = TodoModel;
