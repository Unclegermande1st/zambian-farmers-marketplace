// frontend/src/pages/Cart.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import { loadCart, clearCart } from "../utils/cartUtils";

export default function Cart() {
  const [cart, setCart] = useState(loadCart());
  const navigate = useNavigate();

  const handleUpdate = () => setCart(loadCart());

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (total === 0) return;
    navigate("/checkout");
  };

  return (
    <div className="container my-4">
      <h2>🛒 Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <CartItem key={item.id} item={item} onUpdateCart={handleUpdate} />
          ))}

          <div className="border-top pt-3">
            <h5>Total: K{total.toFixed(2)}</h5>
            <button
              className="btn btn-success mt-2"
              onClick={handleCheckout}
              disabled={total === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      <button
        className="btn btn-link"
        onClick={() => navigate("/marketplace")}
      >
        ← Continue Shopping
      </button>
    </div>
  );
}