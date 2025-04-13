import React from "react";

const Message = ({ message, currentUid }) => {
  const isMine = message.uid === currentUid;

  return (
    <div
      style={{
        margin: "10px",
        padding: "10px",
        background: isMine ? "#DCF8C6" : "#E6E6E6",
        borderRadius: "10px",
        alignSelf: isMine ? "flex-end" : "flex-start",
        maxWidth: "60%",
      }}
    >
      <strong>{isMine ? "You" : message.displayName}:</strong> {message.text}
    </div>
  );
};

export default Message;
