// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blogger-hunt-7c658.firebaseapp.com",
  projectId: "blogger-hunt-7c658",
  storageBucket: "blogger-hunt-7c658.appspot.com",
  messagingSenderId: "181162496878",
  appId: "1:181162496878:web:f488c9ac9abd616500e77f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);