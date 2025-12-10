import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
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
const auth = getAuth(app);
const db = getFirestore(app);

async function seed() {
    try {
        const timestamp = Date.now();
        const emailA = `userA_${timestamp}@test.com`;
        const emailB = `userB_${timestamp}@test.com`;
        const password = "Password123!";

        console.log(`Creating User A: ${emailA}`);
        const userCredA = await createUserWithEmailAndPassword(auth, emailA, password);
        const userA = userCredA.user;
        await updateProfile(userA, { displayName: "User A", photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" });
        await setDoc(doc(db, "users", userA.uid), {
            displayName: "User A",
            randomPseudonym: "User A Pseudo",
            photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            email: emailA
        });
        console.log("User A created and seeded.");

        await signOut(auth);

        console.log(`Creating User B: ${emailB}`);
        const userCredB = await createUserWithEmailAndPassword(auth, emailB, password);
        const userB = userCredB.user;
        await updateProfile(userB, { displayName: "User B", photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" });
        await setDoc(doc(db, "users", userB.uid), {
            displayName: "User B",
            randomPseudonym: "User B Pseudo",
            photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
            email: emailB
        });
        console.log("User B created and seeded.");

        console.log("------------------------------------------------");
        console.log(`LOGIN CREDENTIALS:`);
        console.log(`User A: ${emailA} / ${password}`);
        console.log(`User B: ${emailB} / ${password}`);
        console.log("------------------------------------------------");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding:", error);
        process.exit(1);
    }
}

seed();
