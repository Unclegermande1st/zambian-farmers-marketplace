// frontend/src/components/LoginForm.jsx
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // ✅ Send login data to backend API
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      // ✅ Save auth data to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("userId", res.data.userId); // Critical for messaging

      setMessage("Login successful!");

      // Redirect based on role
      setTimeout(() => {
        switch (res.data.role) {
          case "farmer":
            navigate("/farmer/dashboard");
            break;
          case "buyer":
            navigate("/marketplace");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/");
        }
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Login</h2>

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
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>

      <button type="submit" style={buttonStyle}>
        Login
      </button>

      {message && <p style={messageStyle(message)}>{message}</p>}
    </form>
  );
}

// --- Styles ---
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
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
};
const messageStyle = (msg) => ({
  marginTop: "10px",
  color: msg.includes("failed") ? "red" : "green",
});