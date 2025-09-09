// frontend/src/components/CartItem.jsx
import { removeFromCart } from "../utils/cartUtils";

export default function CartItem({ item, onUpdateCart }) {
  const handleRemove = () => {
    removeFromCart(item.id);
    onUpdateCart();
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
      <div>
        <h6>{item.title}</h6>
        <p className="mb-1">K{item.price} × {item.quantity}</p>
        <strong>Total: K{(item.price * item.quantity).toFixed(2)}</strong>
      </div>
      <button className="btn btn-sm btn-outline-danger" onClick={handleRemove}>
        Remove
      </button>
    </div>
  );
}