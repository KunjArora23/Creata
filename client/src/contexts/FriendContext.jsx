import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import AuthContext from './AuthContext';

const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = React.useContext(AuthContext);

  // Fetch all connections (friends)
  const fetchFriends = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/friends/connections');
      setFriends(res.data.friends || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast.error('Failed to fetch friends');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch pending friend requests
  const fetchPendingRequests = useCallback(async () => {
    try {
      const res = await api.get('/api/friends/requests/pending');
      setPendingRequests(res.data.pendingRequests || []);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      toast.error('Failed to fetch pending requests');
    }
  }, []);

  // Fetch sent friend requests
  const fetchSentRequests = useCallback(async () => {
    try {
      const res = await api.get('/api/friends/requests/sent');
      setSentRequests(res.data.sentRequests || []);
    } catch (error) {
      console.error('Error fetching sent requests:', error);
      toast.error('Failed to fetch sent requests');
    }
  }, []);

  // Search users - memoized with useCallback
  const searchUsers = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/api/friends/search?q=${encodeURIComponent(query)}`);
      setSearchResults(res.data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Send friend request
  const sendFriendRequest = useCallback(async (userId) => {
    try {
      await api.post(`/api/friends/requests/${userId}/send`);
      toast.success('Friend request sent successfully!');
      await fetchPendingRequests();
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error(error.response?.data?.message || 'Failed to send friend request');
    }
  }, [fetchPendingRequests]);

  // Accept friend request
  const acceptFriendRequest = useCallback(async (userId) => {
    try {
      await api.post(`/api/friends/requests/${userId}/accept`);
      toast.success('Friend request accepted!');
      await Promise.all([fetchFriends(), fetchPendingRequests()]);
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error(error.response?.data?.message || 'Failed to accept friend request');
    }
  }, [fetchFriends, fetchPendingRequests]);

  // Reject friend request
  const rejectFriendRequest = useCallback(async (userId) => {
    try {
      await api.post(`/api/friends/requests/${userId}/reject`);
      toast.success('Friend request rejected');
      await fetchPendingRequests();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error(error.response?.data?.message || 'Failed to reject friend request');
    }
  }, [fetchPendingRequests]);

  // Remove friend
  const removeFriend = useCallback(async (userId) => {
    try {
      await api.delete(`/api/friends/connections/${userId}/remove`);
      toast.success('Friend removed');
      await fetchFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error(error.response?.data?.message || 'Failed to remove friend');
    }
  }, [fetchFriends]);

  // Check if user is friend
  const isFriend = useCallback((userId) => {
    return friends.some(friend => friend._id === userId);
  }, [friends]);

  // Check if friend request is pending
  const hasPendingRequest = useCallback((userId) => {
    return pendingRequests.some(request => request._id === userId);
  }, [pendingRequests]);

  // Check if friend request was sent
  const hasSentRequest = useCallback((userId) => {
    return sentRequests.some(request => request._id === userId);
  }, [sentRequests]);

  // Initialize data on mount, only if user is logged in
  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchPendingRequests();
      fetchSentRequests();
    }
  }, [user, fetchFriends, fetchPendingRequests, fetchSentRequests]);

  const value = {
    friends,
    pendingRequests,
    sentRequests,
    searchResults,
    loading,
    fetchFriends,
    fetchPendingRequests,
    fetchSentRequests,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    isFriend,
    hasPendingRequest,
    hasSentRequest
  };

  return (
    <FriendContext.Provider value={value}>
      {children}
    </FriendContext.Provider>
  );
};

export default FriendContext;