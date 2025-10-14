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
      console.error("❌ Payment verification failed:", err);
      setVerifying(false);
      setTimeout(() => navigate("/marketplace"), 5000);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* ✅ Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          {/* ✅ Success Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. Your payment has been processed successfully.
          </p>

          {/* ✅ Payment Details (optional) */}
          {paymentDetails && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2">Payment Details:</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="font-semibold">${paymentDetails.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-green-600 font-semibold capitalize">
                    {paymentDetails.status}
                  </span>
                </div>
                {paymentDetails.customerEmail && (
                  <div className="flex justify-between">
                    <span>Receipt sent to:</span>
                    <span className="font-semibold">
                      {paymentDetails.customerEmail}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ✅ Optional: Order or Transaction Info */}
          {location.state?.orderId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Order ID:</p>
              <p className="font-mono text-sm text-gray-800 break-all">
                {location.state.orderId}
              </p>
            </div>
          )}

          {location.state?.transactionHash && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">🔐 Transaction Hash:</p>
              <p className="font-mono text-xs text-gray-700 break-all">
                {location.state.transactionHash}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Your transaction is secured on our ledger.
              </p>
            </div>
          )}

          {/* ✅ Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/marketplace")}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              View My Orders
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Redirecting to marketplace in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
