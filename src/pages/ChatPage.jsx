import { useState } from 'react';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { from: 'user', text: 'Hello mechanic, my bike broke down!' },
    { from: 'mechanic', text: 'I’m nearby. Can you share your location?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;

    setMessages([...messages, { from: 'user', text: input }]);
    setInput('');
    // Later: send message to backend via socket
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-blue-600 text-white px-4 py-3 text-lg font-semibold">
        👨‍🔧 Chat with Mechanic
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-xs ${
              msg.from === 'user'
                ? 'bg-blue-100 self-end text-right ml-auto'
                : 'bg-gray-200 self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex p-4 bg-white border-t">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-l"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
