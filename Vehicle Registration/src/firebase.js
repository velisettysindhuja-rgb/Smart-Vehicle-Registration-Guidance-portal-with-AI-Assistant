import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZ-AKb9Ju8MkX9gGGv2MTiEs-Zwcl4CNs",
  authDomain: "synvora-1c23e.firebaseapp.com",
  databaseURL: "https://synvora-1c23e-default-rtdb.firebaseio.com",
  projectId: "synvora-1c23e",
  storageBucket: "synvora-1c23e.firebasestorage.app",
  messagingSenderId: "561442196774",
  appId: "1:561442196774:web:6d53642d8c2834539085e7",
  measurementId: "G-1984H234F0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
