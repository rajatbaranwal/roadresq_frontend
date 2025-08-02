import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import helpRoutes from './routes/helpRoutes.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // HTTP server for Socket.IO

// ✅ Setup Socket.IO server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

// Attach Socket.IO to app if needed in routes
app.set('io', io);

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/help', helpRoutes);

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Socket.IO Real-Time Chat Logic
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // When user joins their room
  socket.on('join', (userId) => {
    const room = String(userId); // Ensure it's a string
    socket.join(room);

    // Debug logs
    console.log(`📥 User ${room} joined room`);
    console.log('📂 Current rooms for this socket:', socket.rooms);
  });

  // When user sends a message
  socket.on('sendMessage', ({ senderId, receiverId, message }) => {
    const sender = String(senderId);
    const receiver = String(receiverId);

    // Debug logs
    console.log(`💬 ${sender} ➝ ${receiver}: ${message}`);
    console.log('📂 Active Rooms:', [...io.sockets.adapter.rooms.keys()]);
    console.log('📡 Emitting to room:', receiver);

    // Emit message to receiver's room
    io.to(receiver).emit('receiveMessage', { senderId: sender, message });
  });

  // When client disconnects
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5050;

// Force IPv4 (127.0.0.1) to avoid Mac localhost (::1) issues
server.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
});
