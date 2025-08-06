// client/src/components/TaskCard.jsx
import React from 'react';
import axios from 'axios';

const TaskCard = ({ task, onTaskUpdate }) => {
  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      // We only need to send the new status in the body
      const body = { status: newStatus };

      // Call the PUT endpoint to update the task
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, body, config);
      
      // Tell the parent component to refetch all tasks
      onTaskUpdate();
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0', backgroundColor: 'white', borderRadius: '5px' }}>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <div style={{ marginTop: '10px' }}>
        <small>Move to:</small>
        {/* Only show buttons for statuses the task is NOT currently in */}
        {task.status !== 'To-Do' && <button onClick={() => handleStatusChange('To-Do')}>To-Do</button>}
        {task.status !== 'In Progress' && <button onClick={() => handleStatusChange('In Progress')}>In Progress</button>}
        {task.status !== 'Done' && <button onClick={() => handleStatusChange('Done')}>Done</button>}
      </div>
    </div>
  );
};

export default TaskCard;
