// client/src/pages/BoardView.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BoardView = () => {
  const [tasks, setTasks] = useState([]);
  const [boardName, setBoardName] = useState('');
  const [error, setError] = useState('');
  const { boardId } = useParams(); // Get the boardId from the URL

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Fetch the tasks for this specific board
        const tasksRes = await axios.get(`http://localhost:5000/api/tasks/board/${boardId}`, config);
        setTasks(tasksRes.data);

        // Optional: Fetch board details to display its name
        // (This requires creating a new backend route: GET /api/boards/:id)
        // For now, we'll just show the ID.
        setBoardName(`Board ID: ${boardId}`);

      } catch (err) {
        setError('Failed to fetch tasks.');
        console.error(err);
      }
    };

    fetchTasks();
  }, [boardId]); // Rerun the effect if the boardId changes

  // Helper to render tasks in a column
  const renderTasks = (status) => {
    return tasks
      .filter(task => task.status === status)
      .map(task => (
        <div key={task._id} style={{ border: '1px solid #ddd', padding: '10px', margin: '5px 0', backgroundColor: 'white' }}>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
        </div>
      ));
  };

  return (
    <div>
      <h2>{boardName}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        
        {/* To-Do Column */}
        <div style={{ width: '30%', backgroundColor: '#f4f5f7', padding: '10px', borderRadius: '5px' }}>
          <h3>To-Do</h3>
          {renderTasks('To-Do')}
        </div>

        {/* In Progress Column */}
        <div style={{ width: '30%', backgroundColor: '#f4f5f7', padding: '10px', borderRadius: '5px' }}>
          <h3>In Progress</h3>
          {renderTasks('In Progress')}
        </div>

        {/* Done Column */}
        <div style={{ width: '30%', backgroundColor: '#f4f5f7', padding: '10px', borderRadius: '5px' }}>
          <h3>Done</h3>
          {renderTasks('Done')}
        </div>

      </div>
    </div>
  );
};

export default BoardView;
