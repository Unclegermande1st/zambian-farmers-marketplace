// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import "../styles/register.css";

function Register() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    nrc: "",
    password: "",
    confirmPassword: "",
    role: "farmer",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Navigation between steps
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Registration step (send data to backend)
  const handleRegisterSubmit = async () => {
    setLoading(true);
    setMessage("");
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const res = await authAPI.register({
        name: fullName,
        email: formData.phone,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      localStorage.setItem("pendingEmail", formData.phone);
      setMessage(res.data.message || "OTP sent to your phone/email");
      handleNext(); // Move to OTP verification
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // OTP verification step
  const handleOTPVerify = async () => {
    setLoading(true);
    setMessage("");
    try {
      const email = localStorage.getItem("pendingEmail");
      await authAPI.verifyOTP(email, otp);
      setMessage("Verification successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle submit for current step
  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 2) {
      handleOTPVerify();
    } else if (step === 5) {
      handleRegisterSubmit();
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h1>MarketPlus</h1>
        <p>Empowering farmers with modern digital solutions.</p>
      </div>

      <div className="register-right">
        <h2>Create Account</h2>
        <p className="register-subtitle">
          Step {step} of 5 • Sign up to <span>SmartAgri</span>
        </p>

        {message && (
          <div
            className={`alert ${
              message.includes("failed") ? "alert-danger" : "alert-success"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="form-step">
              <div className="input-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Gender</label>
                <div className="gender-options">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      onChange={handleChange}
                    />{" "}
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      onChange={handleChange}
                    />{" "}
                    Female
                  </label>
                </div>
              </div>

              <div className="input-group">
                <label>I am a:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                </select>
              </div>

              <button type="button" onClick={handleNext}>
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Phone & OTP */}
          {step === 2 && (
            <div className="form-step">
              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleRegisterSubmit}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Verify Number"}
              </button>

              <div className="input-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter the code sent to you"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <div className="step-actions">
                <button type="button" onClick={handleBack}>
                  Back
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Confirm OTP"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: NRC */}
          {step === 3 && (
            <div className="form-step">
              <div className="input-group">
                <label htmlFor="nrc">National ID Number</label>
                <input
                  type="text"
                  id="nrc"
                  name="nrc"
                  placeholder="Enter your NRC number"
                  value={formData.nrc}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="step-actions">
                <button type="button" onClick={handleBack}>
                  Back
                </button>
                <button type="button" onClick={handleNext}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Face ID Upload */}
          {step === 4 && (
            <div className="form-step">
              <p>Use your webcam or upload a photo for Face ID verification.</p>
              <div className="input-group">
                <label htmlFor="faceId">Upload Photo</label>
                <input type="file" id="faceId" accept="image/*" />
              </div>

              <div className="step-actions">
                <button type="button" onClick={handleBack}>
                  Back
                </button>
                <button type="button" onClick={handleNext}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Password Creation */}
          {step === 5 && (
            <div className="form-step">
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="step-actions">
                <button type="button" onClick={handleBack}>
                  Back
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Social login options (only step 1) */}
        {step === 1 && (
          <>
            <div className="divider">
              <span>Or sign up with</span>
            </div>

            <div className="social-login">
              <button className="social-btn facebook">Facebook</button>
              <button className="social-btn google">Google</button>
              <button className="social-btn twitter">Twitter</button>
            </div>

            <div className="login-link">
              Already have an account? <a href="/login">Sign In</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;