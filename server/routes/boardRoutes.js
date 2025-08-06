// server/routes/boardRoutes.js
const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
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
// @desc    Get all boards for the logged-in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Find all boards where the owner matches the logged-in user's ID
    const boards = await Board.find({ owner: req.user.id });
    res.json(boards);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// We will add routes for updating and deleting boards later

module.exports = router;
