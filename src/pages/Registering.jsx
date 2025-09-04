// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css"; // ✅ make sure filename matches exactly

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
    confirmPassword: ""
  });

  const navigate = useNavigate();

  // Step navigation
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Final submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    navigate("/dashboard"); // ✅ go to dashboard after submit
  };

  return (
    <div className="register-container">
      {/* Left side */}
      <div className="register-left">
        <h1>SmartAgri</h1>
        <p>Empowering farmers with modern digital solutions.</p>
      </div>

      {/* Right side */}
      <div className="register-right">
        <h2>Create Account</h2>
        <p className="register-subtitle">
          Step {step} of 5 • Sign up to <span>SmartAgri</span>
        </p>

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

              <button type="button" onClick={handleNext}>
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Phone Number & OTP */}
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

              <button type="button">Verify Number</button>

              <div className="input-group">
                <label htmlFor="otp">OTP Verification</label>
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter OTP code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <div className="otp-row">
                <button type="button">Confirm</button>
                <button type="button" className="resend-btn">
                  Resend OTP
                </button>
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

          {/* Step 4: Face ID */}
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

          {/* Step 5: Password */}
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

              <div className="terms">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  I agree to the Terms and Conditions
                </label>
              </div>

              <div className="step-actions">
                <button type="button" onClick={handleBack}>
                  Back
                </button>
                <button type="submit">Submit</button>
              </div>
            </div>
          )}
        </form>

        {/* Social login options (only in step 1) */}
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