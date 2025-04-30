import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsPencilSquare } from "react-icons/bs"; 
import Create from './Create';
import './App.css';

function Home() {
    const [todos, setTodos] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newTask, setNewTask] = useState("");
    const [newDueDate, setNewDueDate] = useState("");
    const [filter, setFilter] = useState("All"); // Filter state

    const fetchTodos = () => {
        axios.get('http://localhost:3001/get')
            .then(result => setTodos(result.data))
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleEdit = (id) => {
        axios.put(`http://localhost:3001/update/${id}`)
            .then(() => fetchTodos())
            .catch(err => console.log(err));
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/delete/${id}`)
            .then(() => {
                setTodos(todos.filter(todo => todo._id !== id));
            })
            .catch(err => console.log(err));
    };

    const handleEditStart = (id, task, dueDate) => {
        setEditingId(id);
        setNewTask(task);
        setNewDueDate(dueDate ? new Date(dueDate).toISOString().split('T')[0] : "");
    };

    const handleEditChange = (e) => {
        setNewTask(e.target.value);
    };

    const handleDueDateChange = (e) => {
        setNewDueDate(e.target.value);
    };

    const handleEditSave = (id) => {
        if (newTask.trim() === "") return;
        
        axios.put(`http://localhost:3001/update-task/${id}`, { task: newTask, dueDate: newDueDate })
            .then(() => {
                setEditingId(null);
                fetchTodos();
            })
            .catch(err => console.log(err));
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === "Completed") return todo.done;
        if (filter === "Pending") return !todo.done;
        return true; // "All"
    });

    return (
        <div className="home">
            <h2 className="title">Todo List</h2>
            <Create addTodo={(newTodo) => setTodos([...todos, newTodo])} />

            <div className="filter">
                <button onClick={() => setFilter("All")}>All</button>
                <button onClick={() => setFilter("Completed")}>Completed</button>
                <button onClick={() => setFilter("Pending")}>Pending</button>
            </div>

            {filteredTodos.length === 0 ? (
                <div className="empty-message"><h3>No Tasks Found</h3></div>
            ) : (
                filteredTodos.map((todo) => (
                    <div key={todo._id} className={`task ${todo.done ? "completed" : ""}`}>
                        <div className="task-content">
                            <div className="checkbox" onClick={() => handleEdit(todo._id)}>
                                {todo.done ? 
                                    <BsFillCheckCircleFill className='icon check-icon' /> :
                                    <BsCircleFill className='icon circle-icon' />
                                }
                                {editingId === todo._id ? (
                                    <>
                                        <input 
                                            type="text" 
                                            value={newTask} 
                                            onChange={handleEditChange} 
                                            onBlur={() => handleEditSave(todo._id)}
                                            onKeyDown={(e) => e.key === "Enter" && handleEditSave(todo._id)}
                                            autoFocus
                                        />
                                        <input 
                                            type="date" 
                                            value={newDueDate} 
                                            onChange={handleDueDateChange} 
                                            onBlur={() => handleEditSave(todo._id)}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <p className={todo.done ? "line_through" : ""} onDoubleClick={() => handleEditStart(todo._id, todo.task, todo.dueDate)}>
                                            {todo.task}
                                        </p>
                                        <p className="due-date">
                                            {todo.dueDate ? `Due: ${new Date(todo.dueDate).toLocaleDateString()}` : "No Due Date"}
                                        </p>
                                    </>
                                )}
                            </div>
                            <div className="actions">
                                <BsPencilSquare className='icon edit-icon' onClick={() => handleEditStart(todo._id, todo.task, todo.dueDate)} />
                                <BsFillTrashFill className='icon trash-icon' onClick={() => handleDelete(todo._id)} />
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;
