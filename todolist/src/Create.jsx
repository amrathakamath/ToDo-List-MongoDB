import React, { useState } from 'react';
import axios from 'axios';

function Create({ addTodo }) {
    const [task, setTask] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!task.trim()) {
            setError("Task cannot be empty.");
            return;
        }

        axios.post('http://localhost:3001/add', { task, dueDate, priority })
            .then(response => {
                addTodo(response.data);
                setTask('');
                setDueDate('');
                setPriority('Medium');
                setError('');
            })
            .catch(err => {
                console.log(err);
                setError("There was an error adding your task. Please try again.");
            });
    };

    return (
        <form onSubmit={handleSubmit} className="create-form">
            {error && <p className="error-message">{error}</p>}
            <input 
                type="text" 
                placeholder="Add a new task..." 
                value={task} 
                onChange={(e) => setTask(e.target.value)} 
                className="input-field"
            />
            <input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                className="input-field"
            />
            <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)} 
                className="input-field"
            >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
            <button type="submit" className="submit-btn">Add</button>
        </form>
    );
}

export default Create;
