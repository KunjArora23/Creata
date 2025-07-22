import React, { useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatContext from '../contexts/ChatContext';
import FriendsList from '../components/FriendsList';

function FriendsListRoute() {
  const { friends } = useContext(ChatContext);
  const navigate = useNavigate();

  const handleSelect = useCallback(
    (id) => {
      navigate(`/chat/${id}`);
    },
    [navigate]
  );

  return <FriendsList friends={friends} onSelect={handleSelect} />;
}

export default FriendsListRoute; 