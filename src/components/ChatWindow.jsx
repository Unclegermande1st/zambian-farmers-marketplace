import { useState, useEffect, useRef } from 'react';
import { FiSend, FiImage, FiUser } from 'react-icons/fi';

const ChatWindow = ({ currentChat, onSendMessage, onBack }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Sample data - replace with real chat data from props/context/API
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm interested in your organic tomatoes.",
      sender: 'buyer',
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      text: "Great! They're $5/kg. How many kg do you need?",
      sender: 'seller',
      timestamp: '10:32 AM'
    },
  ]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'buyer', // In real app, this would be dynamic
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, newMessage]);
      // In real app: Call onSendMessage(newMessage) to send to backend
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat header */}
      <div className="bg-green-600 text-white p-4 flex items-center">
        <button onClick={onBack} className="mr-2 text-white">
          &larr;
        </button>
        <div className="w-8 h-8 rounded-full bg-white text-green-600 flex items-center justify-center mr-3">
          <FiUser size={18} />
        </div>
        <div>
          <h3 className="font-semibold">{currentChat?.sellerName || "Farm Seller"}</h3>
          <p className="text-xs opacity-80">Online</p>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.sender === 'buyer' 
                ? 'bg-green-100 rounded-tr-none' 
                : 'bg-white border rounded-tl-none shadow-sm'}`}
            >
              <p className="text-gray-800">{msg.text}</p>
              <p className="text-xs text-gray-500 mt-1 text-right">{msg.timestamp}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t bg-white p-3">
        <div className="flex items-center">
          <button className="p-2 text-gray-500 hover:text-green-600">
            <FiImage size={20} />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 border rounded-full py-2 px-4 mx-2 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-2 rounded-full bg-green-600 text-white disabled:opacity-50"
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;