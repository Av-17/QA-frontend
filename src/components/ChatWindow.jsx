import React, { useEffect, useRef } from 'react';
import './ChatWindow.css';

function ChatWindow({ messages, isLoading }) {
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="chat-window" ref={chatWindowRef}>
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.sender}`}>
          {message.text}
        </div>
      ))}
      {isLoading && (
        <div className="message ai">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;