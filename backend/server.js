// backend/server.js
require('dotenv').config();
const app = require('./app');

// Optional: Stripe webhook can be added here later
// app.post('/api/webhook/stripe', stripeWebhook);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
