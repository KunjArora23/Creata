import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useFriend from '../contexts/useFriend.js';
import { Search, UserPlus, Users } from 'lucide-react';
import TabButton from './TabButton.jsx';
import UserCard from './UserCard.jsx';

function FriendsList() {
  const {
    friends,
    pendingRequests,
    searchResults,
    loading,
    searchUsers,
  } = useFriend();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('friends');

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length > 2 || searchQuery.trim().length === 0) {
        searchUsers(searchQuery);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchUsers]);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'friends':
        return friends.length > 0 ? (
          friends.map((user) => (
            <UserCard key={user._id} user={user} type="friend" />
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            You don't have any friends yet. Search for users to add friends!
          </div>
        );
      case 'search':
        return (
          <>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full p-3 mb-4 rounded-lg bg-[#1F2937] text-white border border-[#30363D]"
            />
            {loading ? (
              <div className="text-center py-8 text-gray-400">Searching...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <UserCard key={user._id} user={user} type="search" />
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                {searchQuery ? 'No users found' : 'Start typing to search for users'}
              </div>
            )}
          </>
        );
      case 'requests':
        return pendingRequests.length > 0 ? (
          pendingRequests.map((user) => (
            <UserCard key={user._id} user={user} type="request" />
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            You don't have any pending friend requests
          </div>
        );
      default:
        return null;
    }
  }, [activeTab, friends, searchResults, pendingRequests, searchQuery, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] to-[#161B22] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#F2F3F5] font-grotesk mb-2">Friends</h1>
          <p className="text-[#AAB1B8]">Connect with others and manage your network</p>
        </div>

        <div className="flex gap-4 mb-8 justify-center">
          <TabButton 
            tab="friends" 
            icon={Users} 
            label="Friends" 
            count={friends.length} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          <TabButton 
            tab="search" 
            icon={Search} 
            label="Search" 
            count={0} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          <TabButton 
            tab="requests" 
            icon={UserPlus} 
            label="Requests" 
            count={pendingRequests.length} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        </div>

        <div className="grid gap-4">
          {tabContent}
        </div>
      </div>
    </div>
  );
}

export default React.memo(FriendsList);