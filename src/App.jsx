import React, { useState, useRef } from 'react';
import './App.css';
import ChatWindow from './components/ChatWindow';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoadingAIResponse, setIsLoadingAIResponse] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [fileUploadMessage, setFileUploadMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInput('');
      setIsLoadingAIResponse(true);

      try {
        const formData = new FormData();
        formData.append('question', input);

        const response = await fetch('https://recorder-donna-franklin-vol.trycloudflare.com/ask', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const aiMessageContent = data.answer || data.error || 'No response from AI.';
        setMessages(prevMessages => [...prevMessages, { text: aiMessageContent, sender: 'ai' }]);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        setMessages(prevMessages => [...prevMessages, { text: 'Error: Could not get a response from the server.', sender: 'ai' }]);
      } finally {
        setIsLoadingAIResponse(false);
      }
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setIsFileUploading(true);
      setFileUploadMessage('Uploading...');

      try {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('files', file);
        });

        const response = await fetch('https://recorder-donna-franklin-vol.trycloudflare.com/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setFileUploadMessage(data.message || 'Upload successful!');
      } catch (error) {
        console.error('There was a problem with the file upload:', error);
        setFileUploadMessage('Error uploading file.');
      } finally {
        setIsFileUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setTimeout(() => setFileUploadMessage(''), 3000);
      }
    }
  };

  return (
    <div className="app-container">
      <h1>Hello, Av</h1>
      <ChatWindow messages={messages} isLoading={isLoadingAIResponse} />
      <div className="input-container">
        <label className="icon-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z" />
          </svg>
          <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} multiple />
        </label>
        {fileUploadMessage ? (
          <div className="file-upload-status">{fileUploadMessage}</div>
        ) : (
          <input
            type="text"
            className="input-field"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoadingAIResponse || isFileUploading}
          />
        )}
        <button className="icon-button" onClick={handleSend} disabled={!input.trim() || isLoadingAIResponse || isFileUploading}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94l18-9a.75.75 0 0 0 0-1.34l-18-9z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
