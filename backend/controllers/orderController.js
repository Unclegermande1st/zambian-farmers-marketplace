// backend/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const Ledger = require('../models/Ledger');
const emailService = require('../utils/emailService');
const generateHash = require('../utils/hashGenerator');

/**
 * @desc Create a new order (Buyer initiates purchase)
 */
exports.createOrder = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { products, paymentId, totalAmount } = req.body;

    // Basic validation
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Order must include at least one product.' });
    }

    // Check stock for each product
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }
    }

    // Deduct stock from each product
    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Create order record
    const newOrder = await Order.create({
      buyer: buyerId,
      products,
      paymentId,
      totalAmount,
      status: 'pending',
      createdAt: new Date(),
    });

    // Generate blockchain-like ledger record
    const hash = generateHash(JSON.stringify(newOrder));
    await Ledger.create({
      orderId: newOrder._id,
      buyerId,
      hash,
      timestamp: new Date(),
    });

    // Send confirmation email to buyer
    try {
      const buyerEmail = req.user.email;
      await emailService.sendEmail(
        buyerEmail,
        'Order Confirmation - Zambian Farmers Marketplace',
        `Thank you for your order! Your order ID is ${newOrder._id}.`
      );
    } catch (err) {
      console.warn('⚠️ Email to buyer failed:', err.message);
    }

    res.status(201).json({
      message: '✅ Order placed successfully!',
      order: newOrder,
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ message: 'Server error while creating order.' });
  }
};

/**
 * @desc Get all orders for the logged-in user
 */
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let orders;
    if (role === 'farmer') {
      orders = await Order.find({ 'products.farmerId': userId }).populate('products.productId');
    } else {
      orders = await Order.find({ buyer: userId }).populate('products.productId');
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to retrieve orders.' });
  }
};

/**
 * @desc Get details of a specific order
 */
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;

    const order = await Order.findById(orderId).populate('products.productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Check access
    const isBuyer = order.buyer.toString() === userId;
    const isFarmer = order.products.some((p) => p.farmerId.toString() === userId);
    if (!isBuyer && !isFarmer && role !== 'admin') {
      return res.status(403).json({ message: 'Access denied to this order.' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order.' });
  }
};

/**
 * @desc Update order status (Farmer/Admin)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const role = req.user.role;

    if (!['shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update.' });
    }

    const order = await Order.findById(id).populate('buyer');
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (role === 'farmer' && order.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot modify a cancelled order.' });
    }

    order.status = status;
    await order.save();

    // Notify buyer
    try {
      await emailService.sendEmail(
        order.buyer.email,
        'Order Status Update',
        `Your order ${order._id} has been updated to: ${status}.`
      );
    } catch (err) {
      console.warn('⚠️ Failed to send buyer status update:', err.message);
    }

    res.status(200).json({ message: 'Order status updated successfully.', order });
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    res.status(500).json({ message: 'Server error updating order status.' });
  }
};

/**
 * @desc Cancel an order (Buyer only)
 */
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const buyerId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (order.buyer.toString() !== buyerId) {
      return res.status(403).json({ message: 'Unauthorized to cancel this order.' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled.' });
    }

    // Restore stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully.', order });
  } catch (error) {
    console.error('❌ Error cancelling order:', error);
    res.status(500).json({ message: 'Failed to cancel order.' });
  }
};

/**
 * @desc Get farmer statistics (sales overview)
 */
exports.getFarmerStats = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const orders = await Order.find({ 'products.farmerId': farmerId });
    const totalOrders = orders.length;
    const totalEarnings = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const delivered = orders.filter((o) => o.status === 'delivered').length;
    const pending = orders.filter((o) => o.status === 'pending').length;

    res.status(200).json({
      totalOrders,
      totalEarnings,
      delivered,
      pending,
    });
  } catch (error) {
    console.error('❌ Error fetching farmer stats:', error);
    res.status(500).json({ message: 'Failed to fetch farmer statistics.' });
  }
};
