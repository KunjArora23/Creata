import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client';
import AuthContext from './AuthContext';
import { useContext } from 'react';
import { useCallback } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const { logout } = useContext(AuthContext);

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
  const connectSocket = useCallback(async () => {
    let newSocket;
    let triedRefresh = false;
    while (true) {
      newSocket = io(import.meta.env.VITE_BACKEND_URL, {
        withCredentials: true,
        autoConnect: false,
      });
      

      let authFailed = false;
      newSocket.on('connect_error', async (err) => {
        if (err && err.message && err.message.includes('Authentication')) {
          if (!triedRefresh) {
            triedRefresh = true;
            try {
              await api.get('/api/auth/refresh-access-token');
             
              newSocket.close();
             
            } catch {
          
              logout();
              authFailed = true;
              newSocket.close();
            }
          } else {
           
            logout();
            authFailed = true;
            newSocket.close();
          }
        }
      });
      newSocket.connect();
    
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

  
  useEffect(() => {
    let activeSocket;
    connectSocket().then((sock) => {
      activeSocket = sock;
    });
    return () => {
      if (activeSocket) activeSocket.close();
    };
  }, [connectSocket]);


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

  
  function sendMessage(friendId, content, imageUrl = null, messageType = 'text') {
    if ((!content || !content.trim()) && !imageUrl) return;

    socket.emit('chat:send', { 
      receiverId: friendId, 
      content: content?.trim() || null, 
      imageUrl,
      messageType 
    }, (response) => {
      if (!response?.success) {
        console.error('Failed to send message:', response?.message || 'Unknown error');
      } else {
        console.log('Message sent successfully');
      }
    });
  }


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