// backend/services/emailService.js
const nodemailer = require("nodemailer");

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email Templates
const emailTemplates = {
  otp: (otp) => ({
    subject: "Your OTP Code - SmartAgri",
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
  }),

  orderConfirmation: (order, buyer, products) => ({
    subject: `Order Confirmation #${order.id.slice(0, 8)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Order Confirmed!</h2>
        <p>Hi ${buyer.name},</p>
        <p>Thank you for your order. Here are the details:</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order #${order.id.slice(0, 8)}</h3>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span style="color: #10b981;">Pending</span></p>
          
          <h4>Items:</h4>
          <ul style="list-style: none; padding: 0;">
            ${products.map(p => `
              <li style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
                <strong>${p.title}</strong> - ${p.quantity}kg @ $${p.price}/kg
                <div style="text-align: right; color: #10b981; font-weight: bold;">$${(p.price * p.quantity).toFixed(2)}</div>
              </li>
            `).join('')}
          </ul>
          
          <div style="text-align: right; font-size: 20px; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 2px solid #10b981;">
            Total: $${order.total.toFixed(2)}
          </div>
        </div>
        
        <p>Your order will be processed soon. You'll receive updates via email.</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 40px;">
          Questions? Contact us at support@smartagri.com
        </p>
      </div>
    `,
  }),

  newOrderNotification: (order, farmer, buyer, products) => ({
    subject: `New Order Received #${order.id.slice(0, 8)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">🎉 You have a new order!</h2>
        <p>Hi ${farmer.name},</p>
        <p>Good news! You've received a new order from ${buyer.name}.</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order #${order.id.slice(0, 8)}</h3>
          
          <h4>Products Ordered:</h4>
          <ul style="list-style: none; padding: 0;">
            ${products.map(p => `
              <li style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
                <strong>${p.title}</strong> - ${p.quantity}kg @ $${p.price}/kg
              </li>
            `).join('')}
          </ul>
          
          <div style="font-size: 18px; font-weight: bold; margin-top: 20px; color: #10b981;">
            Total Amount: $${order.total.toFixed(2)}
          </div>
        </div>
        
        <p>Please log in to your dashboard to process this order.</p>
        <a href="${process.env.FRONTEND_URL}/farmer-dashboard" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
          View Order
        </a>
      </div>
    `,
  }),

  verificationApproved: (user) => ({
    subject: "✅ Verification Approved - SmartAgri",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Congratulations! 🎉</h2>
        <p>Hi ${user.name},</p>
        <p>Your verification has been approved! You now have a <strong>Verified Farmer</strong> badge on your profile.</p>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
          <p style="margin: 0;">✅ Your account is now fully verified</p>
          <p style="margin: 10px 0 0 0; color: #6b7280;">This increases trust and helps you get more orders!</p>
        </div>
        
        <a href="${process.env.FRONTEND_URL}/farmer-dashboard" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
          Go to Dashboard
        </a>
      </div>
    `,
  }),

  verificationRejected: (user, reason) => ({
    subject: "Verification Update - SmartAgri",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Verification Status Update</h2>
        <p>Hi ${user.name},</p>
        <p>Unfortunately, we couldn't verify your account at this time.</p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0;">
          <p style="margin: 0;"><strong>Reason:</strong></p>
          <p style="margin: 10px 0 0 0;">${reason || 'Documents were unclear or incomplete.'}</p>
        </div>
        
        <p>Don't worry! You can resubmit your verification documents anytime.</p>
        <p><strong>Tips for successful verification:</strong></p>
        <ul>
          <li>Ensure your NRC photo is clear and readable</li>
          <li>Face photo should be well-lit and show your full face</li>
          <li>Make sure all details match</li>
        </ul>
        
        <a href="${process.env.FRONTEND_URL}/farmer-dashboard" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
          Try Again
        </a>
      </div>
    `,
  }),

  orderStatusUpdate: (order, buyer, newStatus) => ({
    subject: `Order Update #${order.id.slice(0, 8)} - ${newStatus}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Order Status Update</h2>
        <p>Hi ${buyer.name},</p>
        <p>Your order #${order.id.slice(0, 8)} has been updated.</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="font-size: 18px;"><strong>New Status:</strong> 
            <span style="color: #10b981; text-transform: capitalize;">${newStatus}</span>
          </p>
          <p><strong>Order Total:</strong> $${order.total.toFixed(2)}</p>
        </div>
        
        ${newStatus === 'shipped' ? '<p>🚚 Your order is on its way! Expected delivery within 2-3 days.</p>' : ''}
        ${newStatus === 'delivered' ? '<p>🎉 Your order has been delivered! Enjoy your fresh produce!</p>' : ''}
        
        <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
          View Order Details
        </a>
      </div>
    `,
  }),

  paymentConfirmation: (payment, order, buyer) => ({
    subject: `Payment Confirmation - $${payment.amount}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">✅ Payment Successful</h2>
        <p>Hi ${buyer.name},</p>
        <p>Your payment has been processed successfully.</p>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Payment Details</h3>
          <p><strong>Amount Paid:</strong> $${payment.amount.toFixed(2)}</p>
          <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Order ID:</strong> #${order.id.slice(0, 8)}</p>
        </div>
        
        <p>This is your payment receipt. Keep it for your records.</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 40px;">
          If you have any questions, contact us at support@smartagri.com
        </p>
      </div>
    `,
  }),
};

// Send Email Function
const sendEmail = async (to, template) => {
  try {
    const mailOptions = {
      from: `SmartAgri <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    throw error;
  }
};

// Export functions
module.exports = {
  sendEmail,
  emailTemplates,
  sendOTP: async (email, otp) => {
    return sendEmail(email, emailTemplates.otp(otp));
  },
};