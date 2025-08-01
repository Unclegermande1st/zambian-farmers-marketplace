// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC2Hyz2VoOWyxOtVf1MQKSiX9ARQzKJAd8",
  authDomain: "zambian-farmers-marketplace.firebaseapp.com",
  projectId: "zambian-farmers-marketplace",
  storageBucket: "zambian-farmers-marketplace.firebasestorage.app",
  messagingSenderId: "739918478524",
  appId: "1:739918478524:web:5246741c164495762da4b9"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
