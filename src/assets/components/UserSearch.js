import React, { useState } from "react";
import { searchUserByUsername, getChatId } from "../../firebase";

const UserSearch = ({ currentUser, onChatStart }) => {
  const [username, setUsername] = useState("");

  const handleSearch = async () => {
    const user = await searchUserByUsername(username);
    if (user) {
      const chatId = getChatId(currentUser.uid, user.uid);
      onChatStart(chatId, user); // notify parent to open chat
    } else {
      alert("User not found!");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username to chat"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default UserSearch;
