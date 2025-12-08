import { db } from "@/firebase/config";
import { collection, addDoc, updateDoc, doc, query, where, getDocs, serverTimestamp, deleteDoc } from "firebase/firestore";

export interface FriendRequest {
    id: string;
    fromUserId: string;
    toUserId: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: any;
    fromUserName?: string; // Optional: snapshot of name at time of request
}

// Send a friend request
export async function sendFriendRequest(fromUserId: string, toUserId: string, fromUserName: string) {
    // Check if request already exists
    const q = query(
        collection(db, "friend_requests"),
        where("fromUserId", "==", fromUserId),
        where("toUserId", "==", toUserId)
    );
    const existing = await getDocs(q);
    if (!existing.empty) return; // Already sent

    // Check if already friends (reverse check needed in real app, simplified here)

    await addDoc(collection(db, "friend_requests"), {
        fromUserId,
        toUserId,
        fromUserName,
        status: 'pending',
        createdAt: serverTimestamp()
    });
}

// Accept a friend request
export async function acceptFriendRequest(requestId: string, fromUserId: string, toUserId: string) {
    const reqRef = doc(db, "friend_requests", requestId);
    await updateDoc(reqRef, { status: 'accepted' });

    // Add to users' friend lists (subcollection or array)
    // For scalability, let's use a 'friends' subcollection on each user
    await addDoc(collection(db, "users", toUserId, "friends"), {
        friendId: fromUserId,
        createdAt: serverTimestamp()
    });

    await addDoc(collection(db, "users", fromUserId, "friends"), {
        friendId: toUserId,
        createdAt: serverTimestamp()
    });
}

// Reject a friend request
export async function rejectFriendRequest(requestId: string) {
    await deleteDoc(doc(db, "friend_requests", requestId));
}

// Get pending requests for a user
export async function getIncomingRequests(userId: string) {
    const q = query(
        collection(db, "friend_requests"),
        where("toUserId", "==", userId),
        where("status", "==", "pending")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Get friends list
export async function getFriends(userId: string) {
    const q = query(collection(db, "users", userId, "friends"));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data().friendId);
}
