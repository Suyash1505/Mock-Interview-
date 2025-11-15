import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEJKrMJayXbNQKfKytQ3FXPzBd5LSvwuo",
  authDomain: "aptify-e10e9.firebaseapp.com",
  projectId: "aptify-e10e9",
  storageBucket: "aptify-e10e9.firebasestorage.app",
  messagingSenderId: "531434384864",
  appId: "1:531434384864:web:21e340e4ab37ffc66c4f85",
  measurementId: "G-10KJT81M1P"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
