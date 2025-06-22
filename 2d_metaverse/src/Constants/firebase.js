import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "real-estate-38246.firebaseapp.com",
  projectId: "real-estate-38246",
  storageBucket: "real-estate-38246.firebasestorage.app",
  messagingSenderId: "97436081659",
  appId: "1:97436081659:web:4bc6fe7781e2320dc2bf5e",
  measurementId: "G-NSJN0JSXBL"
};
export const app = initializeApp(firebaseConfig);

