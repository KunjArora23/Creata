import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, DollarSign, Eye, Plus, Users } from "lucide-react";
import { toast } from "react-toastify";
import useTask from "../contexts/useTask";
import useAuth from "../contexts/useAuth";
import TaskSection from "../components/TaskSection.jsx";
import CreateTaskForm from "../components/CreateTaskForm.jsx";

const TaskBoard = () => {
  const { tasks, loading, createTask, fetchTasks, requestTask } = useTask();
  const { user } = useAuth();
  const userId = user?._id;
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    reward: "", 
    deadline: "" 
  });
  const [submitting, setSubmitting] = useState(false);


  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  const tasksByOthers = tasks
    .filter(task => {
     
      if (task.createdBy?._id === userId) return false;
      
     
      if (task.deadline) {
        const taskDeadline = new Date(task.deadline);
        taskDeadline.setHours(0, 0, 0, 0); 
        return taskDeadline >= currentDate;
      }
      
      return false; // Exclude tasks without deadline
    })
    .sort((a, b) => {
      // Sort by most recent first (newest tasks at the top)
      const dateA = new Date(a.createdAt || a.updatedAt || 0);
      const dateB = new Date(b.createdAt || b.updatedAt || 0);
      return dateB - dateA;
    });
    
  const tasksByMe = tasks.filter(task => task.createdBy?._id === userId);
  const tasksAssignedToMe = tasks.filter(task => task.assignedTo?._id === userId);
  const tasksRequestedByMe = tasks.filter(task => 
    Array.isArray(task.requests) && task.requests.some(u => u._id === userId)
  );
  const tasksCompletedByMe = tasks.filter(task => 
    task.status === "completed" && 
    (task.createdBy?._id === userId || task.assignedTo?._id === userId)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
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

  const handleRequestTask = async (taskId) => {
    try {
      await requestTask(taskId);
      toast.success("Task request sent!");
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to request task");
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] to-[#161B22] p-4">
      <div className="max-w-7xl mx-auto">
      
        <div className="flex items-center justify-between mb-8">
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
        </div>

       
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
            onRequest={handleRequestTask}
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
    </div>
  );
};

export default TaskBoard;