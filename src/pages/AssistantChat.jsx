import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AssistantChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `Hello ${user?.name || 'there'}! I'm your SmartAgri assistant. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');

  // Simple rule-based responses
  const getAssistantResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('weather') || msg.includes('rain')) {
      return "The rainy season in Zambia typically runs from November to April. It's best to plant maize and other crops at the start of the rains.";
    }
    
    if (msg.includes('maize') || msg.includes('corn')) {
      return "Maize is best planted between November and December. Use hybrid seeds for better yields. Make sure to apply fertilizer at planting and top-dress after 3-4 weeks.";
    }
    
    if (msg.includes('tomato')) {
      return "Tomatoes can be grown year-round with irrigation. Plant them in well-drained soil with lots of sunlight. They're ready to harvest in 70-80 days.";
    }
    
    if (msg.includes('price') || msg.includes('sell')) {
      return "Check current market prices on the marketplace. Seasonal products like tomatoes fetch better prices in the dry season when supply is low.";
    }
    
    if (msg.includes('fertilizer')) {
      return "For maize, use compound D at planting (10g per station) and Urea as top dressing (5g per station) after 3-4 weeks. Always apply when soil is moist.";
    }

    if (msg.includes('help') || msg.includes('hello') || msg.includes('hi')) {
      return "I can help you with:\n• Planting advice\n• Weather information\n• Crop recommendations\n• Pricing tips\n• Fertilizer guidance\n\nWhat would you like to know?";
    }

    return "I'm not sure about that. Try asking about planting times, weather, crop care, or market prices!";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([...messages, userMessage]);

    // Get assistant response
    setTimeout(() => {
      const assistantMessage = {
        id: messages.length + 2,
        sender: 'assistant',
        text: getAssistantResponse(input),
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 500);

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 shadow">
        <h1 className="text-xl font-bold">🤖 SmartAgri Assistant</h1>
        <p className="text-sm opacity-90">Ask me about farming, weather, and crops!</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl w-full mx-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-lg p-4 ${
                msg.sender === 'user'
                  ? 'bg-green-600 text-white rounded-tr-none'
                  : 'bg-white shadow rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              <p className={`text-xs mt-2 ${
                msg.sender === 'user' ? 'text-green-100' : 'text-gray-500'
              }`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4 max-w-4xl w-full mx-auto">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about farming..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantChat;