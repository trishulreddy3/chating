import React, { useRef } from "react";

const Sidebar = ({ user, onLogout, onProfilePhotoChange }) => {
  const fileInputRef = useRef(null);

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.profileSection}>
        <img
          src={user.photoURL || "/default-avatar.png"}
          alt="Profile"
          style={styles.avatar}
          onClick={handleProfileClick}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => onProfilePhotoChange(e.target.files[0])}
        />
        <div style={styles.username}>{user.displayName}</div>
      </div>

      <div style={styles.menu}>
        <button onClick={onLogout} style={styles.button}>Logout</button>
        <button style={styles.button}>Settings</button>
        <button style={styles.button}>About</button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    height: "100vh",
    backgroundColor: "#2d2d2d",
    color: "#fff",
    padding: "20px",
    boxSizing: "border-box",
  },
  profileSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    cursor: "pointer",
    objectFit: "cover",
  },
  username: {
    marginTop: "10px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Sidebar;
