import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import errorHandler from './middlewares/error.middleware.js';
import notFound from './middlewares/notFound.middleware.js';
import http from 'http';
import initSocket from './socket/socket.js';

// Import routes
import authRoutes from './routes/user/auth.routes.js';
import profileRoutes from './routes/user/profile.routes.js';
import friendRoutes from './routes/user/friend.routes.js';
import taskRoutes from './routes/user/task.routes.js';
import creditRoutes from './routes/user/creditRoutes.js';
import disputeRoutes from './routes/user/disputeRoutes.js';
import adminDisputeRoutes from './routes/admin/disputeAdminRoutes.js';
import messageRoutes from './routes/user/message.routes.js';
import notificationRoutes from './routes/user/notification.routes.js';

import cors from 'cors';
dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());
console.log(process.env.FRONTEND_URL);
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}))

// Health check route
app.get('/api/ping', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Creata API is running! 🚀',
    timestamp: new Date().toISOString()
  });
});

// user Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);


// admin routes
app.use('/api/admin', adminDisputeRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware ye error handle karega
app.use(errorHandler);

// Connect to MongoDB
connectDB();


const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Credmate server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/ping`);
}); 