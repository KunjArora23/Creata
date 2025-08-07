import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FriendsList from '../components/FriendsList';

function FriendsListRoute() {
  const navigate = useNavigate();

  const handleSelect = useCallback(
    (id) => {
      navigate(`/chat/${id}`);
    },
    [navigate]
  );

  return <FriendsList onSelect={handleSelect} />;
}

export default FriendsListRoute; 