import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, DollarSign, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../contexts/useAuth";

const TaskCard = ({ task, index, onRequest }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleViewDetails = () => {
    navigate(`/task/${task._id}`);
  };

  // Check if current user has requested this task
  const hasRequested = task.requests?.some(request => 
    request._id === user?._id || request.toString() === user?._id
  );

  // Determine what status to display
  const displayStatus = () => {
    if (hasRequested) return 'requested';
    if (task.status === 'requested' && !hasRequested) return 'open';
    return task.status;
  };

  // Check if request button should be shown
  const showRequestButton = () => {
    // Don't show if user created the task
    if (task.createdBy?._id === user?._id) return false;
    
    // Only show if task is open or requested (and user hasn't already requested)
    const isOpenForRequests = ['open', 'requested'].includes(task.status);
    return isOpenForRequests && !hasRequested;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-2xl p-6 border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] shadow-lg hover:shadow-[0_8px_32px_0_rgba(99,102,241,0.2)] transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-[#6366F1]/50"
    >
      {/* Status badge - shows 'requested' if current user has requested */}
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          displayStatus() === 'completed' ? 'bg-green-500/20 text-green-400' :
          displayStatus() === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
          displayStatus() === 'assigned' ? 'bg-yellow-500/20 text-yellow-400' :
          displayStatus() === 'requested' ? 'bg-purple-500/20 text-purple-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {displayStatus()?.replace('_', ' ')}
        </span>
      </div>
      
      {/* Task content */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-[#F2F3F5] font-grotesk mb-2 group-hover:text-[#6366F1] transition-colors">
          {task.title}
        </h3>
        <p className="text-[#AAB1B8] text-sm line-clamp-2">{task.description}</p>
      </div>
      
      {/* Task details */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[#6366F1]">
          <DollarSign className="w-4 h-4" />
          <span className="text-sm font-semibold">{task.reward} credits</span>
        </div>
        
        <div className="flex items-center gap-2 text-[#AAB1B8]">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
          </span>
        </div>
        
        {task.createdBy && (
          <div className="flex items-center gap-2 text-[#AAB1B8]">
            <Users className="w-4 h-4" />
            <span className="text-sm">Posted by {task.createdBy.name || task.createdBy.email}</span>
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <motion.div className="mt-4 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewDetails}
          className="flex-1 px-3 py-2 bg-[#6366F1] text-white rounded-lg text-sm font-semibold hover:bg-[#4F46E5] transition-colors"
        >
          View Details
        </motion.button>
        
        {showRequestButton() && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRequest}
            className="px-3 py-2 bg-[#10B981] text-white rounded-lg text-sm font-semibold hover:bg-[#059669] transition-colors"
          >
            Request
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TaskCard;