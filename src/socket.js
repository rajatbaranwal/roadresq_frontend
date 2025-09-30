// import { io } from 'socket.io-client';

// // Connect through Vite proxy (no hardcoded localhost)
// const socket = io('/', {
//   withCredentials: true,
//   transports: ['polling', 'websocket'],
// });

// socket.on('connect', () => {
//   console.log('✅ Connected via Vite Proxy');
// });

// socket.on('connect_error', (err) => {
//   console.error('❌ Connection failed:', err.message);
// });

// export default socket;



import { io } from "socket.io-client";

// Connect to backend Socket.IO server
const socket = io("https://roadresq-backkend.onrender.com", {
  withCredentials: true,
  transports: ["websocket", "polling"], // ensure fallback
});

// Log when connected
socket.on("connect", () => {
  console.log("✅ Socket connected with ID:", socket.id);
});

// Log connection errors
socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

// Log disconnection
socket.on("disconnect", (reason) => {
  console.warn("⚠ Socket disconnected:", reason);
});

// 🔹 Log ALL incoming events for debugging
socket.onAny((event, ...args) => {
  console.log(`📡 Socket event: ${event}`, args);
});

export default socket;

