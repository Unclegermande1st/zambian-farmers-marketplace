// frontend/src/firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC2Hyz2VoOWyxOtVf1MQKSiX9ARQzKJAd8", 
  authDomain: "zambian-farmers-marketplace.firebaseapp.com",
  projectId: "zambian-farmers-marketplace",
  storageBucket: "zambian-farmers-marketplace.appspot.com",
  messagingSenderId: "739918478524",
  appId: "1:739918478524:web:5246741c164495762da4b9"
};

const app = initializeApp(firebaseConfig);

export { app };