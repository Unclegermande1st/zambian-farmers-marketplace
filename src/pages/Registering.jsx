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
    email: "",
    nrc: "",
    password: "",
    confirmPassword: "",
    role: "farmer",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // Step navigation
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  // Input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Send OTP to email
  const handleSendOTP = async () => {
    if (!formData.email) {
      setMessage("Please enter your email address");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const res = await authAPI.register({
        name: fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      localStorage.setItem("pendingEmail", formData.email);
      setMessage(res.data.message || "OTP sent to your email! Check your inbox.");
      setOtpSent(true);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleOTPVerify = async () => {
    if (!otp) {
      setMessage("Please enter the OTP");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const email = localStorage.getItem("pendingEmail");
      await authAPI.verifyOTP(email, otp);
      setMessage("✅ Verification successful! Redirecting to login...");
      localStorage.removeItem("pendingEmail");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle submit for current step
  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 2 && otpSent) {
      handleOTPVerify();
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
              message.includes("failed") || message.includes("Invalid") || message.includes("expired")
                ? "alert-danger"
                : "alert-success"
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
                <label htmlFor="firstName">First Name *</label>
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
                <label htmlFor="lastName">Last Name *</label>
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
                    <input type="radio" name="gender" value="male" onChange={handleChange} /> Male
                  </label>
                  <label>
                    <input type="radio" name="gender" value="female" onChange={handleChange} /> Female
                  </label>
                </div>
              </div>

              <div className="input-group">
                <label>I am a: *</label>
                <select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                </select>
              </div>

              <button type="button" onClick={handleNext}>
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Email & OTP */}
          {step === 2 && (
            <div className="form-step">
              <div className="input-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={otpSent}
                />
              </div>

              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading || !formData.email}
                >
                  {loading ? "Sending OTP..." : "Send Verification Code"}
                </button>
              )}

              {otpSent && (
                <>
                  <div className="input-group">
                    <label htmlFor="otp">Enter OTP Code *</label>
                    <input
                      type="text"
                      id="otp"
                      placeholder="Enter the 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength="6"
                      required
                    />
                    <small style={{ color: '#666', marginTop: '5px' }}>
                      Check your email for the verification code
                    </small>
                  </div>

                  <div className="step-actions">
                    <button type="button" onClick={handleBack}>
                      Back
                    </button>
                    <button type="submit" disabled={loading || !otp}>
                      {loading ? "Verifying..." : "Verify & Continue"}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading}
                    style={{
                      background: 'transparent',
                      color: '#667eea',
                      textDecoration: 'underline',
                      marginTop: '10px'
                    }}
                  >
                    Resend OTP
                  </button>
                </>
              )}

              {!otpSent && (
                <div className="step-actions">
                  <button type="button" onClick={handleBack}>
                    Back
                  </button>
                </div>
              )}
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
                />
                <small style={{ color: '#666', marginTop: '5px' }}>
                  Optional - can be added later for verification
                </small>
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

          {/* Step 4: Face ID */}
          {step === 4 && (
            <div className="form-step">
              <p>Upload a photo for identity verification (Optional)</p>
              <div className="input-group">
                <label htmlFor="faceId">Upload Photo</label>
                <input type="file" id="faceId" accept="image/*" />
                <small style={{ color: '#666', marginTop: '5px' }}>
                  Can be completed later from your profile
                </small>
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
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
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
                <button
                  type="button"
                  onClick={() => {
                    if (formData.password !== formData.confirmPassword) {
                      setMessage("Passwords do not match!");
                      return;
                    }
                    if (formData.password.length < 6) {
                      setMessage("Password must be at least 6 characters!");
                      return;
                    }
                    setMessage("✅ Registration complete! Redirecting to login...");
                    setTimeout(() => navigate("/login"), 2000);
                  }}
                  disabled={loading}
                >
                  Complete Registration
                </button>
              </div>
            </div>
          )}
        </form>

        {step === 1 && (
          <>
            <div className="divider">
              <span>Or sign up with</span>
            </div>

            <div className="social-login">
              <button className="social-btn facebook" type="button">Facebook</button>
              <button className="social-btn google" type="button">Google</button>
              <button className="social-btn twitter" type="button">Twitter</button>
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
