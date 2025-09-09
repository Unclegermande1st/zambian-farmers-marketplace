// backend/controllers/productController.js
const { db } = require("../firebase");

// POST /api/products/create
exports.createProduct = async (req, res) => {
  const { title, category, description, quantity, price } = req.body;
  const { userId } = req.user; // from JWT

  // Validate required fields
  if (!title || !category || !quantity || !price) {
    return res.status(400).json({
      error: "Title, category, quantity, and price are required"
    });
  }

  try {
    const productData = {
      farmerId: userId,
      title,
      category,
      description: description || "",
      quantity: Number(quantity),
      price: Number(price),
      imageUrl: req.body.imageUrl || "",
      createdAt: new Date(),
      status: "available",
    };

    const docRef = await db.collection("products").add(productData);

    res.status(201).json({
      message: "Product listed successfully",
      productId: docRef.id,
      ...productData,
    });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Failed to list product: " + err.message });
  }
};

// GET /api/products/my
// Farmer: View their own listed products
exports.getMyProducts = async (req, res) => {
  const { userId } = req.user;

  try {
    const snapshot = await db.collection("products")
      .where("farmerId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(products);
  } catch (err) {
    console.error("Error fetching my products:", err);
    res.status(500).json({ error: "Failed to fetch your products" });
  }
};

// GET /api/products
// 🔓 Public Route: Anyone (buyers) can browse all available products
exports.getAllProducts = async (req, res) => {
  try {
    const snapshot = await db.collection("products")
      .where("status", "==", "available")
      .orderBy("createdAt", "desc")
      .get();

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(products);
  } catch (err) {
    console.error("Error fetching all products:", err);
    res.status(500).json({ error: "Failed to load products" });
  }
};