// client/src/components/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const Chat = ({ boardId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    // Connect to the socket server
    socketRef.current = io('http://localhost:5000');

    // Join a room specific to this board
    socketRef.current.emit('joinBoard', boardId);

    // Listen for incoming messages
    socketRef.current.on('receiveMessage', (receivedMessage) => {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    // Clean up on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [boardId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socketRef.current.emit('sendMessage', { message, boardId });
      setMessage('');
    }
  };

  return (
    <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', height: '400px', display: 'flex', flexDirection: 'column' }}>
      <h3>Team Chat</h3>
      <div style={{ flexGrow: 1, border: '1px solid #eee', marginBottom: '10px', padding: '5px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index}>{msg.message}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ width: '80%', padding: '8px' }}
        />
        <button type="submit" style={{ width: '18%', padding: '8px' }}>Send</button>
      </form>
    </div>
  );
};

export default Chat;
