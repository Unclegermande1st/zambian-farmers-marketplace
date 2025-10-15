// backend/controllers/orderController.js
const { db } = require('../firebase');
const { sendEmail, emailTemplates } = require('../services/emailService');
const { hashTransaction, logToLedger } = require('../services/ledgerService');

/**
 * @desc Create a new order (Buyer initiates purchase)
 * POST /api/orders
 */
exports.createOrder = async (req, res) => {
  try {
    const { userId, role, email } = req.user;
    const { products, total } = req.body;

    // Validation
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Order must include at least one product.' });
    }

    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Invalid order total' });
    }

    // Check stock for each product and update in batch
    const batch = db.batch();
    const productChecks = [];

    for (const item of products) {
      const productRef = db.collection('products').doc(item.id);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        return res.status(404).json({ error: `Product not found: ${item.title}` });
      }

      const productData = productDoc.data();
      if (productData.quantity < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${item.title}. Available: ${productData.quantity}kg`,
        });
      }

      // Queue stock deduction
      batch.update(productRef, {
        quantity: productData.quantity - item.quantity,
        updatedAt: new Date()
      });

      productChecks.push({ ...item, farmerName: productData.farmerName });
    }

    // Commit stock updates
    await batch.commit();

    // Create order record
    const orderData = {
      buyerId: userId,
      products,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const orderRef = await db.collection('orders').add(orderData);
    const orderId = orderRef.id;

    // Generate blockchain-like ledger record
    const transactionData = {
      orderId,
      buyerId: userId,
      products,
      total,
      timestamp: new Date().toISOString()
    };
    const hash = hashTransaction(transactionData);
    await logToLedger(orderId, hash);

    // Send confirmation email to buyer
    try {
      const buyerDoc = await db.collection('users').doc(userId).get();
      const buyer = buyerDoc.data();
      
      await sendEmail(
        email,
        emailTemplates.orderConfirmation({ id: orderId, ...orderData }, buyer, products)
      );

      // Notify farmers
      const farmerIds = [...new Set(products.map(p => p.farmerId))];
      for (const farmerId of farmerIds) {
        const farmerDoc = await db.collection('users').doc(farmerId).get();
        if (farmerDoc.exists) {
          const farmer = farmerDoc.data();
          const farmerProducts = products.filter(p => p.farmerId === farmerId);
          await sendEmail(
            farmer.email,
            emailTemplates.newOrderNotification({ id: orderId, ...orderData }, farmer, buyer, farmerProducts)
          );
        }
      }
    } catch (emailErr) {
      console.warn('⚠️ Email notification failed:', emailErr.message);
    }

    res.status(201).json({
      message: '✅ Order placed successfully!',
      orderId,
      transactionHash: hash
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order: ' + error.message });
  }
};

/**
 * @desc Get all orders for the logged-in user
 * GET /api/orders/my
 */
exports.getMyOrders = async (req, res) => {
  try {
    const { userId, role } = req.user;

    let ordersSnapshot;
    
    if (role === 'farmer') {
      // Get orders containing farmer's products
      const allOrdersSnap = await db.collection('orders')
        .orderBy('createdAt', 'desc')
        .get();
      
      const orders = [];
      for (const doc of allOrdersSnap.docs) {
        const orderData = doc.data();
        const hasFarmerProduct = orderData.products.some(p => p.farmerId === userId);
        
        if (hasFarmerProduct) {
          orders.push({
            id: doc.id,
            ...orderData
          });
        }
      }
      
      return res.json(orders);
    } else {
      // Buyer: Get their orders
      ordersSnapshot = await db.collection('orders')
        .where('buyerId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return res.json(orders);
    }
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
};

/**
 * @desc Get details of a specific order
 * GET /api/orders/:id
 */
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { userId, role } = req.user;

    const orderDoc = await db.collection('orders').doc(orderId).get();
    
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const order = { id: orderDoc.id, ...orderDoc.data() };

    // Check access
    const isBuyer = order.buyerId === userId;
    const isFarmer = order.products.some(p => p.farmerId === userId);
    
    if (!isBuyer && !isFarmer && role !== 'admin') {
      return res.status(403).json({ error: 'Access denied to this order.' });
    }

    res.json(order);
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
};

/**
 * @desc Update order status (Farmer/Admin)
 * PATCH /api/orders/:id/status
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const { role, userId } = req.user;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status update.' });
    }

    const orderRef = db.collection('orders').doc(id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const order = orderDoc.data();

    // Check if user is authorized (farmer must own at least one product in order)
    if (role === 'farmer') {
      const hasFarmerProduct = order.products.some(p => p.farmerId === userId);
      if (!hasFarmerProduct) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot modify a cancelled order.' });
    }

    await orderRef.update({
      status,
      updatedAt: new Date()
    });

    // Notify buyer
    try {
      const buyerDoc = await db.collection('users').doc(order.buyerId).get();
      if (buyerDoc.exists) {
        const buyer = buyerDoc.data();
        await sendEmail(
          buyer.email,
          emailTemplates.orderStatusUpdate({ id, ...order }, buyer, status)
        );
      }
    } catch (emailErr) {
      console.warn('⚠️ Failed to send buyer status update:', emailErr.message);
    }

    res.json({ message: 'Order status updated successfully.', status });
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
};

/**
 * @desc Cancel an order (Buyer only)
 * POST /api/orders/:id/cancel
 */
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { userId } = req.user;

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const order = orderDoc.data();

    if (order.buyerId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to cancel this order.' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending orders can be cancelled.' });
    }

    // Restore stock
    const batch = db.batch();
    for (const item of order.products) {
      const productRef = db.collection('products').doc(item.id);
      const productDoc = await productRef.get();
      
      if (productDoc.exists) {
        batch.update(productRef, {
          quantity: productDoc.data().quantity + item.quantity,
          updatedAt: new Date()
        });
      }
    }
    await batch.commit();

    // Update order status
    await orderRef.update({
      status: 'cancelled',
      updatedAt: new Date()
    });

    res.json({ message: 'Order cancelled successfully.' });
  } catch (error) {
    console.error('❌ Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order.' });
  }
};

/**
 * @desc Get farmer statistics (sales overview)
 * GET /api/orders/farmer/stats
 */
exports.getFarmerStats = async (req, res) => {
  try {
    const { userId } = req.user;

    const allOrdersSnap = await db.collection('orders').get();
    
    let totalOrders = 0;
    let totalEarnings = 0;
    let delivered = 0;
    let pending = 0;

    for (const doc of allOrdersSnap.docs) {
      const order = doc.data();
      const farmerProducts = order.products.filter(p => p.farmerId === userId);
      
      if (farmerProducts.length > 0) {
        totalOrders++;
        const orderTotal = farmerProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        totalEarnings += orderTotal;
        
        if (order.status === 'delivered') delivered++;
        if (order.status === 'pending') pending++;
      }
    }

    res.json({
      totalOrders,
      totalEarnings: totalEarnings.toFixed(2),
      delivered,
      pending,
    });
  } catch (error) {
    console.error('❌ Error fetching farmer stats:', error);
    res.status(500).json({ error: 'Failed to fetch farmer statistics.' });
  }
};