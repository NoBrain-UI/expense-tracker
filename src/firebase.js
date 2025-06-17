// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCMY53kl8O4VxqempXLp2DK2X4txKD2D4c",
  authDomain: "expense-tracker-40291.firebaseapp.com",
  projectId: "expense-tracker-40291",
  storageBucket: "expense-tracker-40291.appspot.com",
  messagingSenderId: "671983548526",
  appId: "1:671983548526:web:cb15d373c47be1c92e0e7f",
  measurementId: "G-HQ0SPJSC7R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export for use in other files
export { app, auth, db, storage };
