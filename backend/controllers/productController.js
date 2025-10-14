// backend/controllers/productController.js
const { db } = require("../firebase");

// 🟩 CREATE a new product (POST /api/products/create)
exports.createProduct = async (req, res) => {
  const { title, category, description, quantity, price, imageUrl } = req.body;
  const { userId } = req.user;

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
      imageUrl: imageUrl || "",
      createdAt: new Date(),
      status: "available",
    };

    const docRef = await db.collection("products").add(productData);

    res.status(201).json({
      message: "✅ Product listed successfully",
      productId: docRef.id,
      ...productData,
    });
  } catch (err) {
    console.error("❌ Error creating product:", err);
    res.status(500).json({ error: "Failed to list product: " + err.message });
  }
};

// 🟦 GET all available products (GET /api/products)
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
    console.error("❌ Error fetching all products:", err);
    res.status(500).json({ error: "Failed to load products" });
  }
};

// 🟨 GET products created by the logged-in farmer (GET /api/products/my)
exports.getMyProducts = async (req, res) => {
  const { userId } = req.user;

  try {
    const snapshot = await db.collection("products")
      .where("farmerId", "==", userId)
      .where("status", "==", "available")
      .orderBy("createdAt", "desc")
      .get();

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching my products:", err);
    res.status(500).json({ error: "Failed to fetch your products" });
  }
};

// 🟧 GET a single product by ID (GET /api/products/:id)
exports.getById = async (req, res) => {
  try {
    const doc = await db.collection("products").doc(req.params.id).get();

    if (!doc.exists || doc.data().status === "deleted") {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// 🟥 UPDATE product (PATCH /api/products/:id)
exports.update = async (req, res) => {
  const { userId } = req.user;
  const { title, category, description, quantity, price, imageUrl } = req.body;

  try {
    const docRef = db.collection("products").doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists || doc.data().status === "deleted") {
      return res.status(404).json({ error: "Product not found" });
    }

    if (doc.data().farmerId !== userId) {
      return res.status(403).json({ error: "You can only update your own products" });
    }

    const updates = { updatedAt: new Date() };
    if (title) updates.title = title;
    if (category) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (quantity !== undefined) updates.quantity = Number(quantity);
    if (price !== undefined) updates.price = Number(price);
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;

    await docRef.update(updates);

    res.json({ message: "✅ Product updated successfully", productId: req.params.id });
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// 🟪 DELETE product (soft delete) (DELETE /api/products/:id)
exports.delete = async (req, res) => {
  const { userId } = req.user;

  try {
    const docRef = db.collection("products").doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (doc.data().farmerId !== userId) {
      return res.status(403).json({ error: "You can only delete your own products" });
    }

    await docRef.update({
      status: "deleted",
      deletedAt: new Date(),
    });

    res.json({ message: "🗑️ Product deleted successfully", productId: req.params.id });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
