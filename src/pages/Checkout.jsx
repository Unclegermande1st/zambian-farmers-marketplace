import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { cart, clearCart, getCartTotal, updateQuantity, removeFromCart } = useCart();

  const calculateTotal = () => getCartTotal().toFixed(2); // ✅ Updated

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        products: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        total: getCartTotal()
      };

      const res = await orderAPI.create(orderData);

      // ✅ Clear cart on successful checkout
      clearCart();

      // Redirect to success page
      navigate('/payment-success', { 
        state: { 
          orderId: res.data.orderId, 
          transactionHash: res.data.transactionHash 
        } 
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/marketplace')}
            className="text-green-600 hover:text-green-700"
          >
            ← Back to Marketplace
          </button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Cart Items */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No img
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">${item.price}/kg</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">
                    {item.quantity}kg
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-green-600">${calculateTotal()}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
