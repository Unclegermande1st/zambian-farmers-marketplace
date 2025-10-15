// src/pages/Chats.jsx 
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Chats = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const toast = useToast();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchConversation(selectedUser.id);
      // Auto-refresh messages every 5 seconds
      const interval = setInterval(() => {
        fetchConversation(selectedUser.id);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const [inboxRes, sentRes] = await Promise.all([
        axios.get(`${API_URL}/messages/inbox`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/messages/sent`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // Combine and deduplicate users
      const allMessages = [...inboxRes.data, ...sentRes.data];
      const userMap = new Map();

      allMessages.forEach(msg => {
        const otherUserId = msg.senderId === user.userId ? msg.receiverId : msg.senderId;
        const otherUserName = msg.senderId === user.userId ? msg.receiverName : msg.senderName;
        
        if (!userMap.has(otherUserId)) {
          userMap.set(otherUserId, {
            id: otherUserId,
            name: otherUserName,
            lastMessage: msg.content,
            timestamp: msg.timestamp,
            unread: msg.receiverId === user.userId && !msg.read
          });
        } else {
          // Update if this message is newer
          const existing = userMap.get(otherUserId);
          if (new Date(msg.timestamp) > new Date(existing.timestamp)) {
            existing.lastMessage = msg.content;
            existing.timestamp = msg.timestamp;
          }
          if (msg.receiverId === user.userId && !msg.read) {
            existing.unread = true;
          }
        }
      });

      const convList = Array.from(userMap.values()).sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      setConversations(convList);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (otherUserId) => {
    try {
      const res = await axios.get(`${API_URL}/messages/conversation/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);

      // Mark unread messages as read
      const unreadMessages = res.data.filter(
        msg => msg.receiverId === user.userId && !msg.read
      );
      for (const msg of unreadMessages) {
        await axios.patch(
          `${API_URL}/messages/${msg.id}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
      toast.error('Failed to load messages');
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    setSending(true);
    try {
      await axios.post(
        `${API_URL}/messages/send`,
        {
          receiverId: selectedUser.id,
          content: newMessage
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewMessage('');
      fetchConversation(selectedUser.id);
      fetchConversations(); // Update conversation list
    } catch (err) {
      console.error('Failed to send message:', err);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Conversations List */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b bg-green-600 text-white">
          <h2 className="text-xl font-bold">💬 Messages</h2>
          <p className="text-sm opacity-90">{conversations.length} conversations</p>
        </div>

        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p>No messages yet</p>
            <p className="text-sm mt-2">Start chatting with farmers or buyers!</p>
          </div>
        ) : (
          <div>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedUser(conv)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedUser?.id === conv.id ? 'bg-green-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">👤</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {conv.name}
                      </h3>
                      {conv.unread && (
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conv.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conv.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span>👤</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">Active now</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderId === user.userId ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                        msg.senderId === user.userId
                          ? 'bg-green-600 text-white rounded-tr-none'
                          : 'bg-white shadow rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.senderId === user.userId ? 'text-green-100' : 'text-gray-500'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={sending}
                  className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>📤 Send</>
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-xl">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;