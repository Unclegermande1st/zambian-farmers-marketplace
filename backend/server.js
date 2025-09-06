// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config(); // ← Important: load .env

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// ✅ Import your auth routes (only once!)
const authRoutes = require("./routes/authRoutes");

// ✅ Use API prefix for consistency
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Zambian Farmers Marketplace API is running 🚀");
});

// Import product routes
const productRoutes = require("./routes/productRoutes");

// Use product routes (protected)
app.use("/api/products", productRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`💡 API docs: http://localhost:${PORT}/api/auth/register (POST)`);
});

