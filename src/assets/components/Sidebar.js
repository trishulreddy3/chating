import React, { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const Sidebar = ({ user, onLogout, onProfilePhotoChange, onSelectUser }) => {
  const fileInputRef = useRef(null);
  const [allUsers, setAllUsers] = useState([]);

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersList = usersSnapshot.docs
        .map((doc) => doc.data())
        .filter((u) => u.uid !== user.uid); // Exclude current user

      setAllUsers(usersList);
    };

    fetchUsers();
  }, [user.uid]);

  return (
    <div style={styles.sidebar}>
      <div style={styles.profileSection}>
        <img
          src={user?.photoURL || "default-profile.png"}
          alt="Profile"
          style={styles.avatar}
          onClick={handleProfileClick}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => onProfilePhotoChange(e)}
          />
        <div style={styles.username}>{user?.displayName || "Guest"}</div>
      </div>

      <div style={styles.userList}>
        <h4 style={{ padding: "0 16px" }}>Chats</h4>
        {allUsers.map((chatUser) => (
          <div
            key={chatUser.uid}
            style={styles.userItem}
            onClick={() => onSelectUser(chatUser)}
          >
            <img
              src={chatUser.photoURL || "default-profile.png"}
              alt={chatUser.username}
              style={styles.userAvatar}
            />
            <span>{chatUser.username || chatUser.displayName}</span>
          </div>
        ))}
      </div>

      <div style={styles.menu}>
        <button onClick={onLogout} style={styles.button}>
          Logout
        </button>
        <button style={styles.button}>Settings</button>
        <button style={styles.button}>About</button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    backgroundColor: "#f0f0f0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  profileSection: {
    padding: "16px",
    textAlign: "center",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    cursor: "pointer",
  },
  username: {
    marginTop: "8px",
    fontWeight: "bold",
  },
  userList: {
    flex: 1,
    overflowY: "auto",
  },
  userItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 16px",
    cursor: "pointer",
    borderBottom: "1px solid #ccc",
  },
  userAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "12px",
  },
  menu: {
    padding: "16px",
  },
  button: {
    width: "100%",
    padding: "8px",
    marginBottom: "8px",
    cursor: "pointer",
  },
};

export default Sidebar;
