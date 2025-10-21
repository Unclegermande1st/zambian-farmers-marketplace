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
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="center">
          <h2 className="heading-lg" style={{ marginBottom: 12 }}>Your cart is empty</h2>
          <button onClick={() => navigate('/marketplace')} className="btn-solid">Go to Marketplace</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="checkout-wrap">
        <div className="row" style={{ marginBottom: 16 }}>
          <button onClick={() => navigate('/cart')} className="btn-outline-gray">← Back to Cart</button>
          <h1 className="heading-xl">Checkout</h1>
        </div>

        {/* Cart Summary */}
        <div className="section">
          <h2 className="heading-lg" style={{ marginBottom: 12 }}>Order Summary</h2>
          <div>
            {cart.map(item => (
              <div key={item.id} className="row" style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: 16, marginBottom: 16, alignItems: 'center' }}>
                <div style={{ width: 80, height: 80, background: '#e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="center muted" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="heading-lg" style={{ fontSize: 16 }}>{item.title}</h3>
                  <p className="small muted">${item.price}/kg</p>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="btn-outline-gray">-</button>
                  <span style={{ width: 48, textAlign: 'center', fontWeight: 700 }}>{item.quantity}kg</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="btn-outline-gray">+</button>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="heading-lg" style={{ fontSize: 16 }}>${(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.id)} className="btn-danger-link small">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '2px solid #f3f4f6' }}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="heading-lg" style={{ fontSize: 20 }}>Total:</span>
              <span className="heading-lg" style={{ color: '#10b981' }}>${calculateTotal()}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="section">
          <h2 className="heading-lg" style={{ marginBottom: 12 }}>Payment Method</h2>
          <div>
            <label className="row card-soft" style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="payment"
                value="stripe"
                checked={paymentMethod === 'stripe'}
                onChange={e => setPaymentMethod(e.target.value)}
                style={{ marginRight: 12 }}
              />
              <div style={{ flex: 1 }}>
                <div className="heading-lg" style={{ fontSize: 16 }}>💳 Credit/Debit Card (Stripe)</div>
                <div className="small muted">Secure payment via Stripe</div>
              </div>
            </label>

            <label className="row card-soft" style={{ cursor: 'pointer', marginTop: 12 }}>
              <input
                type="radio"
                name="payment"
                value="mock"
                checked={paymentMethod === 'mock'}
                onChange={e => setPaymentMethod(e.target.value)}
                style={{ marginRight: 12 }}
              />
              <div style={{ flex: 1 }}>
                <div className="heading-lg" style={{ fontSize: 16 }}>🧪 Mock Payment (Testing)</div>
                <div className="small muted">For testing purposes only</div>
              </div>
            </label>
          </div>
        </div>

        {/* Checkout Button */}
        <button onClick={handleCheckout} disabled={loading} className="btn-solid" style={{ width: '100%', padding: 16 }}>
          {loading ? 'Processing…' : `🔒 Proceed to ${paymentMethod === 'stripe' ? 'Stripe Checkout' : 'Place Order'}`}
        </button>

        <p className="center small muted" style={{ marginTop: 12 }}>
          🔐 Your payment information is secure and encrypted.
        </p>
      </div>
    </div>
  );
};

export default Checkout;
