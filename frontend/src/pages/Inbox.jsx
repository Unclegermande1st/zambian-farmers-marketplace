// frontend/src/pages/Inbox.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/messages/inbox", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const formattedMessages = res.data.map(msg => ({
          ...msg,
          timestamp: msg.timestamp?._seconds
            ? new Date(msg.timestamp._seconds * 1000)
            : new Date(Date.now())
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
  }, []);

  if (loading) return <p>Loading messages...</p>;

  return (
    <div className="container my-4">
      <h2>📬 Inbox</h2>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <div className="list-group">
          {messages.map((msg) => (
            <Link
              key={msg.id}
              to={`/inbox/${msg.id}`}
              style={{ textDecoration: 'none' }}
              className="list-group-item mb-3"
            >
              <h6>
                From: <strong>{msg.senderRole}</strong>
              </h6>
              {msg.productId && (
                <p>
                  About: Product #{msg.productId.slice(0, 6)}...
                </p>
              )}
              <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              <small className="text-muted">
                {msg.timestamp.toLocaleString()}
              </small>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}