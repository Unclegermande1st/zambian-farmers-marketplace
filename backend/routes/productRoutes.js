// backend/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticate = require("../middleware/authMiddleware");

// Public Route: Anyone can browse products (NO LOGIN REQUIRED)
router.get("/", productController.getAllProducts);

//  Protect the following routes
router.use(authenticate);

//Farmer: Create a product
router.post("/create", productController.createProduct);

// Farmer: View their own products
router.get("/my", productController.getMyProducts);

module.exports = router;