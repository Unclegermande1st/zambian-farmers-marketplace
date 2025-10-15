import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { orderAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // stripe | mock
  const navigate = useNavigate();
  const { cart, clearCart, getCartTotal, updateQuantity, removeFromCart } = useCart();
  const toast = useToast();

  const calculateTotal = () => getCartTotal().toFixed(2);

  // --- Stripe Checkout Flow ---
  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/payments/create-session`,
        { cartItems: cart },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Redirect to Stripe
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to create checkout session');
      setLoading(false);
    }
  };

  // --- Mock Checkout Flow (for testing) ---
  const handleMockCheckout = async () => {
    setLoading(true);
    try {
      const orderData = {
        products: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          farmerId: item.farmerId
        })),
        total: getCartTotal()
      };
      const res = await orderAPI.create(orderData);

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/payment-success', {
        state: {
          mock: true,
          orderId: res.data.orderId,
          transactionHash: res.data.transactionHash
        }
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    paymentMethod === 'stripe' ? handleStripeCheckout() : handleMockCheckout();
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
          <button onClick={() => navigate('/cart')} className="text-green-600 hover:text-green-700">
            ← Back to Cart
          </button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* Cart Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">📦</div>
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
                  <span className="w-12 text-center font-semibold">{item.quantity}kg</span>
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

        {/* Payment Method Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="stripe"
                checked={paymentMethod === 'stripe'}
                onChange={e => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <div className="flex-1">
                <div className="font-semibold">💳 Credit/Debit Card (Stripe)</div>
                <div className="text-sm text-gray-600">Secure payment via Stripe</div>
              </div>
            </label>

            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="mock"
                checked={paymentMethod === 'mock'}
                onChange={e => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <div className="flex-1">
                <div className="font-semibold">🧪 Mock Payment (Testing)</div>
                <div className="text-sm text-gray-600">For testing purposes only</div>
              </div>
            </label>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>🔒 Proceed to {paymentMethod === 'stripe' ? 'Stripe Checkout' : 'Place Order'}</>
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          🔐 Your payment information is secure and encrypted.
        </p>
      </div>
    </div>
  );
};

export default Checkout;
