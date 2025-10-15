// backend/controllers/emailService.js
const nodemailer = require("nodemailer");

// Create reusable transporter with better error handling
const createTransporter = () => {
  // Validate required environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ EMAIL_USER and EMAIL_PASS must be set in .env file");
    throw new Error("Email configuration missing");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use App Password, not regular Gmail password
    },
    // Additional options for better reliability
    tls: {
      rejectUnauthorized: false // Only for development
    }
  });
};

const sendOTP = async (email, otp) => {
  try {
    const transporter = createTransporter();

    // Verify transporter configuration
    await transporter.verify();
    console.log("✅ Email server is ready to send messages");

    const mailOptions = {
      from: `"SmartAgri" <${process.env.EMAIL_USER}>`, // Better sender format
      to: email,
      subject: "Your OTP Code - SmartAgri Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">SmartAgri Verification</h2>
          <p>Your OTP code is:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #10b981;">
            ${otp}
          </div>
          <p style="color: #6b7280; margin-top: 20px;">This code expires in 5 minutes.</p>
          <p style="color: #6b7280;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
      text: `Your OTP is: ${otp}. It expires in 5 minutes.`, // Fallback plain text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP sent successfully to:", email);
    console.log("📧 Message ID:", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ EMAIL ERROR DETAILS:");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Response:", error.response);
    console.error("Command:", error.command);
    
    // Provide more specific error messages
    if (error.code === 'EAUTH') {
      throw new Error("Email authentication failed. Check EMAIL_USER and EMAIL_PASS in .env");
    } else if (error.code === 'ESOCKET') {
      throw new Error("Network error. Check your internet connection.");
    } else if (error.responseCode === 550) {
      throw new Error("Recipient email address is invalid.");
    }
    
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
};

module.exports = { sendOTP };