// backend/controllers/orderController.js
const { db } = require("../firebase");
const authenticate = require('../middleware/authMiddleware');
const { hashTransaction, logToLedger } = require('../services/ledgerService');

// POST /api/orders
exports.createOrder = async (req, res) => {
  const { products, total } = req.body;
  const { userId } = req.user;

  // Validate
  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "Products are required" });
  }

  try {
    // Save order
    const orderRef = await db.collection('orders').add({
      buyerId: userId,
      products: products.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        quantity: p.quantity
      })),
      total,
      status: "pending",
      createdAt: new Date(),
    });

    // Generate hash
    const orderData = {
      orderId: orderRef.id,
      buyerId: userId,
      products,
      total,
      timestamp: new Date().toISOString()
    };
    const currentHash = hashTransaction(orderData);

    // Log to ledger
    await logToLedger(orderRef.id, currentHash);

    res.status(201).json({
      message: "Order placed successfully!",
      orderId: orderRef.id,
      transactionHash: currentHash
    });
  } catch (err) {
    console.error("Failed to create order:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
};

// GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  const { userId } = req.user;

  try {
    const snapshot = await db.collection('orders')
      .where('buyerId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};