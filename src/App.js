import React, { useState } from "react";
import LoginPage from "./assets/components/LoginPage";
import ChatPage from "./assets/components/ChatPage";
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (user) => {
    setUser(user);
  };

  return (
    <div>
      {user ? <ChatPage user={user} /> : <LoginPage onLogin={handleLogin} />}
    </div>
  );
};

export default App;
