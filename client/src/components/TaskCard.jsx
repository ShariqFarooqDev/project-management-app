// client/src/components/TaskCard.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './TaskCard.css'; // Import the CSS

const TaskCard = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="task-card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
    </div>
  );
};

export default TaskCard;
