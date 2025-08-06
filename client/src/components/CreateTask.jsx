// client/src/components/CreateTask.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CreateTask = ({ boardId, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const body = { title, description, boardId };

      await axios.post('http://localhost:5000/api/tasks', body, config);

      // Clear the form and call the parent's function to refresh the task list
      setTitle('');
      setDescription('');
      setError('');
      onTaskCreated(); // This tells the BoardView to refetch tasks
    } catch (err) {
      setError('Failed to create task.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px' }}>
      <h3>Create New Task</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '95%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div>
          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '95%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <button type="submit">Add Task</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateTask;
