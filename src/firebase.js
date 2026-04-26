import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyMxghOChfiqTeAQ7PE8BkspMu2-1tvx0",
  authDomain: "dti22-f5172.firebaseapp.com",
  projectId: "dti22-f5172",
  storageBucket: "dti22-f5172.firebasestorage.app",
  messagingSenderId: "833577342152",
  appId: "1:833577342152:web:b9fa7e1337a846ba8441fd",
  measurementId: "G-T7HT1Y9969"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app); // Optional: keep disabled for local dev if causing issues

export { auth, db, app };
