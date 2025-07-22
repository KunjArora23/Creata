import React from "react";
import useTask from "../contexts/useTask.js";
import useNotification from "../contexts/useNotification.js";
import useTransaction from "../contexts/useTransaction.js";
import { motion } from "framer-motion";
import { DollarSign, Clock, Bell, TrendingUp } from "lucide-react";
import useAuth from "../contexts/useAuth";

const Dashboard = () => {
  const { tasks, loading: tasksLoading } = useTask();
  const { notifications, loading: notificationsLoading } = useNotification();
  const { transactions, loading: transactionsLoading } = useTransaction();

  // Calculate credits from transactions (sum of all credits)
  const {user}=useAuth();
  


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-[#0D1117] to-[#161B22] p-4"
    >
      <div className="max-w-6xl mx-auto space-y-8 font-inter">
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#F2F3F5] font-grotesk mb-2">Dashboard</h1>
          <p className="text-[#AAB1B8]">Welcome back! Here's your overview</p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="rounded-2xl p-6 border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] shadow-lg hover:shadow-[0_8px_32px_0_rgba(99,102,241,0.2)] transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-[#F2F3F5] font-grotesk">Total Credits</h2>
            </div>
            {transactionsLoading ? (
              <div className="text-[#AAB1B8]">Loading...</div>
            ) : (
              <div className="text-3xl font-bold text-[#6366F1]">{user?.credits}</div>
            )}
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="rounded-2xl p-6 border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] shadow-lg hover:shadow-[0_8px_32px_0_rgba(99,102,241,0.2)] transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-[#F2F3F5] font-grotesk">Active Tasks</h2>
            </div>
            {tasksLoading ? (
              <div className="text-[#AAB1B8]">Loading...</div>
            ) : (
              <div className="text-3xl font-bold text-[#6366F1]">
                {tasks.filter(t => t.status === 'in_progress' || t.status === 'assigned').length}
              </div>
            )}
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="rounded-2xl p-6 border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] shadow-lg hover:shadow-[0_8px_32px_0_rgba(99,102,241,0.2)] transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Bell className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-[#F2F3F5] font-grotesk">Notifications</h2>
            </div>
            {notificationsLoading ? (
              <div className="text-[#AAB1B8]">Loading...</div>
            ) : (
              <div className="text-3xl font-bold text-[#6366F1]">{notifications.length}</div>
            )}
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl p-6 border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <h2 className="text-xl font-semibold text-[#F2F3F5] font-grotesk">Recent Tasks</h2>
            </div>
            {tasksLoading ? (
              <div className="text-[#AAB1B8]">Loading...</div>
            ) : tasks.length === 0 ? (
              <div className="text-[#AAB1B8]">No tasks yet.</div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {tasks.slice(0, 5).map((task, index) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#0D1117] border border-[#30363D] hover:border-[#6366F1]/50 transition-colors"
                    >
                      <div>
                        <div className="text-[#F2F3F5] font-medium">{task.title || task.name}</div>
                        <div className="text-sm text-[#AAB1B8]">{task.status}</div>
                      </div>
                      <div className="text-[#6366F1] font-semibold">{task.reward} credits</div>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = '/task-board'}
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-[#F2F3F5] rounded-xl font-semibold hover:from-[#4F46E5] hover:to-[#3730A3] transition-all shadow-lg"
                >
                  View All Tasks
                </motion.button>
              </>
            )}
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl p-6 border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <Bell className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-[#F2F3F5] font-grotesk">Recent Notifications</h2>
            </div>
            {notificationsLoading ? (
              <div className="text-[#AAB1B8]">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="text-[#AAB1B8]">No notifications yet.</div>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 5).map((n, index) => (
                  <motion.div
                    key={n._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D] hover:border-[#6366F1]/50 transition-colors"
                  >
                    <div className="text-[#F2F3F5] text-sm">{n.message || n.title}</div>
                    <div className="text-xs text-[#AAB1B8] mt-1">
                      {new Date(n.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard; 