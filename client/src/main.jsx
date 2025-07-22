import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { TaskProvider } from "./contexts/TaskContext";
import { FriendProvider } from "./contexts/FriendContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { TransactionProvider } from "./contexts/TransactionContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>


    <App />


  </React.StrictMode>
);
