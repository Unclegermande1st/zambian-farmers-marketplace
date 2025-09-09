// frontend/src/pages/Checkout.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loadCart, clearCart } from "../utils/cartUtils";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const cart = loadCart();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async () => {
    if (total === 0) return;

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/orders/create",
        { products: cart, total },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
      clearCart();
      setTimeout(() => navigate("/order-history"), 1500);
    } catch (err) {
      setMessage("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2>💳 Checkout</h2>

      <div className="card mb-4">
        <div className="card-body">
          {cart.map(item => (
            <p key={item.id}>
              {item.title} × {item.quantity} = K{(item.price * item.quantity).toFixed(2)}
            </p>
          ))}
          <h5>Total: K{total.toFixed(2)}</h5>
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>

      {message && (
        <p className={`mt-3 ${message.includes("success") ? "text-success" : "text-danger"}`}>
          {message}
        </p>
      )}
    </div>
  );
}