// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVCGVT4-UiTP9WFJzwSRKj_Fpm6Az-QX4",
  authDomain: "webbanquanaoreactandphp.firebaseapp.com",
  projectId: "webbanquanaoreactandphp",
  storageBucket: "webbanquanaoreactandphp.appspot.com",
  messagingSenderId: "4526904490",
  appId: "1:4526904490:web:ccf6831bf53d6d6af96cd3",
  measurementId: "G-RZ5Q9T74QK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);
const proverderGG = new GoogleAuthProvider();

export { db, auth, proverderGG, signInWithPopup, signOut, onAuthStateChanged };
