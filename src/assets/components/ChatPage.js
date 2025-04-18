import React, { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, auth, storage } from "../../firebase";
import { collection, getDocs, query, orderBy, onSnapshot, doc, setDoc, updateDoc } from "firebase/firestore";

const ChatPage = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [inputText, setInputText] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!selectedChatUser) return;

    const chatId = getChatId(user.uid, selectedChatUser.uid);
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => doc.data());
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [selectedChatUser]);

  const handleSendMessage = async () => {
    if (!selectedChatUser || inputText.trim() === "") return;

    const chatId = getChatId(user.uid, selectedChatUser.uid);
    const newMessage = {
      text: inputText,
      uid: user.uid,
      displayName: user.displayName,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    const messagesRef = collection(db, "chats", chatId, "messages");
    await setDoc(doc(messagesRef), newMessage);
    setInputText("");
  };

  const handleFileChange = (e) => {
    if (e?.target?.files?.[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) return;

    const storageRef = ref(storage, `profilePhotos/${user.uid}`);
    await uploadBytes(storageRef, photoFile);
    const downloadURL = await getDownloadURL(storageRef);

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { photoURL: downloadURL });

    alert("Profile photo updated!");
    setPhotoFile(null);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {user ? (
        <Sidebar
          user={user}
          onLogout={() => auth.signOut()}
          onProfilePhotoChange={handleFileChange}
          onSelectUser={setSelectedChatUser}
        />
      ) : null}

      <div style={{ flex: 1, padding: "16px", overflow: "hidden" }}>
        {selectedChatUser ? (
          <>
            <h3>Chatting with {selectedChatUser.username}</h3>
            <div style={{ height: "300px", overflowY: "scroll", marginTop: "16px" }}>
              {messages.map((msg, i) => (
                <p key={i}>
                  <strong>{msg.displayName}:</strong> {msg.text}
                </p>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message"
                style={{ flex: 1, padding: "8px" }}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div style={{ marginTop: "32px" }}>
            <h3>Please select a user to start chatting.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

const getChatId = (uid1, uid2) => {
  // Ensure the chat ID is unique by sorting the user IDs (to handle different orderings)
  const sortedIds = [uid1, uid2].sort();
  return sortedIds.join("_"); // e.g. "uid1_uid2"
};






const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },
  sidebar: {
    width: "300px",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    overflowY: "scroll",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  chatItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    marginBottom: "10px",
    cursor: "pointer",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  name: {
    fontWeight: "bold",
  },
  lastMessage: {
    color: "#555",
  },
  chatContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    backgroundColor: "#fff",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  onlineIndicator: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginLeft: "10px",
  },
  messageArea: {
    flex: 1,
    overflowY: "scroll",
    marginBottom: "20px",
  },
  message: {
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "60%",
    wordWrap: "break-word",
    margin: "10px 0",
  },
  timestamp: {
    fontSize: "10px",
    color: "#999",
  },
  typingArea: {
    display: "flex",
    alignItems: "center",
    borderTop: "1px solid #e0e0e0",
    paddingTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ddd",
    marginRight: "10px",
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
  },
};

export default ChatPage;
