// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authenticate = require("../middleware/authMiddleware");

// 🔒 All routes require authentication

// 🛒 Buyer: Place a new order
router.post("/", authenticate("buyer"), orderController.createOrder);

// 📦 Buyer/Farmer: View their own orders
router.get("/my", authenticate(["buyer", "farmer"]), orderController.getMyOrders);

// 📄 View details of a specific order (buyer, farmer, or admin)
router.get("/:id", authenticate(), orderController.getOrderById);

// 🚚 Farmer: Update order status (e.g., shipped, delivered)
router.patch("/:id/status", authenticate("farmer"), orderController.updateOrderStatus);

// ❌ Buyer: Cancel their order (if still pending)
router.post("/:id/cancel", authenticate("buyer"), orderController.cancelOrder);

// 📊 Farmer: Get sales statistics and performance metrics
router.get("/farmer/stats", authenticate("farmer"), orderController.getFarmerStats);

// 🛠️ (Optional future feature)
// router.get("/all", authenticate("admin"), orderController.getAllOrders);

module.exports = router;
