// server/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Board = require('../models/Board');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/tasks
// @desc    Create a new task for a specific board
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, boardId } = req.body;

    // Find the board and populate its members to check authorization
    const board = await Board.findById(boardId).populate('members');
    
    // Check if the board exists and if the user is a member
    if (!board || !board.members.some(member => member._id.toString() === req.user.id)) {
      return res.status(403).json({ error: 'Board not found or user not authorized' });
    }

    const newTask = new Task({
      title,
      description,
      boardId,
    });

    const task = await newTask.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/tasks/board/:boardId
// @desc    Get all tasks for a specific board
// @access  Private
router.get('/board/:boardId', authMiddleware, async (req, res) => {
  try {
    const { boardId } = req.params;

    // Check if the board exists and if the user is a member
    const board = await Board.findById(boardId).populate('members');
    if (!board || !board.members.some(member => member._id.toString() === req.user.id)) {
        return res.status(403).json({ error: 'Board not found or user not authorized' });
    }

    const tasks = await Task.find({ boardId: boardId });
    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/tasks/:taskId
// @desc    Update a task (e.g., change its status)
// @access  Private
router.put('/:taskId', authMiddleware, async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const { taskId } = req.params;

        let task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // We need to check if the user is authorized to update this task.
        // We can do this by finding the board the task belongs to and checking if they are a member.
        const board = await Board.findById(task.boardId).populate('members');
        if (!board || !board.members.some(member => member._id.toString() === req.user.id)) {
            return res.status(403).json({ error: 'User not authorized to update this task' });
        }

        // Update the task fields
        task = await Task.findByIdAndUpdate(
            taskId,
            { $set: { title, description, status } },
            { new: true } // {new: true} returns the updated document
        );

        res.json(task);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
