import React from 'react';
import './MessageItem.css';

/**
 * MessageItem component - Displays a single chat message
 * @param {Object} message - The message object
 * @param {string} currentUserID - The current user's ID
 */
const MessageItem = ({ message, currentUserID }) => {
  const { type, username, user_id, content, timestamp } = message;
  
  // Determine if message is from current user
  const isOwnMessage = user_id === currentUserID;
  
  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // System messages (welcome, user joined, etc.)
  if (type === 'system' || type === 'user_connected') {
    return (
      <div className="message-item system-message">
        <span className="system-icon">ℹ️</span>
        <span className="system-content">{content}</span>
      </div>
    );
  }

  // Regular chat messages
  return (
    <div className={`message-item ${isOwnMessage ? 'own-message' : 'other-message'}`}>
      <div className="message-header">
        <span className="message-username">{username}</span>
        <span className="message-time">{formatTime(timestamp)}</span>
      </div>
      <div className="message-content">{content}</div>
      {user_id && (
        <div className="message-user-id" title={`User ID: ${user_id}`}>
          ID: {user_id.substring(0, 8)}...
        </div>
      )}
    </div>
  );
};

export default MessageItem;
