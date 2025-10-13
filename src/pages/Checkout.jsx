import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get cart from localStorage (you'll implement cart context later)
  const [cart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        products: cart,
        total: calculateTotal()
      };

      const res = await orderAPI.create(orderData);
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // Redirect to success page
      navigate('/payment-success', { 
        state: { orderId: res.data.orderId, transactionHash: res.data.transactionHash } 
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
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Cart Items */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">
                    ${item.price} × {item.quantity}
                  </p>
                </div>
                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
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
          className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;