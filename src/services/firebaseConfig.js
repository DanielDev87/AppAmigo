import { initializeApp } from "firebase/app";



const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: "proyecto-appamigo.firebaseapp.com",
  projectId: "proyecto-appamigo",
  storageBucket: "proyecto-appamigo.firebasestorage.app",
  messagingSenderId: "61577691817",
  appId: "1:61577691817:web:8f1a17501a0c987ba6dfb8"
};


const app = initializeApp(firebaseConfig);