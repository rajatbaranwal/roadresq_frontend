import { useEffect, useState } from 'react';
import socket from '../utils/socket';
import { useAuth } from '../context/AuthContext';

const Chat = ({ receiverId }) => {
  const { user } = useAuth();

  // Handle both `id` and `_id` from AuthContext
  const userId = user?._id || user?.id;

  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  // ✅ Join room whenever user becomes available
  useEffect(() => {
    console.log("👤 Current user from AuthContext:", user);
    console.log("🆔 Computed userId:", userId);

    if (!userId) {
      console.warn("⚠ userId not ready yet. Waiting to join room...");
      return;
    }

    console.log("🔗 Joining room:", userId);
    socket.emit('join', String(userId));

    // Listen for incoming messages
    socket.on('receiveMessage', (data) => {
      console.log("📥 Message received on client:", data);
      setChat((prev) => [...prev, { from: 'them', text: data.message }]);
    });

    // Cleanup listener on unmount
    return () => {
      console.log("❌ Cleaning up chat listeners for user:", userId);
      socket.off('receiveMessage');
    };
  }, [user, userId]); // ✅ Effect re-runs when user finally loads

  // ✅ Handle sending messages
  const handleSend = () => {
    if (!message.trim()) return;

    if (!userId) {
      console.warn("⚠ Cannot send, userId missing");
      return;
    }
    if (!receiverId) {
      console.warn("⚠ Cannot send, receiverId missing");
      return;
    }

    console.log(`📤 Sending from ${userId} ➝ ${receiverId}:`, message);

    // Show message locally
    setChat((prev) => [...prev, { from: 'me', text: message }]);

    // Emit to server
    socket.emit('sendMessage', {
      senderId: String(userId),
      receiverId: String(receiverId),
      message,
    });

    setMessage('');
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">💬 Live Chat</h2>
      <div className="h-64 overflow-y-scroll border p-2 mb-4">
        {chat.map((m, i) => (
          <div
            key={i}
            className={`p-2 my-1 rounded ${
              m.from === 'me'
                ? 'bg-blue-100 text-right'
                : 'bg-gray-100 text-left'
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-grow border p-2 rounded-l"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button
          className="bg-blue-600 text-white px-4 rounded-r"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
