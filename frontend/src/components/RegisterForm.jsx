// frontend/src/components/RegisterForm.jsx
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "farmer",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);

      // ✅ Save email for OTP verification
      localStorage.setItem("pendingEmail", formData.email);
      setMessage(res.data.message);

      // Redirect to OTP verification
      setTimeout(() => navigate("/verify-otp"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Create Account</h2>

      <div style={inputGroupStyle}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>

      <div style={inputGroupStyle}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>

      <div style={inputGroupStyle}>
        <input
          type="tel"
          name="phone"
          placeholder="Phone (e.g., +260776117000)"
          value={formData.phone}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>

      <div style={inputGroupStyle}>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>

      <div style={inputGroupStyle}>
        <label htmlFor="role" style={{ display: "block", marginBottom: "6px" }}>
          I am a:
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="farmer">Farmer</option>
          <option value="buyer">Buyer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? "Registering..." : "Register"}
      </button>

      {message && <p style={messageStyle(message)}>{message}</p>}
    </form>
  );
}

// Reusable inline styles
const inputGroupStyle = { marginBottom: "15px" };
const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "16px",
};
const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
};
const messageStyle = (msg) => ({
  marginTop: "10px",
  color: msg.includes("failed") || msg.includes("error") ? "red" : "green",
  textAlign: "center",
});