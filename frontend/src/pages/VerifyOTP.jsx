// frontend/src/pages/VerifyOTP.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get email saved during registration
  const email = localStorage.getItem("pendingEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Session expired. Please register again.");
      setTimeout(() => navigate("/register"), 1500);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      setMessage(res.data.message);
      localStorage.removeItem("pendingEmail"); // Clean up

      // Redirect to login
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-4">Verify Your Email</h3>
      <p>Enter the OTP sent to <strong>{email}</strong></p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="form-control"
            maxLength="6"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {message && (
          <div className={`alert mt-3 ${message.includes("failed") ? "alert-danger" : "alert-success"}`} role="alert">
            {message}
          </div>
        )}
      </form>

      <div className="mt-3 text-center">
        <small>
          Didn’t get the code? Check your email or re-register.
        </small>
      </div>
    </div>
  );
}