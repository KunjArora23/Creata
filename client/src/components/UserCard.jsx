import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  UserX,
  Check,
  X,
  UserCheck,
  Clock,
  UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useFriend from '../contexts/useFriend.js';

const UserCard = React.memo(({ user, type }) => {
  const navigate = useNavigate();
  const {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    isFriend,
    hasPendingRequest,
  } = useFriend();

  const handleSendRequest = async () => {
    try {
      await sendFriendRequest(user._id);
    } catch (error) {
      console.error('Failed to send request:', error);
    }
  };

  const handleAcceptRequest = async () => {
    try {
      await acceptFriendRequest(user._id);
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleRejectRequest = async () => {
    try {
      await rejectFriendRequest(user._id);
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await removeFriend(user._id);
    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };

  const handleMessage = () => {
    navigate(`/chat/${user._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#161B22] to-[#1F2937] border border-[#30363D] rounded-xl p-4 hover:border-[#6366F1]/50 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#6366F1] flex items-center justify-center text-white font-bold text-lg">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            user.name?.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-[#F2F3F5]">{user.name}</h3>
          <p className="text-sm text-[#AAB1B8]">{user.email}</p>
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {user.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[#6366F1]/20 text-[#6366F1] text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {type === 'friend' && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMessage}
                className="p-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F46E5] transition-colors"
                title="Send Message"
              >
                <MessageSquare className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRemoveFriend}
                className="p-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors"
                title="Remove Friend"
              >
                <UserX className="w-4 h-4" />
              </motion.button>
            </>
          )}

          {type === 'search' && (
            <>
              {isFriend(user._id) ? (
                <div className="p-2 bg-[#10B981] text-white rounded-lg" title="Already Friends">
                  <UserCheck className="w-4 h-4" />
                </div>
              ) : hasPendingRequest(user._id) ? (
                <div className="p-2 bg-[#F59E0B] text-white rounded-lg" title="Request Pending">
                  <Clock className="w-4 h-4" />
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendRequest}
                  className="p-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                  title="Send Request"
                >
                  <UserPlus className="w-4 h-4" />
                </motion.button>
              )}
            </>
          )}

          {type === 'request' && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAcceptRequest}
                className="p-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors"
                title="Accept"
              >
                <Check className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRejectRequest}
                className="p-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors"
                title="Reject"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default UserCard;