// client/src/components/TaskCard.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ task }) => {
  // This hook provides all the necessary props for a draggable item
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task._id });

  // This style applies the transformations during dragging
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: '1px solid #ddd',
    padding: '10px',
    margin: '10px 0',
    backgroundColor: 'white',
    borderRadius: '5px',
    cursor: 'grab', // Changes the cursor to indicate it's draggable
  };

  return (
    // setNodeRef registers this div as a draggable item.
    // {...attributes} and {...listeners} attach the necessary event handlers.
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
    </div>
  );
};

export default TaskCard;
