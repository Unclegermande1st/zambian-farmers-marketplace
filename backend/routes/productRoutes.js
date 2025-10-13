// backend/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticate = require("../middleware/authMiddleware");

// 🔓 Public Route: Anyone can browse products (NO LOGIN REQUIRED)
router.get("/", productController.getAllProducts);

// 🔒 Protected Routes: Require authentication

// Farmer: Create a product
router.post("/create", authenticate("farmer"), productController.createProduct);

// Farmer: View their own products
router.get("/my", authenticate("farmer"), productController.getMyProducts);

// Example: Admin-only route (if needed in future)
// router.get("/admin-dashboard", authenticate("admin"), productController.adminDashboard);

module.exports = router;
