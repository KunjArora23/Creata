import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import useTask from "../contexts/useTask.js";
import useAuth from "../contexts/useAuth";
import { motion } from "framer-motion";
import {
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  StopCircle,
  Edit3,
  Star,
  MessageSquare,
  User,
  AlertCircle
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../services/api";

const TaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    tasks,
    requestTask,
    acceptTaskRequest,
    rejectTaskRequest,
    startTask,
    completeTask,
    cancelTask,
    withdrawFromTask,
    extendDeadline,
    addReview
  } = useTask();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showDeadlineForm, setShowDeadlineForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [newDeadline, setNewDeadline] = useState("");
  const [creater, setCreater] = useState(null);
  const [reviews, setReviews] = useState([]);

  const getReviews = async (creatorId) => {
    if (!creatorId) return;

    try {
      const res = await api.get(`/api/tasks/reviews/${creatorId}`);
      console.log(res.data.reviews);
      setReviews(res.data.reviews || []);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get reviews");
      console.log(error);
    }
  }

  useEffect(() => {
    const foundTask = tasks.find(t => t._id === taskId);
    if (foundTask) {
      setTask(foundTask);
      setCreater(foundTask.createdBy);

      // Get reviews after creator is set
      if (foundTask.createdBy?._id) {
        getReviews(foundTask.createdBy._id);
      }
    }
    console.log(foundTask);
    setLoading(false);
  }, [taskId, tasks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#6366F1] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D1117] to-[#161B22] p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-[#F2F3F5] mb-4">Task not found</h1>
          <button
            onClick={() => navigate('/task-board')}
            className="px-6 py-3 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F46E5] transition-colors"
          >
            Back to Task Board
          </button>
        </div>
      </div>
    );
  }

  const isCreator = task.createdBy?._id === user?._id;
  const isAssigned = task.assignedTo?._id === user?._id;
  const hasRequested = task.requests?.some(r => r._id === user?._id);
  const canRequest = task.status === 'open' && !isCreator && !hasRequested;
  const canStart = isCreator && task.status === 'assigned';
  const canComplete = (isCreator || isAssigned) && task.status === 'in_progress';
  const canCancel = isCreator && ['assigned', 'in_progress'].includes(task.status);
  const canWithdraw = isAssigned && ['assigned', 'in_progress'].includes(task.status);

  const handleRequest = async () => {
    try {
      await requestTask(task._id);
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      await acceptTaskRequest(task._id, userId);
    } catch (error) {
      console.error("Accept failed:", error);
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      await rejectTaskRequest(task._id, userId);
    } catch (error) {
      console.error("Reject failed:", error);
    }
  };

  const handleStart = async () => {
    try {
      await startTask(task._id);
    } catch (error) {
      console.error("Start failed:", error);
    }
  };

  const handleComplete = async () => {
    try {
      await completeTask(task._id);
    } catch (error) {
      console.error("Complete failed:", error);
    }
  };

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this task?")) {
      try {
        await cancelTask(task._id);
      } catch (error) {
        console.error("Cancel failed:", error);
      }
    }
  };

  const handleWithdraw = async () => {
    if (window.confirm("Are you sure you want to withdraw from this task?")) {
      try {
        await withdrawFromTask(task._id);
      } catch (error) {
        console.error("Withdraw failed:", error);
      }
    }
  };

  const handleExtendDeadline = async (e) => {
    e.preventDefault();
    try {
      await extendDeadline(task._id, newDeadline);
      setShowDeadlineForm(false);
      setNewDeadline("");
    } catch (error) {
      console.error("Extend deadline failed:", error);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await addReview(task._id, reviewForm, creater);
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: "" });
    } catch (error) {
      console.error("Add review failed:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400';
      case 'assigned': return 'bg-yellow-500/20 text-yellow-400';
      case 'requested': return 'bg-purple-500/20 text-purple-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#0D1117] to-[#161B22] p-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-[#F2F3F5] font-grotesk mb-2">{task.title}</h1>
            <p className="text-[#AAB1B8] text-lg">Task Details</p>
          </div>
          <button
            onClick={() => navigate('/task-board')}
            className="px-6 py-3 bg-[#21262C] text-[#F2F3F5] rounded-xl border border-[#30363D] hover:bg-[#161B22] transition-all"
          >
            Back to Tasks
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Task Info Card */}
            <div className="rounded-2xl border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] p-6 shadow-[0_8px_32px_0_rgba(99,102,241,0.1)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#F2F3F5] font-grotesk">Task Information</h2>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(task.status)}`}>
                  {task.status?.replace('_', ' ')}
                </span>
              </div>

              <p className="text-[#AAB1B8] text-lg leading-relaxed mb-6">{task.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-[#6366F1]" />
                  <div>
                    <div className="text-[#F2F3F5] font-semibold">{task.reward} credits</div>
                    <div className="text-[#AAB1B8] text-sm">Reward</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-[#6366F1]" />
                  <div>
                    <div className="text-[#F2F3F5] font-semibold">
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
                    </div>
                    <div className="text-[#AAB1B8] text-sm">Deadline</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-[#6366F1]" />
                  <div>
                    <div className="text-[#F2F3F5] font-semibold">
                      {task.createdBy?.name || task.createdBy?.email}
                    </div>
                    <div className="text-[#AAB1B8] text-sm">Created by</div>
                  </div>
                </div>

                {task.assignedTo && (
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-[#6366F1]" />
                    <div>
                      <div className="text-[#F2F3F5] font-semibold">
                        {task.assignedTo?.name || task.assignedTo?.email}
                      </div>
                      <div className="text-[#AAB1B8] text-sm">Assigned to</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="rounded-2xl border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] p-6 shadow-[0_8px_32px_0_rgba(99,102,241,0.1)]">
              <h3 className="text-xl font-bold text-[#F2F3F5] font-grotesk mb-4">Actions</h3>
              <div className="flex flex-wrap gap-3">
                {canRequest && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRequest}
                    className="px-4 py-2 bg-[#10B981] text-white rounded-lg font-semibold hover:bg-[#059669] transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Request Task
                  </motion.button>
                )}

                {canStart && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStart}
                    className="px-4 py-2 bg-[#6366F1] text-white rounded-lg font-semibold hover:bg-[#4F46E5] transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start Task
                  </motion.button>
                )}

                {canComplete && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleComplete}
                    className="px-4 py-2 bg-[#10B981] text-white rounded-lg font-semibold hover:bg-[#059669] transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Complete Task
                  </motion.button>
                )}

                {canCancel && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="px-4 py-2 bg-[#EF4444] text-white rounded-lg font-semibold hover:bg-[#DC2626] transition-colors flex items-center gap-2"
                  >
                    <StopCircle className="w-4 h-4" />
                    Cancel Task
                  </motion.button>
                )}

                {canWithdraw && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleWithdraw}
                    className="px-4 py-2 bg-[#F59E0B] text-white rounded-lg font-semibold hover:bg-[#D97706] transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Withdraw
                  </motion.button>
                )}

                {isCreator && task.status !== 'completed' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeadlineForm(!showDeadlineForm)}
                    className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg font-semibold hover:bg-[#7C3AED] transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Extend Deadline
                  </motion.button>
                )}

                {isAssigned && task.status === 'completed' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 bg-[#F97316] text-white rounded-lg font-semibold hover:bg-[#EA580C] transition-colors flex items-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Add Review
                  </motion.button>
                )}
              </div>
            </div>

            {/* Forms */}
            {showDeadlineForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-2xl border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] p-6 shadow-[0_8px_32px_0_rgba(99,102,241,0.1)]"
              >
                <h3 className="text-xl font-bold text-[#F2F3F5] font-grotesk mb-4">Extend Deadline</h3>
                <form onSubmit={handleExtendDeadline} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#AAB1B8] mb-2">New Deadline</label>
                    <input
                      type="date"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-[#6366F1] text-white rounded-xl font-semibold hover:bg-[#4F46E5] transition-colors"
                    >
                      Extend Deadline
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowDeadlineForm(false)}
                      className="px-6 py-3 bg-[#21262C] text-[#F2F3F5] rounded-xl border border-[#30363D] hover:bg-[#161B22] transition-all"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {showReviewForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-2xl border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] p-6 shadow-[0_8px_32px_0_rgba(99,102,241,0.1)]"
              >
                <h3 className="text-xl font-bold text-[#F2F3F5] font-grotesk mb-4">Add Review</h3>
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#AAB1B8] mb-2">Rating</label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
                    >
                      {[5, 4, 3, 2, 1].map(rating => (
                        <option key={rating} value={rating}>{rating} stars</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#AAB1B8] mb-2">Comment</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all resize-none"
                      rows={4}
                      placeholder="Share your experience with this task..."
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-[#6366F1] text-white rounded-xl font-semibold hover:bg-[#4F46E5] transition-colors"
                    >
                      Submit Review
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowReviewForm(false)}
                      className="px-6 py-3 bg-[#21262C] text-[#F2F3F5] rounded-xl border border-[#30363D] hover:bg-[#161B22] transition-all"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Task Requests */}
            {isCreator && task.requests && task.requests.length > 0 && (
              <div className="rounded-2xl border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] p-6 shadow-[0_8px_32px_0_rgba(99,102,241,0.1)]">
                <h3 className="text-xl font-bold text-[#F2F3F5] font-grotesk mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Task Requests ({task.requests.length})
                </h3>
                <div className="space-y-3">
                  {task.requests.map((requester) => (
                    <div key={requester._id} className="p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
                      <div className="text-[#F2F3F5] font-medium mb-2">
                        {requester.name || requester.email}
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAcceptRequest(requester._id)}
                          className="flex-1 px-3 py-1 bg-[#10B981] text-white rounded text-sm font-semibold hover:bg-[#059669] transition-colors"
                        >
                          Accept
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleRejectRequest(requester._id)}
                          className="flex-1 px-3 py-1 bg-[#EF4444] text-white rounded text-sm font-semibold hover:bg-[#DC2626] transition-colors"
                        >
                          Reject
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Task Reviews - Only show to creator */}
            {isCreator && (
              <div className="rounded-2xl border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] p-6 shadow-[0_8px_32px_0_rgba(99,102,241,0.1)]">
                <h3 className="text-xl font-bold text-[#F2F3F5] font-grotesk mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Task Reviews ({reviews?.length || 0})
                </h3>
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <div key={index} className="p-4 bg-[#0D1117] rounded-lg border border-[#30363D]">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[#F2F3F5] font-medium">
                            {review.fromUser?.name || review.fromUser?.email || 'Anonymous'}
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-500'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[#AAB1B8] text-sm">{review.comment}</p>
                        <div className="text-[#6B7280] text-xs mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Star className="w-12 h-12 text-[#6B7280] mx-auto mb-3" />
                    <p className="text-[#AAB1B8]">No reviews yet</p>
                    <p className="text-[#6B7280] text-sm">Reviews will appear here once the task is completed</p>
                  </div>
                )}
              </div>
            )}

            {/* Task Status Info */}
            <div className="rounded-2xl border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] p-6 shadow-[0_8px_32px_0_rgba(99,102,241,0.1)]">
              <h3 className="text-xl font-bold text-[#F2F3F5] font-grotesk mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Status Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#AAB1B8]">Current Status:</span>
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${getStatusColor(task.status)}`}>
                    {task.status?.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#AAB1B8]">Created:</span>
                  <span className="text-[#F2F3F5]">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {task.updatedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#AAB1B8]">Last Updated:</span>
                    <span className="text-[#F2F3F5]">
                      {new Date(task.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskDetails; 