import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import AuthContext from './AuthContext';

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const { user } = React.useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/tasks/all");
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (data) => {
    try {
      const res = await api.post("/api/tasks/create", data);
      toast.success("Task created successfully!");
      await fetchTasks();
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
      throw error;
    }
  };

  const requestTask = async (taskId) => {
    try {
      const res = await api.post(`/api/tasks/${taskId}/request`);
      toast.success("Task request sent successfully!");
      await fetchTasks();
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to request task");
      throw error;
    }
  };

  const acceptTaskRequest = async (taskId, userId) => {
    try {
      const res = await api.post(`/api/tasks/${taskId}/accept/${userId}`);
      toast.success("Task request accepted!");
      await fetchTasks();
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept request");
      throw error;
    }
  };

  const rejectTaskRequest = async (taskId, userId) => {
    try {
      const res = await api.post(`/api/tasks/${taskId}/reject/${userId}`);
      toast.success("Task request rejected!");
      await fetchTasks();
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
      throw error;
    }
  };

  const startTask = async (taskId) => {
    try {
      const res = await api.post(`/api/tasks/${taskId}/start`);
      toast.success("Task started! Credits moved to escrow.");
      await fetchTasks();
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to start task");
      throw error;
    }
  };

  const extendDeadline = async (taskId, newDeadline) => {
    try {
      const res = await api.patch(`/api/tasks/${taskId}/extend`, { newDeadline });
      toast.success("Deadline extended successfully!");
      await fetchTasks();
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to extend deadline");
      throw error;
    }
  };

  const completeTask = async (taskId, confirmation = true) => {
    try {
      const res = await api.post(`/api/tasks/${taskId}/complete`, { confirmation });
      if (res.data.status === 'completed') {
        toast.success("Task completed! Credits released.");
      } else {
        toast.success("Completion confirmation recorded!");
      }
      await fetchTasks();
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete task");
      throw error;
    }
  };

  const cancelTask = async (taskId) => {
    try {
      const res = await api.post(`/api/tasks/${taskId}/cancel`);
      toast.success("Task cancelled! Credits refunded.");
      await fetchTasks();
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel task");
      throw error;
    }
  };

  const withdrawFromTask = async (taskId) => {
    try {
      const res = await api.post(`/api/tasks/${taskId}/withdraw`);
      toast.success("Withdrawn from task successfully!");
      await fetchTasks();
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to withdraw from task");
      throw error;
    }
  };

  const addReview = async (taskId, reviewData,creater) => {
    try {
      const res = await api.post(`/api/tasks/${taskId}/review`, {toUser:creater._id, ...reviewData});
      toast.success("Review added successfully!");
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add review");
      throw error;
    }
  };

  const getUserReviews = async (userId) => {
    try {
      const res = await api.get(`/api/tasks/reviews/${userId}`);
      setReviews(res.data.reviews || []);
      return res;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      throw error;
    }
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      loading, 
      reviews,
      fetchTasks, 
      createTask,
      requestTask,
      acceptTaskRequest,
      rejectTaskRequest,
      startTask,
      extendDeadline,
      completeTask,
      cancelTask,
      withdrawFromTask,
      addReview,
      getUserReviews
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export { TaskProvider };
export default TaskContext; 