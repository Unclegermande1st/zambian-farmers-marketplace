// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authenticate = require("../middleware/authMiddleware");

// 🔒 Protected Routes: Require authentication

// Buyer: Place an order
router.post("/", authenticate("buyer"), orderController.createOrder);

// Buyer/Farmer: View their own order history
router.get("/my", authenticate(["buyer", "farmer"]), orderController.getMyOrders);

// Example: Admin-only route (if needed in future)
// router.get("/all", authenticate("admin"), orderController.getAllOrders);

module.exports = router;
