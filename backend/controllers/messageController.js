// backend/controllers/messageController.js
const { db } = require('../firebase');

// =========================
// Send a new message
// POST /api/messages/send
// =========================
exports.sendMessage = async (req, res) => {
  const { receiverId, productId, content, imageUrl } = req.body;
  const { userId, role } = req.user;

  if (!receiverId || !content) {
    return res.status(400).json({ error: "Receiver and message content are required" });
  }

  try {
    // Fetch sender and receiver details
    const senderDoc = await db.collection('users').doc(userId).get();
    const receiverDoc = await db.collection('users').doc(receiverId).get();

    if (!receiverDoc.exists) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    const messageData = {
      senderId: userId,
      senderName: senderDoc.data().name,
      senderRole: role,
      receiverId,
      receiverName: receiverDoc.data().name,
      productId: productId || null,
      content: content.trim(),
      imageUrl: imageUrl || null,
      read: false,
      timestamp: new Date(),
    };

    const messageRef = await db.collection('messages').add(messageData);

    res.status(201).json({ 
      message: "Message sent successfully",
      messageId: messageRef.id,
      data: { id: messageRef.id, ...messageData }
    });
  } catch (err) {
    console.error("❌ Failed to send message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// =========================
// Get all received messages
// GET /api/messages/inbox
// =========================
exports.getInbox = async (req, res) => {
  const { userId } = req.user;

  try {
    const snapshot = await db.collection('messages')
      .where('receiverId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(messages);
  } catch (err) {
    console.error("❌ Error fetching inbox:", err);
    res.status(500).json({ error: "Failed to load inbox" });
  }
};

// =========================
// Get all sent messages
// GET /api/messages/sent
// =========================
exports.getSent = async (req, res) => {
  const { userId } = req.user;

  try {
    const snapshot = await db.collection('messages')
      .where('senderId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(messages);
  } catch (err) {
    console.error("❌ Error fetching sent messages:", err);
    res.status(500).json({ error: "Failed to load sent messages" });
  }
};

// =========================
// Get conversation with a specific user
// GET /api/messages/conversation/:userId
// =========================
exports.getConversation = async (req, res) => {
  const { userId: otherUserId } = req.params;
  const { userId } = req.user;

  try {
    const sentSnapshot = await db.collection('messages')
      .where('senderId', '==', userId)
      .where('receiverId', '==', otherUserId)
      .get();

    const receivedSnapshot = await db.collection('messages')
      .where('senderId', '==', otherUserId)
      .where('receiverId', '==', userId)
      .get();

    const messages = [
      ...sentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ...receivedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    ].sort((a, b) => a.timestamp - b.timestamp);

    res.json(messages);
  } catch (err) {
    console.error("❌ Error fetching conversation:", err);
    res.status(500).json({ error: "Failed to load conversation" });
  }
};

// =========================
// Get single message by ID
// GET /api/messages/:id
// =========================
exports.getMessageById = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const doc = await db.collection('messages').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Message not found" });
    }

    const data = doc.data();
    if (data.senderId !== userId && data.receiverId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ id: doc.id, ...data });
  } catch (err) {
    console.error("❌ Error fetching message:", err);
    res.status(500).json({ error: "Failed to load message" });
  }
};

// =========================
// Mark a message as read
// PATCH /api/messages/:id/read
// =========================
exports.markAsRead = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const doc = await db.collection('messages').doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: "Message not found" });

    const message = doc.data();
    if (message.receiverId !== userId) return res.status(403).json({ error: "Access denied" });

    await db.collection('messages').doc(id).update({ read: true, readAt: new Date() });
    res.json({ message: "Message marked as read" });
  } catch (err) {
    console.error("❌ Error marking message as read:", err);
    res.status(500).json({ error: "Failed to update message" });
  }
};

// =========================
// Delete a message
// DELETE /api/messages/:id
// =========================
exports.deleteMessage = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const doc = await db.collection('messages').doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: "Message not found" });

    const message = doc.data();
    if (message.senderId !== userId) return res.status(403).json({ error: "Only sender can delete messages" });

    await db.collection('messages').doc(id).delete();
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting message:", err);
    res.status(500).json({ error: "Failed to delete message" });
  }
};

// =========================
// Get unread message count
// GET /api/messages/unread/count
// =========================
exports.getUnreadCount = async (req, res) => {
  const { userId } = req.user;

  try {
    const snapshot = await db.collection('messages')
      .where('receiverId', '==', userId)
      .where('read', '==', false)
      .get();

    res.json({ count: snapshot.size });
  } catch (err) {
    console.error("❌ Error fetching unread count:", err);
    res.status(500).json({ error: "Failed to get unread count" });
  }
};

module.exports = {
  sendMessage: exports.sendMessage,
  getInbox: exports.getInbox,
  getSent: exports.getSent,
  getConversation: exports.getConversation,
  getMessageById: exports.getMessageById,
  markAsRead: exports.markAsRead,
  deleteMessage: exports.deleteMessage,
  getUnreadCount: exports.getUnreadCount
};
