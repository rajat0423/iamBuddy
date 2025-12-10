import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

// Validate config
const missingKeys = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

if (missingKeys.length > 0) {
    console.error(
        "Missing Firebase configuration keys. Please check your .env file.",
        missingKeys
    );
}

// Initialize Firebase
console.log("Initializing Firebase...");
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
console.log("Firebase App initialized:", app.name);
const auth = getAuth(app);
console.log("Firebase Auth initialized");
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { app, auth, db, rtdb };
