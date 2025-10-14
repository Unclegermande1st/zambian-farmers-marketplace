const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticate = require("../middleware/authMiddleware");

// 🔓 Public Routes: No authentication required

// Browse all available products
router.get("/", productController.getAllProducts);

// View a single product by ID
router.get("/:id", productController.getById);

// 🔒 Protected Routes: Require farmer authentication

// Farmer: Create a new product
router.post("/create", authenticate("farmer"), productController.createProduct);

// Farmer: View their own listed products
router.get("/my", authenticate("farmer"), productController.getMyProducts);

// Farmer: Update their product
router.put("/:id", authenticate("farmer"), productController.update);

// Farmer: Delete their product (soft delete)
router.delete("/:id", authenticate("farmer"), productController.delete);

// Example: Admin-only route placeholder (future use)
// router.get("/admin-dashboard", authenticate("admin"), productController.adminDashboard);

module.exports = router;
