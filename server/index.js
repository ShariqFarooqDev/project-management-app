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

// --- START OF CORS CONFIGURATION ---
// Define the allowed origins
const allowedOrigins = ['http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // This is important for handling cookies or authorization headers
};

app.use(cors(corsOptions));
// --- END OF CORS CONFIGURATION ---


const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } }); // Socket.io has its own cors config

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/boards', require('./routes/boardRoutes'));

io.on('connection', socket => {
  console.log('New socket connection');
  socket.on('sendMessage', msg => {
    io.emit('receiveMessage', msg);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
