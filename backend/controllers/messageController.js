// backend/controllers/messageController.js
const { db } = require('../firebase');
const authenticate = require('../middleware/authMiddleware');

// POST /api/messages/send
exports.sendMessage = async (req, res) => {
  const { receiverId, productId, content } = req.body;
  const { userId, role } = req.user;

  if (!receiverId || !content) {
    return res.status(400).json({ error: "Receiver and message content are required" });
  }

  try {
    const messageData = {
      senderId: userId,
      senderRole: role,
      receiverId,
      productId: productId || null,
      content,
      read: false,
      timestamp: new Date(),
    };

    await db.collection('messages').add(messageData);

    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Failed to send message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// GET /api/messages/inbox
exports.getInbox = async (req, res) => {
  const { userId } = req.user;

  try {
    const snapshot = await db.collection('messages')
      .where('receiverId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(messages);
  } catch (err) {
    console.error("❌ Error fetching inbox:", err);
    res.status(500).json({ error: "Failed to load inbox" });
  }
};

// GET /api/messages/sent
exports.getSent = async (req, res) => {
  const { userId } = req.user;

  try {
    const snapshot = await db.collection('messages')
      .where('senderId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load sent messages" });
  }
};

// GET /api/messages/:id
exports.getMessageById = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const doc = await db.collection('messages').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Message not found" });
    }

    const data = doc.data();

    // Security: Only sender or receiver can view
    if (data.senderId !== userId && data.receiverId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({
      id: doc.id,
      ...data
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load message" });
  }
};