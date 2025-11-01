# Zambian Farmers Marketplace - Setup Instructions

## Overview
This is a full-stack marketplace application built with React (frontend) and Node.js/Express (backend), featuring Firebase integration, Stripe payments, and real-time messaging capabilities.

## Prerequisites

### Required Software
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

### Required Accounts & Services
- **Firebase Account** - [Get started here](https://firebase.google.com/)
- **Stripe Account** - [Sign up here](https://stripe.com/)
- **Email Service** (Gmail/Outlook for development, or professional email service for production)

## Installation Steps

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd zambian-farmers-marketplace
```

### 2. Install Frontend Dependencies
```bash
# Install root dependencies (React frontend)
npm install
```

### 3. Install Backend Dependencies
```bash
# Navigate to backend directory
cd backend
npm install
cd ..
```

## Environment Configuration

### 4. Create Environment Files

#### Frontend Environment (.env)
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend Environment (.env)
Create a `.env` file in the `backend` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key-here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email%40your-project.iam.gserviceaccount.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
EMAIL_FROM=your-email@gmail.com
```

## Firebase Setup

### 5. Firebase Configuration

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Follow the setup wizard

2. **Enable Authentication:**
   - In Firebase Console, go to Authentication > Sign-in method
   - Enable "Email/Password" provider

3. **Create Firestore Database:**
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" for development

4. **Enable Storage:**
   - Go to Storage
   - Click "Get started"
   - Choose "Start in test mode"

5. **Generate Service Account Key:**
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Rename it to `serviceAccountKey.json`
   - Place it in `backend/firebase/` directory

6. **Update Firebase Configuration:**
   - Copy the service account key details to your backend `.env` file
   - Update the database URL in `backend/firebase/firebaseAdmin.js` if needed

## Stripe Setup

### 6. Stripe Configuration

1. **Create Stripe Account:**
   - Sign up at [Stripe](https://stripe.com/)
   - Complete account verification

2. **Get API Keys:**
   - Go to Developers > API Keys
   - Copy your Publishable key and Secret key
   - Add them to your backend `.env` file

3. **Set up Webhooks (Optional for development):**
   - Go to Developers > Webhooks
   - Add endpoint: `http://localhost:5000/api/payments/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy the webhook secret to your `.env` file

## Email Service Setup

### 7. Email Configuration

#### For Gmail (Development):
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password
   - Use this password in your `.env` file

#### For Production:
Consider using services like:
- SendGrid
- Mailgun
- AWS SES
- Nodemailer with SMTP

## Running the Application

### 8. Start the Development Servers

#### Terminal 1 - Backend Server:
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

#### Terminal 2 - Frontend Server:
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

### 9. Verify Installation

1. **Backend Health Check:**
   - Visit `http://localhost:5000/health`
   - Should return: `{"status":"OK","timestamp":"..."}`

2. **Frontend:**
   - Visit `http://localhost:5173`
   - Should see the marketplace homepage

3. **API Connection:**
   - Check browser console for any API connection errors
   - Try registering a new user to test the full flow

## Project Structure

```
zambian-farmers-marketplace/
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── context/           # React contexts
│   ├── services/          # API services
│   └── styles/            # CSS files
├── backend/               # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── firebase/         # Firebase configuration
├── public/               # Static assets
└── docs/                 # Documentation
```

## Available Scripts

### Frontend Scripts:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Scripts:
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## Troubleshooting

### Common Issues:

1. **Port Already in Use:**
   ```bash
   # Kill process on port 5000
   npx kill-port 5000
   
   # Kill process on port 5173
   npx kill-port 5173
   ```

2. **Firebase Connection Issues:**
   - Verify service account key is correctly placed
   - Check Firebase project ID matches
   - Ensure Firestore rules allow read/write

3. **Stripe Payment Issues:**
   - Use test keys for development
   - Check webhook endpoint configuration
   - Verify CORS settings

4. **Email Not Sending:**
   - Check email credentials
   - Verify app password for Gmail
   - Check firewall/antivirus blocking SMTP

### Environment Variables Checklist:
- [ ] JWT_SECRET is set and secure
- [ ] Firebase service account key is properly configured
- [ ] Stripe keys are correct (test keys for development)
- [ ] Email credentials are valid
- [ ] CORS is configured for your frontend URL

## Production Deployment

### Frontend Deployment:
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update `VITE_API_URL` to your production backend URL

### Backend Deployment:
1. Set `NODE_ENV=production` in your environment
2. Use production Firebase and Stripe keys
3. Configure proper CORS for your domain
4. Set up proper logging and monitoring

## Support

If you encounter issues:
1. Check the console logs for both frontend and backend
2. Verify all environment variables are set correctly
3. Ensure all services (Firebase, Stripe) are properly configured
4. Check network connectivity and firewall settings

## Security Notes

- Never commit `.env` files or service account keys to version control
- Use environment variables for all sensitive configuration
- Implement proper CORS policies for production
- Use HTTPS in production
- Regularly rotate API keys and secrets
