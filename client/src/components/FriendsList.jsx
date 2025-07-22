import React from 'react';

function FriendsList({ friends, onSelect }) {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Friends</h2>
      {friends.length === 0 ? (
        <div className="text-center text-gray-400">No friends to show.</div>
      ) : (
        <ul className="space-y-2">
          {friends.map(friend => (
            <li key={friend._id}>
              <button
                className="w-full flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-indigo-600 transition-colors text-left"
                onClick={() => onSelect(friend._id)}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {friend.avatarUrl ? (
                    <img src={friend.avatarUrl} alt={friend.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    friend.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="font-semibold text-white">{friend.name}</div>
                  <div className="text-xs text-gray-400">{friend.status || 'Offline'}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FriendsList; 