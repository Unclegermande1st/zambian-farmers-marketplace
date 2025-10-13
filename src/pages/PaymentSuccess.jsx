// frontend/src/pages/PaymentSuccess.jsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId) {
      alert("✅ Payment successful! Your order is confirmed.");
      localStorage.removeItem("cart"); // Clear cart
    }
    const timer = setTimeout(() => navigate("/marketplace"), 3000);
    return () => clearTimeout(timer);
  }, [sessionId, navigate]);

  return (
    <div className="container text-center my-5">
      <h2>🎉 Thank You!</h2>
      <p>Your payment was successful.</p>
      <p>Redirecting...</p>
    </div>
  );
}