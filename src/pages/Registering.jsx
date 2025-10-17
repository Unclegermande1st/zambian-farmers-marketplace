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

  // Send OTP to email (this will register the user and send OTP)
  const handleSendOTP = async () => {
    if (!formData.email || !formData.password) {
      setMessage("Please enter your email and password");
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
        phone: formData.phone || "", // Add phone if available
      });

      localStorage.setItem("pendingEmail", formData.email);
      setMessage(res.data.message || "Registration successful! OTP sent to your email.");
      setOtpSent(true);
      console.log("Registration response:", res.data);
    } catch (err) {
      console.error("Registration error:", err);
      setMessage(err.response?.data?.error || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    const email = localStorage.getItem("pendingEmail") || formData.email;
    if (!email) {
      setMessage("No email found to resend OTP");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await authAPI.resendOTP(email);
      setMessage(res.data.message || "OTP resent to your email!");
      console.log("Resend OTP response:", res.data);
    } catch (err) {
      console.error("Resend OTP error:", err);
      setMessage(err.response?.data?.error || "Failed to resend OTP. Please try again.");
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
      setMessage(" Verification successful! ");
      localStorage.removeItem("pendingEmail");
      
      // Redirect based on role
      setTimeout(() => {
        switch (formData.role) {
          case 'farmer':
            navigate('/farmer-dashboard');
            break;
          case 'buyer':
            navigate('/marketplace');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            navigate('/login');
        }
      }, 2000);
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
      <div className="register-right">
        <h2>Create Account</h2>
        <p className="register-subtitle">
          Step {step} of 5 • Sign up to <span>SmartAgro</span>
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
                <label htmlFor="firstName">First Name </label>
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
                <label htmlFor="lastName">Last Name </label>
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
                <label>I am a: </label>
                <select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                  <option value="buyer">Admin</option>
                </select>
              </div>

              <button type="button" onClick={handleNext}>
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Email & Password */}
          {step === 2 && (
            <div className="form-step">
              <div className="input-group">
                <label htmlFor="email">Email Address </label>
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

              <div className="input-group">
                <label htmlFor="password">Password </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  disabled={otpSent}
                />
                <small style={{ color: '#666', marginTop: '5px' }}>
                  Password must be at least 6 characters
                </small>
              </div>

              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading || !formData.email || !formData.password || formData.password.length < 6}
                >
                  {loading ? "Creating Account..." : "Create Account & Send OTP"}
                </button>
              )}

              {otpSent && (
                <>
                  <div className="input-group">
                    <label htmlFor="otp">Enter OTP Code </label>
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
                    onClick={handleResendOTP}
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

          {/* Step 5: Registration Complete */}
          {step === 5 && (
            <div className="form-step">
              <div className="registration-summary">
                <h3>Registration Summary</h3>
                <div className="summary-item">
                  <strong>Name:</strong> {formData.firstName} {formData.lastName}
                </div>
                <div className="summary-item">
                  <strong>Email:</strong> {formData.email}
                </div>
                <div className="summary-item">
                  <strong>Role:</strong> {formData.role}
                </div>
                {formData.gender && (
                  <div className="summary-item">
                    <strong>Gender:</strong> {formData.gender}
                  </div>
                )}
                {formData.nrc && (
                  <div className="summary-item">
                    <strong>NRC:</strong> {formData.nrc}
                  </div>
                )}
              </div>

              <div className="step-actions">
                <button type="button" onClick={handleBack}>
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMessage("✅ Registration complete! ");
                    setTimeout(() => {
                      switch (formData.role) {
                        case 'farmer':
                          navigate('/farmer-dashboard');
                          break;
                        case 'buyer':
                          navigate('/marketplace');
                          break;
                        case 'admin':
                          navigate('/admin');
                          break;
                        default:
                          navigate('/login');
                      }
                    }, 2000);
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
