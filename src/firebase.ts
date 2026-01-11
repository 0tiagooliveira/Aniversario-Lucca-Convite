// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB33V4sM1YR6LC_vo6zkWpcjCtK6eNQEUM",
  authDomain: "convite-aniversario-lucca.firebaseapp.com",
  projectId: "convite-aniversario-lucca",
  storageBucket: "convite-aniversario-lucca.firebasestorage.app",
  messagingSenderId: "846873026266",
  appId: "1:846873026266:web:535b96f9999946b6230fe3",
  measurementId: "G-GWMCQ1TMVZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics };
