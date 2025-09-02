import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatContext from '../contexts/ChatContext';
import FriendsList from '../components/FriendsList';
import ChatWindow from '../components/ChatWindow';

function ChatUI() {
  const {
    friends,
    messages,
    setActiveChat,
    fetchMessages,
    sendMessage
  } = useContext(ChatContext);

  const { friendId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (friendId) {
      setActiveChat(friendId);
      fetchMessages(friendId);
    }
  }, [friendId, setActiveChat, fetchMessages]);

  if (!friendId) {
    return <FriendsList friends={friends} onSelect={id => navigate(`/chat/${id}`)} />;
  }

  return (
    <ChatWindow
      friend={friends.find(f => f._id === friendId)}
      messages={(messages[friendId] || []).map(msg => ({
        ...msg,
        isOwn: msg.senderId !== friendId
      }))}
      onSend={(content, imageUrl, messageType) => {
        if (messageType === 'image') {
         
          return;
        }
        sendMessage(friendId, content, imageUrl, messageType);
        setTimeout(() => fetchMessages(friendId), 300);
      }}
    />
  );
}

export default ChatUI; 