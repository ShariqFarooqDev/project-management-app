// client/src/pages/BoardView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DndContext, closestCenter, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CreateTask from '../components/CreateTask';
import TaskCard from '../components/TaskCard';
import Chat from '../components/Chat';
import './BoardView.css';

const DroppableColumn = ({ id, title, tasks }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} id={id} className="droppable-column">
      <h3>{title}</h3>
      <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
        {tasks.map(task => <TaskCard key={task._id} task={task} />)}
      </SortableContext>
    </div>
  );
};

const BoardView = () => {
  const [tasks, setTasks] = useState([]);
  const [board, setBoard] = useState(null); // Use a single state for the board
  const [newMemberUsername, setNewMemberUsername] = useState('');
  const [error, setError] = useState('');
  const { boardId } = useParams();

  const fetchBoardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const boardRes = await axios.get(`http://localhost:5000/api/boards/${boardId}`, config);
      setBoard(boardRes.data);
      
      const tasksRes = await axios.get(`http://localhost:5000/api/tasks/board/${boardId}`, config);
      setTasks(tasksRes.data);

    } catch (err) {
      setError('Failed to fetch board data.');
      console.error(err);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoardData();
  }, [fetchBoardData]);
  
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberUsername) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const body = { username: newMemberUsername };

      const response = await axios.post(
        `http://localhost:5000/api/boards/${boardId}/members`,
        body,
        config
      );
      setBoard(response.data); // Update the board state with the new member list
      setNewMemberUsername('');
      setError('');
    } catch (err) {
      setError('Failed to add member.');
      console.error(err);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    // --- NEW BUG FIX ---
    // If dropped nowhere, or on the same item, do nothing.
    if (!over || active.id === over.id) {
      return;
    }

    const taskId = active.id;
    const activeTask = tasks.find(t => t._id === taskId);
    
    // Check if the drop target is a valid column.
    const isAColumn = ['To-Do', 'In Progress', 'Done'].includes(over.id);
    let newStatus;

    if (isAColumn) {
      // Case 1: Dropped directly on a column.
      newStatus = over.id;
    } else {
      // Case 2: Dropped on another task. Find that task's status.
      const overTask = tasks.find(t => t._id === over.id);
      if (overTask) {
        newStatus = overTask.status;
      } else {
        // If we can't find a valid target, abort.
        return;
      }
    }
    // --- END OF NEW BUG FIX ---
    
    // Only proceed if the status is actually changing
    if (activeTask && activeTask.status !== newStatus) {
      setTasks(prev => prev.map(t => (t._id === taskId ? { ...t, status: newStatus } : t)));
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

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="board-header">
        <h2>{board.name}</h2>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <CreateTask boardId={boardId} onTaskCreated={fetchBoardData} />
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div className="columns-container" style={{ flex: 3 }}>
          {Object.keys(columns).map(status => (
            <DroppableColumn key={status} id={status} title={status} tasks={columns[status]} />
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <Chat boardId={boardId} />
          {/* Member Management Section */}
          <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
            <h3>Board Members</h3>
            <ul>
              {board.members.map(member => (
                <li key={member._id}>{member.username}</li>
              ))}
            </ul>
            <form onSubmit={handleAddMember}>
              <input
                type="text"
                placeholder="Enter username to add"
                value={newMemberUsername}
                onChange={(e) => setNewMemberUsername(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                required
              />
              <button type="submit" style={{ width: '100%', padding: '8px' }}>Add Member</button>
            </form>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default BoardView;
