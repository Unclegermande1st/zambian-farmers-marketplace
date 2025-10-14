// backend/controllers/adminController.js
const { db } = require("../firebase");

/**
 * GET /api/admin/stats
 * Get system-wide statistics
 */
exports.getSystemStats = async (req, res) => {
  try {
    const [usersSnap, productsSnap, ordersSnap, messagesSnap] = await Promise.all([
      db.collection("users").get(),
      db.collection("products").get(),
      db.collection("orders").get(),
      db.collection("messages").get()
    ]);

    const users = usersSnap.docs.map(doc => doc.data());
    const farmers = users.filter(u => u.role === "farmer").length;
    const buyers = users.filter(u => u.role === "buyer").length;
    const admins = users.filter(u => u.role === "admin").length;
    const verified = users.filter(u => u.verification_status === "verified").length;
    const pending = users.filter(u => u.verification_status === "pending").length;

    res.json({
      totalUsers: usersSnap.size,
      farmers,
      buyers,
      admins,
      verified,
      pending,
      totalProducts: productsSnap.size,
      totalOrders: ordersSnap.size,
      totalMessages: messagesSnap.size,
      timestamp: new Date()
    });
  } catch (err) {
    console.error("❌ Error fetching system stats:", err);
    res.status(500).json({ error: "Failed to fetch system stats" });
  }
};

/**
 * GET /api/admin/users
 * Get all users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const snapshot = await db.collection("users")
      .orderBy("created_at", "desc")
      .get();

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      password: undefined // hide password
    }));

    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

/**
 * GET /api/admin/users/:id
 * Get a single user by ID
 */
exports.getUserById = async (req, res) => {
  try {
    const doc = await db.collection("users").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "User not found" });

    const user = { id: doc.id, ...doc.data(), password: undefined };
    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

/**
 * PATCH /api/admin/users/:id/status
 * Update user account status (active, suspended, banned)
 */
exports.updateUserStatus = async (req, res) => {
  const { status } = req.body;

  if (!status) return res.status(400).json({ error: "Status is required" });

  try {
    await db.collection("users").doc(req.params.id).update({
      account_status: status,
      updated_at: new Date()
    });

    res.json({ message: "User status updated successfully" });
  } catch (err) {
    console.error("❌ Error updating user status:", err);
    res.status(500).json({ error: "Failed to update user status" });
  }
};

/**
 * DELETE /api/admin/user/:userId
 * Soft delete (deactivate) user
 */
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    await db.collection("users").doc(userId).update({
      deleted: true,
      deleted_at: new Date()
    });

    res.json({ message: "User deactivated successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

/**
 * GET /api/admin/verifications
 * Get all pending verification requests
 */
exports.getVerificationRequests = async (req, res) => {
  try {
    const snapshot = await db.collection("users")
      .where("verification_status", "==", "pending")
      .orderBy("updated_at", "desc")
      .get();

    const requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(requests);
  } catch (err) {
    console.error("❌ Error fetching verification requests:", err);
    res.status(500).json({ error: "Failed to fetch verification requests" });
  }
};

/**
 * POST /api/admin/approve-verification
 */
exports.approveVerification = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  try {
    await db.collection("users").doc(userId).update({
      verification_status: "verified",
      verified_at: new Date()
    });

    res.json({ message: "User verified successfully", userId });
  } catch (err) {
    console.error("❌ Error approving verification:", err);
    res.status(500).json({ error: "Failed to approve verification" });
  }
};

/**
 * POST /api/admin/reject-verification
 */
exports.rejectVerification = async (req, res) => {
  const { userId, reason } = req.body;
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  try {
    await db.collection("users").doc(userId).update({
      verification_status: "rejected",
      rejection_reason: reason || "Not specified",
      rejected_at: new Date()
    });

    res.json({ message: "Verification rejected", userId });
  } catch (err) {
    console.error("❌ Error rejecting verification:", err);
    res.status(500).json({ error: "Failed to reject verification" });
  }
};

/**
 * GET /api/admin/orders
 * ✅ Fixed version
 */
exports.getAllOrders = async (req, res) => {
  try {
    const snapshot = await db.collection("orders")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const orders = [];
    for (const doc of snapshot.docs) {
      const orderData = doc.data();

      // Fetch buyer info
      const buyerDoc = await db.collection("users").doc(orderData.buyerId).get();
      const buyerName = buyerDoc.exists ? buyerDoc.data().name : "Unknown";

      // Map products correctly
      orders.push({
        id: doc.id,
        customerName: buyerName,
        productName: orderData.products?.map(p => p.title).join(", ") || "N/A",
        quantity: orderData.products?.reduce((sum, p) => sum + p.quantity, 0) || 0,
        totalPrice: orderData.total || 0,
        createdAt: orderData.createdAt
      });
    }

    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

/**
 * GET /api/admin/products
 */
exports.getAllProducts = async (req, res) => {
  try {
    const snapshot = await db.collection("products")
      .orderBy("createdAt", "desc")
      .get();

    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
