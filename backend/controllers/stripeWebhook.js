import stripe from 'stripe';
import { buffer } from 'micro'; // required to read raw body for Stripe
import { Stripe } from 'stripe';

// Initialize Stripe (use your secret key from .env)
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export default async function stripeWebhook(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  // Read raw body (Stripe requires raw body for signature verification)
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripeClient.webhooks.constructEvent(
      buf.toString(),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('✅ Payment succeeded:', paymentIntent.id);
      // TODO: Update your database, send confirmation, etc.
      break;
    // Add other cases as needed (e.g., 'checkout.session.completed')
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 status to acknowledge receipt
  res.status(200).json({ received: true });
}