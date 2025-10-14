import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Go to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b py-4 last:border-b-0">
              <div className="flex items-center gap-4 flex-1">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">${item.price} each</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <div className="w-24 text-right font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-700 ml-4"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center text-xl font-bold mb-4">
            <span>Total:</span>
            <span className="text-green-600">${getCartTotal().toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;