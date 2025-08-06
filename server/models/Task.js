// server/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['To-Do', 'In Progress', 'Done'],
    default: 'To-Do',
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
  // We can add more fields later, like assignedUser, dueDate, etc.
}, { timestamps: true }); // `timestamps: true` adds createdAt and updatedAt fields

module.exports = mongoose.model('Task', taskSchema);
