// backend/controllers/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { db } = require('../firebase');
const authenticate = require('../middleware/authMiddleware');

// POST /api/checkout/create-session
exports.createCheckoutSession = async (req, res) => {
  const { cartItems } = req.body;
  const { userId, role } = req.user;

  if (role !== 'buyer') {
    return res.status(403).json({ error: 'Only buyers can checkout' });
  }

  try {
    // Fetch product data from Firestore for price validation
    const validItems = [];
    let totalAmount = 0;

    for (const item of cartItems) {
      const doc = await db.collection('products').doc(item.id).get();
      if (!doc.exists || doc.data().quantity < item.quantity) {
        return res.status(400).json({ error: `Product ${item.title} is out of stock or invalid` });
      }

      const product = { id: doc.id, ...doc.data() };
      const lineTotal = product.price * item.quantity;

      validItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            images: [product.imageUrl],
          },
          unit_amount: Math.round(product.price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      });

      totalAmount += lineTotal;
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      line_items: validItems,
      metadata: {
        userId,
        items: JSON.stringify(cartItems.map(i => ({ id: i.id, quantity: i.quantity })))
      }
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: "Failed to create payment session" });
  }
};

// POST /api/webhook/stripe
// Handle Stripe webhook (payment confirmation)
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const { userId, items } = session.metadata;
    const cartItems = JSON.parse(items);

    const totalAmount = session.amount_total / 100; // Convert cents to K

    try {
      // 1. Create Order
      const orderRef = await db.collection('orders').add({
        buyerId: userId,
        items: cartItems,
        totalAmount,
        status: 'paid',
        createdAt: new Date()
      });

      // 2. Deduct quantities from products
      const batch = db.batch();
      for (const item of cartItems) {
        const productRef = db.collection('products').doc(item.id);
        const productSnap = await productRef.get();
        const newQty = productSnap.data().quantity - item.quantity;
        batch.update(productRef, { quantity: newQty });
      }
      await batch.commit();

      // 3. Save Payment Record
      await db.collection('payments').add({
        orderId: orderRef.id,
        amount: totalAmount,
        paymentStatus: 'completed',
        transactionId: session.payment_intent,
        createdAt: new Date()
      });

      console.log(`✅ Order ${orderRef.id} saved and inventory updated`);
    } catch (err) {
      console.error("Failed to save order:", err);
    }
  }

  res.json({ received: true });
};