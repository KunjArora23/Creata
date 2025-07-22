import React, { useState } from "react";
import useTask from "../contexts/useTask.js";
import useAuth from "../contexts/useAuth";
import { motion } from "framer-motion";
import { CalendarDays, Plus, Eye, Clock, DollarSign, Users, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TaskCard = ({ task, index }) => {
  const navigate = useNavigate();
  const { requestTask } = useTask();
  const { user } = useAuth();

  const handleRequest = async () => {
    try {
      await requestTask(task._id);
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const handleViewDetails = () => {
    navigate(`/task/${task._id}`);
  };

  return (
    <motion.div
      key={task._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-2xl p-6 border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] shadow-lg hover:shadow-[0_8px_32px_0_rgba(99,102,241,0.2)] transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-[#6366F1]/50"
    >
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
          task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
          task.status === 'assigned' ? 'bg-yellow-500/20 text-yellow-400' :
          task.status === 'requested' ? 'bg-purple-500/20 text-purple-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {task.status?.replace('_', ' ')}
        </span>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-bold text-[#F2F3F5] font-grotesk mb-2 group-hover:text-[#6366F1] transition-colors">
          {task.title}
        </h3>
        <p className="text-[#AAB1B8] text-sm line-clamp-2">{task.description}</p>
      </div>
      
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
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 flex gap-2"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewDetails}
          className="flex-1 px-3 py-2 bg-[#6366F1] text-white rounded-lg text-sm font-semibold hover:bg-[#4F46E5] transition-colors"
        >
          View Details
        </motion.button>
        {task.status === 'open' && task.createdBy?._id !== user?._id && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRequest}
            className="px-3 py-2 bg-[#10B981] text-white rounded-lg text-sm font-semibold hover:bg-[#059669] transition-colors"
          >
            Request
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

const TaskSection = ({ title, tasks, icon: Icon, color }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedTasks = showAll ? tasks : tasks.slice(0, 3);
  const hasMoreTasks = tasks.length > 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#F2F3F5] font-grotesk">{title}</h2>
        <span className="px-3 py-1 bg-[#30363D] text-[#AAB1B8] rounded-full text-sm font-medium">
          {tasks.length}
        </span>
      </div>
      
      {tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 rounded-2xl border-2 border-dashed border-[#30363D] bg-[#161B22]/50"
        >
          <div className="text-[#6366F1] mb-2">
            <Icon className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <p className="text-[#AAB1B8]">No tasks found</p>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedTasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />
            ))}
          </div>
          
          {hasMoreTasks && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex justify-center mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-3 bg-gradient-to-r from-[#21262C] to-[#1F2937] text-[#F2F3F5] rounded-xl font-semibold border border-[#30363D] hover:border-[#6366F1]/50 hover:bg-[#161B22] transition-all flex items-center gap-2 shadow-lg"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="w-5 h-5" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5" />
                    Show More ({tasks.length - 3} more)
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

const CreateTaskForm = ({ showForm, setShowForm, onSubmit, form, setForm, submitting }) => {
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: showForm ? 1 : 0, height: showForm ? "auto" : 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={onSubmit}
          className="mb-8 rounded-2xl border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] p-8 space-y-6 shadow-[0_8px_32px_0_rgba(99,102,241,0.1)]"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-[#F2F3F5] font-grotesk">Create New Task</h3>
            <p className="text-[#AAB1B8] mt-2">Share your task with the community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#AAB1B8] mb-2">
                Task Title
              </label>
              <input
                id="title"
                name="title"
                placeholder="Enter task title"
                className="w-full px-4 py-3 rounded-xl border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] placeholder-[#6B7280] focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="reward" className="block text-sm font-medium text-[#AAB1B8] mb-2">
                Reward (credits)
              </label>
              <input
                id="reward"
                name="reward"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter reward amount"
                className="w-full px-4 py-3 rounded-xl border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] placeholder-[#6B7280] focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
                value={form.reward}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#AAB1B8] mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your task in detail"
              className="w-full px-4 py-3 rounded-xl border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] placeholder-[#6B7280] focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all resize-none"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="deadline" className="block text-sm font-medium text-[#AAB1B8] mb-2">
              Deadline
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              className="w-full px-4 py-3 rounded-xl border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] pr-12 focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all appearance-none"
              value={form.deadline}
              onChange={handleChange}
              required
            />
            <CalendarDays className="absolute right-4 top-10 h-5 w-5 text-[#6366F1] pointer-events-none" />
          </div>

          <div className="flex gap-4 pt-4">
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-[#F2F3F5] rounded-xl font-semibold hover:from-[#4F46E5] hover:to-[#3730A3] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
            >
              {submitting ? "Creating..." : "Create Task"}
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-[#21262C] text-[#F2F3F5] rounded-xl font-semibold border border-[#30363D] hover:bg-[#161B22] transition-all"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </motion.button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
};

const TaskBoard = () => {
  const { tasks, loading, createTask, fetchTasks } = useTask();
  const { user } = useAuth();
  const userId = user?._id;
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", reward: "", deadline: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!form.reward || isNaN(Number(form.reward))) {
        toast.error("Reward must be a number");
        setSubmitting(false);
        return;
      }
      if (!form.deadline) {
        toast.error("Deadline is required");
        setSubmitting(false);
        return;
      }
      await createTask({
        ...form,
        reward: Number(form.reward),
        deadline: new Date(form.deadline)
      });
      toast.success("Task created successfully!");
      setForm({ title: "", description: "", reward: "", deadline: "" });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter tasks by user relationships
  const tasksByOthers = tasks.filter((task) => task.createdBy && task.createdBy._id !== userId);
  const tasksByMe = tasks.filter((task) => task.createdBy && task.createdBy._id === userId);
  const tasksAssignedToMe = tasks.filter((task) => task.assignedTo && task.assignedTo._id === userId);
  const tasksRequestedByMe = tasks.filter((task) => Array.isArray(task.requests) && task.requests.some((u) => u._id === userId));
  const tasksCompletedByMe = tasks.filter(
    (task) =>
      task.status === "completed" &&
      ((task.createdBy && task.createdBy._id === userId) || (task.assignedTo && task.assignedTo._id === userId))
  );

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#0D1117] to-[#161B22] p-4"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-[#F2F3F5] font-grotesk mb-2">Task Board</h1>
            <p className="text-[#AAB1B8]">Manage and discover tasks in the community</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-[#F2F3F5] rounded-xl font-semibold hover:from-[#4F46E5] hover:to-[#3730A3] transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {showForm ? "Cancel" : "Create Task"}
          </motion.button>
        </motion.div>

        <CreateTaskForm
          showForm={showForm}
          setShowForm={setShowForm}
          onSubmit={handleSubmit}
          form={form}
          setForm={setForm}
          submitting={submitting}
        />

        <div className="space-y-12">
          <TaskSection
            title="Tasks Posted by Other Users"
            tasks={tasksByOthers}
            icon={Eye}
            color="bg-blue-500"
          />
          <TaskSection
            title="Tasks Posted by Me"
            tasks={tasksByMe}
            icon={Plus}
            color="bg-green-500"
          />
          <TaskSection
            title="Tasks Assigned to Me"
            tasks={tasksAssignedToMe}
            icon={Users}
            color="bg-yellow-500"
          />
          <TaskSection
            title="Tasks Requested by Me"
            tasks={tasksRequestedByMe}
            icon={Clock}
            color="bg-purple-500"
          />
          <TaskSection
            title="Tasks Completed by Me"
            tasks={tasksCompletedByMe}
            icon={DollarSign}
            color="bg-emerald-500"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TaskBoard;