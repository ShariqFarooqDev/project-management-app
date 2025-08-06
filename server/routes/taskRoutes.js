// server/routes/taskRoutes.js

const express = require('express');
const router = express.Router();

// Placeholder task route
router.get('/', (req, res) => {
  res.send('Task route is working!');
});

module.exports = router;
