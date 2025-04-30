const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./Models/Todo');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Validate priority
const validPriorities = ['Low', 'Medium', 'High'];

// GET all todos (with optional filtering by priority)
app.get('/get', async (req, res) => {
    const { filter } = req.query; // filter by priority (Low, Medium, High)
    let filterCondition = {};

    if (filter) {
        if (!validPriorities.includes(filter)) {
            return res.status(400).json({ message: "❌ Invalid priority filter" });
        }
        filterCondition.priority = filter; // Add priority filter
    }

    try {
        const todos = await TodoModel.find(filterCondition); // Find tasks based on filterCondition
        res.json(todos);
    } catch (err) {
        console.error("❌ Error fetching todos:", err);
        res.status(500).json({ message: "Error fetching todos", error: err });
    }
});

// TOGGLE completion status of a todo
app.put('/update/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const todo = await TodoModel.findById(id);
        if (!todo) {
            return res.status(404).json({ message: "❌ Todo not found" });
        }

        // Toggle `done` status
        todo.done = !todo.done;
        const updatedTodo = await todo.save();

        res.json(updatedTodo);
    } catch (err) {
        console.error("❌ Error updating todo:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ADD new todo
app.post('/add', async (req, res) => {
    const { task, dueDate, priority } = req.body; // Accept priority from the request body

    // Validate task
    if (!task || task.trim() === "") {
        return res.status(400).json({ message: "❌ Task cannot be empty" });
    }

    // Validate priority
    if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({ message: "❌ Invalid priority. Please select from 'Low', 'Medium', 'High'" });
    }

    try {
        const newTodo = await TodoModel.create({ task, dueDate, priority, done: false });
        res.status(201).json(newTodo);
    } catch (err) {
        console.error("❌ Error adding todo:", err);
        res.status(500).json({ message: "❌ Error adding todo", error: err });
    }
});

// DELETE todo
app.delete('/delete/:id', async (req, res) => {
    try {
        const deletedTodo = await TodoModel.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ message: "❌ Todo not found" });
        }
        res.json({ message: "✅ Task deleted", deletedTodo });
    } catch (err) {
        console.error("❌ Error deleting todo:", err);
        res.status(500).json({ message: "❌ Error deleting todo", error: err });
    }
});

// UPDATE task text and priority
app.put('/update-task/:id', async (req, res) => {
    const { id } = req.params;
    const { task, dueDate, priority } = req.body; // Accept priority in the update request

    // Validate priority
    if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({ message: "❌ Invalid priority" });
    }

    try {
        const updatedTodo = await TodoModel.findByIdAndUpdate(
            id, 
            { task, dueDate, priority }, // Update priority as well
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "❌ Todo not found" });
        }

        res.json(updatedTodo);
    } catch (err) {
        console.error("❌ Error updating task:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Start server
app.listen(3001, () => {
    console.log("🚀 Server is running on port 3001");
});
