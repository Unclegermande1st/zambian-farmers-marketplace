# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Prerequisites Check
Make sure you have:
- Node.js (v18+) installed: `node --version`
- Git installed: `git --version`

### 2. Clone & Install
```bash
# Clone the repository
git clone <your-repository-url>
cd zambian-farmers-marketplace

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup
```bash
# Copy environment templates
cp env.template .env
cp backend/env.template backend/.env

# Edit the environment files with your actual values
# See SETUP_INSTRUCTIONS.md for detailed configuration
```

### 4. Start Development Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### 5. Verify Setup
- Backend: http://localhost:5000/health
- Frontend: http://localhost:5173

## ⚠️ Important Notes

1. **Firebase Setup Required**: You need to configure Firebase before the app will work properly
2. **Stripe Keys**: Add your Stripe keys for payment functionality
3. **Email Service**: Configure email service for OTP verification

## 📚 Full Documentation
See `SETUP_INSTRUCTIONS.md` for complete setup guide with all service configurations.

## 🆘 Need Help?
- Check the troubleshooting section in `SETUP_INSTRUCTIONS.md`
- Verify all environment variables are set correctly
- Ensure all external services (Firebase, Stripe) are configured
