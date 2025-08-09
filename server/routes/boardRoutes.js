// server/routes/boardRoutes.js
const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const Task = require('../models/Task'); // Import the Task model
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/boards
// @desc    Create a new board
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    // Create a new board instance
    const newBoard = new Board({
      name,
      owner: req.user.id, // The owner is the logged-in user
      members: [req.user.id], // The owner is automatically a member
    });

    // Save the board to the database
    const board = await newBoard.save();

    res.status(201).json(board);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/boards
// @desc    Get all boards for the logged-in user (including those they own and are a member of)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Find all boards where the owner or a member matches the logged-in user's ID
    const boards = await Board.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    });
    res.json(boards);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/boards/:boardId
// @desc    Get a single board by its ID
// @access  Private (Member only)
router.get('/:boardId', authMiddleware, async (req, res) => {
  try {
    const { boardId } = req.params;

    // Find the board and check if the user is a member
    const board = await Board.findById(boardId).populate('members', 'username');
    
    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    // Ensure the current user is an owner or a member of the board
    const isMember = board.members.some(member => member._id.toString() === req.user.id);
    if (!isMember && board.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to view this board' });
    }

    res.json(board);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/boards/:boardId/members
// @desc    Add a member to a board
// @access  Private (Owner only)
router.post('/:boardId/members', authMiddleware, async (req, res) => {
  try {
    const { username } = req.body;
    const { boardId } = req.params;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    // Check if the authenticated user is the owner of the board
    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only the board owner can add members' });
    }

    const memberToAdd = await User.findOne({ username });
    if (!memberToAdd) {
      return res.status(404).json({ error: 'User to add not found' });
    }

    // Check if the user is already a member
    if (board.members.includes(memberToAdd._id)) {
      return res.status(400).json({ error: 'User is already a member of this board' });
    }

    board.members.push(memberToAdd._id);
    await board.save();
    
    // We populate the members field to return the user's data, not just the ID
    const updatedBoard = await Board.findById(boardId).populate('members', 'username');

    res.status(200).json(updatedBoard);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/boards/:boardId
// @desc    Delete a board and all its tasks
// @access  Private (Owner only)
router.delete('/:boardId', authMiddleware, async (req, res) => {
    try {
      const { boardId } = req.params;
  
      const board = await Board.findById(boardId);
  
      if (!board) {
        return res.status(404).json({ error: 'Board not found' });
      }
  
      // Check if the authenticated user is the owner of the board
      if (board.owner.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Only the board owner can delete a board' });
      }
  
      // Delete all tasks associated with the board
      await Task.deleteMany({ boardId });
  
      // Delete the board itself
      await Board.findByIdAndDelete(boardId);
  
      res.json({ message: 'Board and associated tasks deleted successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });


module.exports = router;
