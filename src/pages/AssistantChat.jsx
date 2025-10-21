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
      return "I can help you with:\n- Planting advice\n- Weather information\n- Crop recommendations\n- Pricing tips\n- Fertilizer guidance\n\nWhat would you like to know?";
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
    <div className="assistant-shell">
      {/* Header */}
      <div className="assistant-head">
        <h1 className="assistant-title">SmartAgri Assistant</h1>
        <p className="assistant-sub">Ask me about farming, weather, and crops!</p>
      </div>

      {/* Messages */}
      <div className="assistant-feed">
        {messages.map((msg) => (
          <div key={msg.id} className={`assist-row ${msg.sender === 'user' ? 'end' : ''}`}>
            <div className={`bubble ${msg.sender === 'user' ? 'user' : 'assistant'}`}>
              <p className="whitespace-pre-line">{msg.text}</p>
              <p className="bubble-time">{msg.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="assistant-inputbar">
        <div className="assistant-inputwrap">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about farming..."
            className="assistant-text"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="assistant-send"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantChat;