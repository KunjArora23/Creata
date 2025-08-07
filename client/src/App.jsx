// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { FriendProvider } from "./contexts/FriendContext";
import { ChatProvider } from "./contexts/ChatContext";
import { TaskProvider } from "./contexts/TaskContext";
import { UserProvider } from "./contexts/UserContext";
import { TransactionProvider } from "./contexts/TransactionContext";
import { NotificationProvider } from "./contexts/NotificationContext";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import FriendsList from "./components/FriendsList";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

import TaskDetails from "./pages/TaskDetails";
import ChatUI from "./pages/ChatUI";
import TransactionHistory from "./pages/TransactionHistory";
import NotificationsPanel from "./pages/NotificationsPanel";
import TaskBoard from "./pages/TaskBoard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <FriendProvider>
            <ChatProvider>
              <TaskProvider>
                <TransactionProvider>
                  <NotificationProvider>
                    <div className="App">
                      <Navbar />
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/task-board" element={<ProtectedRoute><TaskBoard /></ProtectedRoute>} />
                        <Route path="/task/:taskId" element={<ProtectedRoute><TaskDetails /></ProtectedRoute>} />

                        {/* ✅ Simplified Friends Route */}
                        <Route path="/friends" element={<ProtectedRoute><FriendsList /></ProtectedRoute>} />

                        <Route path="/chat" element={<ProtectedRoute><ChatUI /></ProtectedRoute>} />
                        <Route path="/chat/:friendId" element={<ProtectedRoute><ChatUI /></ProtectedRoute>} />
                        <Route path="/transactions" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
                        <Route path="/notifications" element={<ProtectedRoute><NotificationsPanel /></ProtectedRoute>} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                      <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        theme="dark"
                      />
                    </div>
                  </NotificationProvider>
                </TransactionProvider>
              </TaskProvider>
            </ChatProvider>
          </FriendProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;