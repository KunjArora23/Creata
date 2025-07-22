import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client';
import AuthContext from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const { logout } = React.useContext(AuthContext);

  // Fetch all connected friends
  useEffect(() => {
    async function fetchFriends() {
      try {
        const res = await api.get('/api/friends/connections');
        setFriends(res.data.friends || []);
      } catch (err) {
        console.error('Failed to fetch friends:', err);
      }
    }
    fetchFriends();
  }, []);

  // Helper to connect socket with retry on token expiration
  const connectSocket = React.useCallback(async () => {
    let newSocket;
    let triedRefresh = false;
    while (true) {
      newSocket = io(import.meta.env.VITE_BACKEND_URL, {
        withCredentials: true,
        autoConnect: false,
      });
      // Listen for connection error
      let authFailed = false;
      newSocket.on('connect_error', async (err) => {
        if (err && err.message && err.message.includes('Authentication')) {
          if (!triedRefresh) {
            triedRefresh = true;
            try {
              await api.get('/api/auth/refresh-access-token');
              // Try again with new token
              newSocket.close();
              // Loop will retry
            } catch {
              // Refresh failed, force logout
              logout();
              authFailed = true;
              newSocket.close();
            }
          } else {
            // Already tried refresh, force logout
            logout();
            authFailed = true;
            newSocket.close();
          }
        }
      });
      newSocket.connect();
      // Wait for either connect or auth failure
      await new Promise((resolve) => {
        newSocket.on('connect', resolve);
        newSocket.on('disconnect', () => {
          if (authFailed) resolve();
        });
      });
      if (!authFailed) break;
    }
    setSocket(newSocket);
    return newSocket;
  }, [logout]);

  // Initialize socket connection with refresh logic
  useEffect(() => {
    let activeSocket;
    connectSocket().then((sock) => {
      activeSocket = sock;
    });
    return () => {
      if (activeSocket) activeSocket.close();
    };
  }, [connectSocket]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (message) => {
      const otherUserId = message.senderId === activeChat ? message.receiverId : message.senderId;
      setMessages((prev) => {
        const chatMessages = prev[otherUserId] || [];
        return {
          ...prev,
          [otherUserId]: [...chatMessages, message],
        };
      });
    };

    socket.on('chat:receive', handleReceive);
    return () => {
      socket.off('chat:receive', handleReceive);
    };
  }, [socket, activeChat]);

  // Send message to friend
  function sendMessage(friendId, content) {
    if (!content.trim() || !socket) return;

    socket.emit('chat:send', { receiverId: friendId, content }, (response) => {
      if (!response?.success) {
        console.error('Failed to send message:', response?.message || 'Unknown error');
      } else {
        console.log('Message sent successfully');
      }
    });
  }

  // Load message history from server
  function fetchMessages(friendId) {
    api.get(`/api/messages/${friendId}`)
      .then((res) => {
        setMessages((prev) => ({
          ...prev,
          [friendId]: res.data.data || [],
        }));
      })
      .catch((err) => {
        console.error('Failed to fetch messages:', err);
      });
  }

  return (
    <ChatContext.Provider
      value={{
        friends,
        messages,
        activeChat,
        setActiveChat,
        sendMessage,
        fetchMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;