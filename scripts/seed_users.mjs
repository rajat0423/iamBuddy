import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAnkBwRWFZpMaT5fjYGE7__2iWC6jQPm7A",
    authDomain: "studio-9559321699-2e87c.firebaseapp.com",
    projectId: "studio-9559321699-2e87c",
    storageBucket: "studio-9559321699-2e87c.firebasestorage.app",
    messagingSenderId: "122452821974",
    appId: "1:122452821974:web:1ec11db0014c7c5ed80677",
    databaseURL: "https://studio-9559321699-2e87c.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
    try {
        console.log("Seeding dummy user...");
        await setDoc(doc(db, "users", "test_buddy_1"), {
            displayName: "Test Buddy",
            randomPseudonym: "Testy McTestFace",
            photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            avatarId: 1, // Legacy field just in case
            email: "testbuddy@example.com"
        });
        console.log("Dummy user created!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding:", error);
        process.exit(1);
    }
}

seed();
