import React, { useState } from 'react';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  // Handle input change
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  // Handle message sending
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');  // Clear the input field after sending
    }
  };

  return (
    <div className="message-input">
      <input 
        type="text" 
        value={message} 
        onChange={handleInputChange} 
        placeholder="Type a message..." 
        className="message-input-field"
      />
      <button onClick={handleSendMessage} className="send-button">Send</button>
    </div>
  );
};

export default MessageInput;
