import React, { useState } from 'react';

const TodoList = ({ onTaskComplete }) => {
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Welcome to Axolotl Focus!', completed: false }
    ]);
    const [inputValue, setInputValue] = useState('');

    const addTask = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        setTasks([...tasks, { id: Date.now(), text: inputValue, completed: false }]);
        setInputValue('');
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                const newCompleted = !task.completed;
                if (newCompleted && onTaskComplete) {
                    onTaskComplete();
                }
                return { ...task, completed: newCompleted };
            }
            return task;
        }));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <h2>Tasks</h2>
            <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>

                <form onSubmit={addTask} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Add a new task..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.8rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <button type="submit" style={{
                        padding: '0 1.2rem',
                        background: 'var(--accent-primary)',
                        color: 'var(--bg-primary)',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                    }}>+</button>
                </form>

                <ul style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    overflowY: 'auto',
                    maxHeight: '300px'
                }}>
                    {tasks.map(task => (
                        <li key={task.id} style={{
                            padding: '0.8rem',
                            background: task.completed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            transition: 'all 0.2s ease',
                            opacity: task.completed ? 0.6 : 1
                        }}>
                            <button
                                onClick={() => toggleTask(task.id)}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: `2px solid ${task.completed ? 'var(--accent-primary)' : 'var(--text-secondary)'}`,
                                    background: task.completed ? 'var(--accent-primary)' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--bg-primary)',
                                    fontSize: '14px'
                                }}
                            >
                                {task.completed && '✓'}
                            </button>

                            <span style={{
                                flex: 1,
                                textDecoration: task.completed ? 'line-through' : 'none',
                                color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
                            }}>
                                {task.text}
                            </span>

                            <button
                                onClick={() => deleteTask(task.id)}
                                style={{
                                    color: 'var(--text-secondary)',
                                    background: 'transparent',
                                    fontSize: '1.2rem',
                                    opacity: 0.5
                                }}
                                onMouseEnter={(e) => e.target.style.opacity = 1}
                                onMouseLeave={(e) => e.target.style.opacity = 0.5}
                            >
                                ×
                            </button>
                        </li>
                    ))}
                    {tasks.length === 0 && (
                        <li style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem' }}>
                            No tasks yet. Add one to get started!
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};
export default TodoList;
