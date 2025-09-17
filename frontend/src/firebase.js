// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Import Storage

const firebaseConfig = {
  apiKey: "AIzaSyC2Hyz2VoOWyxOtVf1MQKSiX9ARQzKJAd8",
  authDomain: "zambian-farmers-marketplace.firebaseapp.com",
  projectId: "zambian-farmers-marketplace",
  storageBucket: "zambian-farmers-marketplace.appspot.com", // ✅ Must match exactly
  messagingSenderId: "739918478524",
  appId: "1:739918478524:web:5246741c164495762da4b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Create storage instance

// Export all
export { app, auth, db, storage };