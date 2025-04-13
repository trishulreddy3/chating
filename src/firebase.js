import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  getDocs,
  where,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDcUNqViJWbjnsDnBGZfBIDFsn-kihQe8c",
  authDomain: "chat-app-c3362.firebaseapp.com",
  projectId: "chat-app-c3362",
  storageBucket: "chat-app-c3362.appspot.com",
  messagingSenderId: "464844746867",
  appId: "1:464844746867:web:ee786af7a9eeee4bc8ba06",
  measurementId: "G-G00KV1MY3B",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// ✅ Google Sign In
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result;
};

// ✅ Chat Utilities
export const getChatId = (uid1, uid2) => {
  return [uid1, uid2].sort().join("_");
};

export const sendMessageToChat = async (chatId, text, uid, displayName) => {
  const chatRef = collection(db, "chats", chatId, "messages");

  await addDoc(chatRef, {
    text,
    uid,
    displayName,
    timestamp: serverTimestamp(),
    seen: false,
  });
};

export const getChatMessages = async (chatId) => {
  const chatRef = collection(db, "chats", chatId, "messages");
  const q = query(chatRef, orderBy("timestamp", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
};

export const searchUserByUsername = async (username) => {
  const q = query(collection(db, "users"), where("username", "==", username));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return snapshot.docs[0].data();
  } else {
    return null;
  }
};

export const getUserRecentChats = async (uid) => {
  const userRef = doc(db, "userChats", uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const chatList = Object.keys(data).map((otherUid) => ({
      uid: otherUid,
      lastInteracted: data[otherUid].lastInteracted.toDate(),
    }));
    return chatList.sort((a, b) => b.lastInteracted - a.lastInteracted);
  } else {
    return [];
  }
};

export const searchUserByUid = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    return null;
  }
};

export const getLastMessage = async (chatId) => {
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const lastMessageSnapshot = await getDocs(
      query(messagesRef, orderBy("timestamp", "desc"))
    );

    if (!lastMessageSnapshot.empty) {
      return lastMessageSnapshot.docs[0].data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching last message:", error);
    return null;
  }
};

// ✅ Online Status Functions
export const setUserOnlineStatus = (userId, status) => {
  const statusRef = doc(db, "users", userId);
  setDoc(statusRef, { status }, { merge: true });
};

export const getUserOnlineStatus = (userId, callback) => {
  const statusRef = doc(db, "users", userId);
  onSnapshot(statusRef, (docSnap) => {
    if (docSnap.exists()) {
      const status = docSnap.data().status;
      callback(status);
    }
  });
};

// ✅ Update user chat history
export const updateUserChats = async (uid, otherUserUid) => {
  try {
    const userRef = doc(db, "userChats", uid);
    const otherUserRef = doc(db, "userChats", otherUserUid);

    await setDoc(
      userRef,
      {
        [otherUserUid]: {
          lastInteracted: serverTimestamp(),
        },
      },
      { merge: true }
    );

    await setDoc(
      otherUserRef,
      {
        [uid]: {
          lastInteracted: serverTimestamp(),
        },
      },
      { merge: true }
    );

    console.log("User chats updated successfully.");
  } catch (error) {
    console.error("Error updating user chats:", error);
  }
};
