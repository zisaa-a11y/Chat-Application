import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing WebSocket connection
 * Handles connection, reconnection, message sending and receiving
 */
const useWebSocket = (url, username, channel) => {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected, connecting, connected
  const [currentUserID, setCurrentUserID] = useState(null);
  const [error, setError] = useState(null);
  
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Connect to WebSocket server
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('[WEBSOCKET] Already connected');
      return;
    }

    const wsUrl = `${url}?username=${encodeURIComponent(username)}&channel=${encodeURIComponent(channel)}`;
    console.log(`[FRONTEND-CONNECT] Attempting to connect to: ${wsUrl}`);
    
    setConnectionStatus('connecting');
    setError(null);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log(`[FRONTEND-CONNECT] Connected to WebSocket as ${username} in channel ${channel}`);
        setConnectionStatus('connected');
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('[FRONTEND-MESSAGE]', JSON.stringify(message, null, 2));
          
          // Handle user_connected message to get user ID
          if (message.type === 'user_connected' && message.user_id) {
            setCurrentUserID(message.user_id);
            console.log(`[FRONTEND-USER-ID] Assigned user ID: ${message.user_id}`);
          }
          
          setMessages(prev => [...prev, message]);
        } catch (err) {
          console.error('[FRONTEND-ERROR] Failed to parse message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('[FRONTEND-ERROR] WebSocket error:', event);
        setError('Connection error occurred');
      };

      ws.onclose = (event) => {
        console.log(`[FRONTEND-DISCONNECT] Connection closed. Code: ${event.code}, Reason: ${event.reason}`);
        setConnectionStatus('disconnected');
        wsRef.current = null;
        
        // Clear user ID on disconnect
        if (currentUserID) {
          console.log('[FRONTEND-USER-ID] User ID cleared');
          setCurrentUserID(null);
        }

        // Attempt to reconnect if not a normal closure and under max attempts
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          console.log(`[FRONTEND-RECONNECT] Attempting reconnect ${reconnectAttemptsRef.current}/${maxReconnectAttempts} in ${delay}ms`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError('Max reconnection attempts reached. Please refresh the page.');
        }
      };
    } catch (err) {
      console.error('[FRONTEND-ERROR] Failed to create WebSocket:', err);
      setError('Failed to connect to server');
      setConnectionStatus('disconnected');
    }
  }, [url, username, channel, currentUserID]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    console.log('[FRONTEND-DISCONNECT] User initiated disconnect');
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User initiated disconnect');
      wsRef.current = null;
    }
    
    setConnectionStatus('disconnected');
    setCurrentUserID(null);
  }, []);

  // Send message to WebSocket server
  const sendMessage = useCallback((content) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && content.trim()) {
      const message = {
        type: 'message',
        content: content.trim()
      };
      
      console.log('[FRONTEND-SEND]', JSON.stringify(message, null, 2));
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted');
      }
    };
  }, []);

  return {
    messages,
    connectionStatus,
    currentUserID,
    error,
    connect,
    disconnect,
    sendMessage
  };
};

export default useWebSocket;
