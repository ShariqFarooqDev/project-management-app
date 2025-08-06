// client/src/pages/BoardView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CreateTask from '../components/CreateTask';
import TaskCard from '../components/TaskCard'; // Import the new TaskCard component

const BoardView = () => {
  const [tasks, setTasks] = useState([]);
  const [boardName, setBoardName] = useState('');
  const [error, setError] = useState('');
  const { boardId } = useParams();

  const fetchTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const tasksRes = await axios.get(`http://localhost:5000/api/tasks/board/${boardId}`, config);
      setTasks(tasksRes.data);
      setBoardName(`Board ID: ${boardId}`);
    } catch (err) {
      setError('Failed to fetch tasks.');
      console.error(err);
    }
  }, [boardId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // This function now uses the TaskCard component
  const renderTasks = (status) => {
    return tasks
      .filter(task => task.status === status)
      .map(task => (
        <TaskCard key={task._id} task={task} onTaskUpdate={fetchTasks} />
      ));
  };

  return (
    <div>
      <h2>{boardName}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <CreateTask boardId={boardId} onTaskCreated={fetchTasks} />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '15px' }}>
        <div style={{ width: '33%', backgroundColor: '#f4f5f7', padding: '10px', borderRadius: '5px' }}>
          <h3>To-Do</h3>
          {renderTasks('To-Do')}
        </div>
        <div style={{ width: '33%', backgroundColor: '#f4f5f7', padding: '10px', borderRadius: '5px' }}>
          <h3>In Progress</h3>
          {renderTasks('In Progress')}
        </div>
        <div style={{ width: '33%', backgroundColor: '#f4f5f7', padding: '10px', borderRadius: '5px' }}>
          <h3>Done</h3>
          {renderTasks('Done')}
        </div>
      </div>
    </div>
  );
};

export default BoardView;
