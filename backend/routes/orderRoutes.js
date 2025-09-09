// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authenticate = require("../middleware/authMiddleware");

// Protect all order routes
router.use(authenticate);

// Buyer: Place order
router.post("/create", orderController.createOrder);

// Buyer: View order history
router.get("/my", orderController.getMyOrders);

module.exports = router;