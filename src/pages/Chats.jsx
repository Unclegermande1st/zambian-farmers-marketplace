// src/pages/Chats.jsx
import { useState, useEffect } from 'react';
import { messageAPI } from '../services/api';

const Chats = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch messages from backend when page loads
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await messageAPI.getInbox();
      setMessages(res.data || []);
    } catch (err) {
      console.error('❌ Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      // Replace with the actual recipient’s ID (e.g. from context or state)
      const receiverId = "someReceiverId"; 

      await messageAPI.send({
        receiverId,
        content: newMessage
      });

      setNewMessage('');
      fetchMessages(); // Refresh messages after sending
    } catch (err) {
      console.error('❌ Failed to send message:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-xs ${
                msg.senderId === 'currentUserId' ? 'bg-green-100 ml-auto' : 'bg-gray-100'
              }`}
            >
              <p className="font-semibold">{msg.senderName || 'User'}</p>
              <p>{msg.content || msg.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {msg.time || new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-8">No messages yet.</p>
        )}
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
