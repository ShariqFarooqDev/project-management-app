// server/index.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = ['http://localhost:5173'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
};
app.use(cors(corsOptions));

const server = http.createServer(app);
// Update socket.io CORS to match
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/boards', require('./routes/boardRoutes'));

// --- UPDATED SOCKET.IO LOGIC ---
io.on('connection', socket => {
  console.log('New socket connection:', socket.id);

  // When a user joins a board-specific room
  socket.on('joinBoard', (boardId) => {
    socket.join(boardId);
    console.log(`Socket ${socket.id} joined board ${boardId}`);
  });

  // When a message is sent
  socket.on('sendMessage', ({ message, boardId }) => {
    // Broadcast the message to everyone in that specific board's room
    io.to(boardId).emit('receiveMessage', { message });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});
// --- END OF UPDATED LOGIC ---

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
