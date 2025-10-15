// backend/controllers/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { db } = require('../firebase');
const { sendEmail, emailTemplates } = require('../services/emailService');
const { hashTransaction, logToLedger } = require('../services/ledgerService');

// POST /api/payments/create-session
exports.createCheckoutSession = async (req, res) => {
  const { cartItems } = req.body;
  const { userId, role, email } = req.user;

  if (role !== 'buyer') {
    return res.status(403).json({ error: 'Only buyers can checkout' });
  }

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try {
    // Validate products and stock
    const lineItems = [];
    let totalAmount = 0;

    for (const item of cartItems) {
      const productDoc = await db.collection('products').doc(item.id).get();
      if (!productDoc.exists) {
        return res.status(400).json({ error: `Product "${item.title}" not found` });
      }

      const product = productDoc.data();
      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for "${product.title}". Available: ${product.quantity}kg` 
        });
      }

      const lineTotal = product.price * item.quantity;
      totalAmount += lineTotal;

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            description: `${product.category || 'Product'} - ${product.description || ''}`,
            images: product.imageUrl ? [product.imageUrl] : [],
          },
          unit_amount: Math.round(product.price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      line_items: lineItems,
      customer_email: email,
      metadata: {
        userId,
        cartItems: JSON.stringify(cartItems.map(i => ({
          id: i.id,
          quantity: i.quantity,
          farmerId: i.farmerId,
          title: i.title,
          price: i.price
        })))
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('❌ Error creating checkout session:', err);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
};

// POST /api/payments/webhook
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await handleSuccessfulPayment(session);
  }

  res.json({ received: true });
};

// Handle successful payment
async function handleSuccessfulPayment(session) {
  try {
    const { userId, cartItems } = session.metadata;
    const items = JSON.parse(cartItems);
    const totalAmount = session.amount_total / 100;

    // 1. Create order
    const orderData = {
      buyerId: userId,
      products: items,
      total: totalAmount,
      status: 'paid',
      paymentStatus: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const orderRef = await db.collection('orders').add(orderData);
    const orderId = orderRef.id;

    // 2. Update product quantities in batch
    const batch = db.batch();
    for (const item of items) {
      const productRef = db.collection('products').doc(item.id);
      const productDoc = await productRef.get();
      if (productDoc.exists) {
        batch.update(productRef, {
          quantity: productDoc.data().quantity - item.quantity,
          updatedAt: new Date()
        });
      }
    }
    await batch.commit();

    // 3. Save payment record
    await db.collection('payments').add({
      orderId,
      userId,
      amount: totalAmount,
      paymentStatus: 'completed',
      transactionId: session.payment_intent,
      sessionId: session.id,
      createdAt: new Date()
    });

    // 4. Ledger logging
    const transactionData = {
      orderId,
      buyerId: userId,
      products: items,
      total: totalAmount,
      timestamp: new Date().toISOString()
    };
    const currentHash = hashTransaction(transactionData);
    await logToLedger(orderId, currentHash);

    // 5. Send confirmation emails
    try {
      const buyerDoc = await db.collection('users').doc(userId).get();
      if (buyerDoc.exists) {
        const buyer = buyerDoc.data();

        // Buyer emails
        await sendEmail(
          buyer.email,
          emailTemplates.orderConfirmation({ id: orderId, ...orderData }, buyer, items)
        );
        await sendEmail(
          buyer.email,
          emailTemplates.paymentConfirmation({ orderId, amount: totalAmount }, { id: orderId, ...orderData }, buyer)
        );

        // Farmer notifications
        const farmerIds = [...new Set(items.map(p => p.farmerId))];
        for (const farmerId of farmerIds) {
          const farmerDoc = await db.collection('users').doc(farmerId).get();
          if (farmerDoc.exists) {
            const farmer = farmerDoc.data();
            const farmerProducts = items.filter(p => p.farmerId === farmerId);
            await sendEmail(
              farmer.email,
              emailTemplates.newOrderNotification({ id: orderId, ...orderData }, farmer, buyer, farmerProducts)
            );
          }
        }
      }
    } catch (emailError) {
      console.error('❌ Failed to send payment emails:', emailError);
    }

    console.log(`✅ Order ${orderId} processed successfully`);
  } catch (err) {
    console.error('❌ Failed to process successful payment:', err);
  }
}

// GET /api/payments/verify-session/:sessionId
exports.verifySession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      res.json({
        status: 'success',
        amount: session.amount_total / 100,
        customerEmail: session.customer_email
      });
    } else {
      res.json({
        status: 'pending',
        message: 'Payment is still processing'
      });
    }
  } catch (err) {
    console.error('❌ Failed to verify session:', err);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

module.exports = {
  createCheckoutSession: exports.createCheckoutSession,
  stripeWebhook: exports.stripeWebhook,
  verifySession: exports.verifySession
};
