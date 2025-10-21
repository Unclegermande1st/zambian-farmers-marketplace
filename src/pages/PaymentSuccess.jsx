// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [verifying, setVerifying] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // If mock payment (e.g., from a test checkout)
    if (location.state?.mock) {
      setVerifying(false);
      clearCart();
      setTimeout(() => navigate("/marketplace"), 5000);
      return;
    }

    // If real Stripe session, verify
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      setVerifying(false);
    }
  }, [sessionId, location.state]);

  const verifyPayment = async (sessionId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/payments/verify-session/${sessionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPaymentDetails(res.data);
      clearCart();
      setVerifying(false);
      setTimeout(() => navigate("/marketplace"), 5000);
    } catch (err) {
      console.error("Payment verification failed:", err);
      setVerifying(false);
      setTimeout(() => navigate("/marketplace"), 5000);
    }
  };

  if (verifying) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="center">
          <div className="success-icon" style={{ width: 64, height: 64, marginBottom: 16 }}></div>
          <p className="heading-lg muted">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="success-bg">
      <div className="container-lg">
        <div className="success-card">
          <div className="success-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
          </div>

          {/* Success Message */}
          <h1 className="heading-xl" style={{ marginBottom: 8, color: '#1f2937' }}>Payment Successful!</h1>
          <p className="muted" style={{ marginBottom: 20 }}>
            Thank you for your order. Your payment has been processed successfully.
          </p>

          {/* Payment Details (optional) */}
          {paymentDetails && (
            <div className="section" style={{ textAlign: 'left', marginBottom: 16 }}>
              <h3 className="heading-lg" style={{ fontSize: 16, marginBottom: 8 }}>Payment Details:</h3>
              <div className="small muted">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span>Amount Paid:</span>
                  <span className="heading-lg" style={{ fontSize: 14 }}>${paymentDetails.amount}</span>
                </div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span>Status:</span>
                  <span style={{ color: '#059669', fontWeight: 700, textTransform: 'capitalize' }}>{paymentDetails.status}</span>
                </div>
                {paymentDetails.customerEmail && (
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <span>Receipt sent to:</span>
                    <span className="heading-lg" style={{ fontSize: 14 }}>{paymentDetails.customerEmail}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Optional: Order or Transaction Info */}
          {location.state?.orderId && (
            <div className="section" style={{ marginBottom: 16 }}>
              <p className="small muted">Order ID:</p>
              <p className="mono small" style={{ color: '#374151', wordBreak: 'break-all' }}>{location.state.orderId}</p>
            </div>
          )}

          {location.state?.transactionHash && (
            <div className="section" style={{ marginBottom: 16 }}>
              <p className="small muted" style={{ marginBottom: 4 }}>Transaction Hash:</p>
              <p className="mono small" style={{ color: '#374151', wordBreak: 'break-all' }}>{location.state.transactionHash}</p>
              <p className="small muted" style={{ marginTop: 8 }}>
                Your transaction is secured on our ledger.
              </p>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => navigate("/marketplace")} className="btn-solid">Continue Shopping</button>
            <button onClick={() => navigate("/dashboard")} className="btn-outline-gray">View My Orders</button>
          </div>

          <p className="small muted" style={{ marginTop: 16 }}>
            Redirecting to marketplace in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
