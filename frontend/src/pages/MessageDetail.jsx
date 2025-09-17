// frontend/src/pages/MessageDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function MessageDetail() {
  const { messageId } = useParams();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/${messageId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const msg = {
          ...res.data,
          timestamp: new Date(res.data.timestamp._seconds * 1000)
        };
        setMessage(msg);
      } catch (err) {
        console.error("Failed to load message:", err);
        alert("Could not load message.");
      } finally {
        setLoading(false);
      }
    };

    if (messageId && token) fetchMessage();
  }, [messageId, token]);

  if (loading) return <p>Loading message...</p>;
  if (!message) return <p>Message not found.</p>;

  return (
    <div className="container my-4">
      <Link to="/inbox" className="btn btn-link mb-3">&larr; Back to Inbox</Link>

      <div className={`card mb-3 ${message.senderId === userId ? 'bg-light' : ''}`}>
        <div className="card-body">
          <h6 className="text-muted">
            From: <strong>{message.senderRole}</strong>
            <br />
            <small>{message.timestamp.toLocaleString()}</small>
          </h6>
          <p>{message.content}</p>
        </div>
      </div>

      {/* Show Reply Form only to receiver */}
      {message.receiverId === userId && (
        <ReplyForm
          senderId={message.senderId}
          onReplySent={() => window.location.reload()}
        />
      )}
    </div>
  );
}

// Inline Reply Component
function ReplyForm({ senderId, onReplySent }) {
  const [reply, setReply] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/messages/send",
        {
          receiverId: senderId,
          content: reply
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReply("");
      onReplySent();
    } catch (err) {
      alert("Failed to send reply.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h6>Reply</h6>
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        className="form-control"
        rows="3"
        placeholder="Type your response..."
      ></textarea>
      <button type="submit" className="btn btn-primary btn-sm mt-2">Send Reply</button>
    </form>
  );
}