import { useState } from 'react';

const Chats = () => {
  const [messages, setMessages] = useState([
    { sender: "Green Valley Farm", text: "Hi! The tomatoes are available next week.", time: "10:30 AM" },
    { sender: "You", text: "Great! I'll take 5kg.", time: "10:32 AM" },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: "You", text: newMessage, time: "Now" }]);
      setNewMessage('');
    }
  };

  return (
    <div className="p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-xs ${msg.sender === "You" ? "bg-green-100 ml-auto" : "bg-gray-100"}`}
          >
            <p className="font-semibold">{msg.sender}</p>
            <p>{msg.text}</p>
            <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-l-lg p-2"
        />
        <button
          onClick={handleSend}
          className="bg-green-500 text-white px-4 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chats;