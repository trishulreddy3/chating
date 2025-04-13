import React from "react";
// import { signInWithGoogle } from "../../firebase"; // ✅ Adjust import
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, signInWithGoogle } from "../../firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";


// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { db, signInWithGoogle } from "../../firebase"; // assuming db is exported from firebase.js
const isUsernameTaken = async (username) => {
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };


const LoginPage = ({ onLogin }) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const username = prompt("Choose a username:");
        // You might want to check if the username already exists — see step 2

        await setDoc(userRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          username: username,
        });
      }

      onLogin(result.user);
    } catch (err) {
      console.error("Google Sign-in Error:", err);
    }
  };


  return (
    <div>
      <h1>Chat App</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default LoginPage;
