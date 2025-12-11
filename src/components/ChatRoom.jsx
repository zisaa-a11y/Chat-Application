import React, { useState, useRef, useEffect } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import MessageItem from './MessageItem';
import './ChatRoom.css';

/**
 * ChatRoom component - Main chat interface
 * Handles user connection, message display, and message sending
 */
const ChatRoom = () => {
  const [username, setUsername] = useState('');
  const [channel, setChannel] = useState('general');
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    messages,
    connectionStatus,
    currentUserID,
    error,
    connect,
    disconnect,
    sendMessage
  } = useWebSocket('ws://localhost:8080/ws', username, channel);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when connected
  useEffect(() => {
    if (connectionStatus === 'connected' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [connectionStatus]);

  // Handle connection
  const handleConnect = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsConnected(true);
      connect();
    }
  };

  // Handle disconnection
  const handleDisconnect = () => {
    disconnect();
    setIsConnected(false);
  };

  // Handle sending message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && sendMessage(inputMessage)) {
      setInputMessage('');
    }
  };

  // Connection status indicator
  const renderConnectionStatus = () => {
    const statusConfig = {
      connecting: { color: '#ffa500', text: 'Connecting...', icon: '⏳' },
      connected: { color: '#51cf66', text: 'Connected', icon: '✓' },
      disconnected: { color: '#ff6b6b', text: 'Disconnected', icon: '✗' }
    };

    const status = statusConfig[connectionStatus] || statusConfig.disconnected;

    return (
      <div className="connection-status" style={{ backgroundColor: status.color }}>
        <span className="status-icon">{status.icon}</span>
        <span className="status-text">{status.text}</span>
      </div>
    );
  };

  // Login screen
  if (!isConnected) {
    return (
      <div className="chat-container">
        <div className="login-card">
          <h1 className="app-title">🚀 Kabaw Chat</h1>
          <p className="app-subtitle">Real-time WebSocket Communication</p>
          
          <form onSubmit={handleConnect} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                maxLength={50}
                className="input-field"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="channel">Channel</label>
              <input
                id="channel"
                type="text"
                placeholder="Enter channel name..."
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                required
                maxLength={50}
                className="input-field"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="btn-primary"
              disabled={!username.trim() || !channel.trim()}
            >
              Connect to Chat
            </button>
          </form>

          <div className="info-box">
            <p><strong>Note:</strong> Make sure the WebSocket server is running on <code>localhost:8080</code></p>
          </div>
        </div>
      </div>
    );
  }

  // Chat room interface
  return (
    <div className="chat-container">
      <div className="chat-room">
        {/* Header */}
        <div className="chat-header">
          <div className="header-info">
            <h2 className="channel-name">#{channel}</h2>
            <p className="user-info">
              Logged in as: <strong>{username}</strong>
              {currentUserID && (
                <span className="user-id-badge" title={`Your User ID: ${currentUserID}`}>
                  ID: {currentUserID.substring(0, 8)}...
                </span>
              )}
            </p>
          </div>
          <div className="header-actions">
            {renderConnectionStatus()}
            <button onClick={handleDisconnect} className="btn-disconnect">
              Disconnect
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>No messages yet. Be the first to say something! 👋</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageItem 
                key={`${message.timestamp}-${index}`}
                message={message}
                currentUserID={currentUserID}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error display */}
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Message input */}
        <form onSubmit={handleSendMessage} className="message-input-form">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={connectionStatus !== 'connected'}
            className="message-input"
            maxLength={1000}
          />
          <button 
            type="submit" 
            className="btn-send"
            disabled={connectionStatus !== 'connected' || !inputMessage.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
