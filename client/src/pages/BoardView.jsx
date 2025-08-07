// client/src/pages/BoardView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DndContext, closestCenter, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CreateTask from '../components/CreateTask';
import TaskCard from '../components/TaskCard';
import Chat from '../components/Chat';
import './BoardView.css'; // Import the new CSS file

const DroppableColumn = ({ id, title, tasks }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    // Use the new CSS class instead of inline styles
    <div ref={setNodeRef} id={id} className="droppable-column">
      <h3>{title}</h3>
      <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
        {tasks.map(task => (
          <TaskCard key={task._id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
};

const BoardView = () => {
  const [tasks, setTasks] = useState([]);
  const [boardName, setBoardName] = useState('');
  const [error, setError] = useState('');
  const { boardId } = useParams();

  const fetchTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
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

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id;
    const newStatus = over.id;
    const activeTask = tasks.find(t => t._id === taskId);

    if (activeTask && activeTask.status !== newStatus) {
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t._id === taskId ? { ...t, status: newStatus } : t
        )
      );
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus }, config);
      } catch (error) {
        console.error('Failed to update task status', error);
        fetchTasks();
        setError('Failed to move task.');
      }
    }
  };

  const columns = {
    'To-Do': tasks.filter(t => t.status === 'To-Do'),
    'In Progress': tasks.filter(t => t.status === 'In Progress'),
    'Done': tasks.filter(t => t.status === 'Done'),
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="board-container">
        <h2>{boardName}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <CreateTask boardId={boardId} onTaskCreated={fetchTasks} />

        <div className="columns-container">
          {Object.keys(columns).map(status => (
            <DroppableColumn key={status} id={status} title={status} tasks={columns[status]} />
          ))}
        </div>
        
        <Chat boardId={boardId} />
      </div>
    </DndContext>
  );
};

export default BoardView;
