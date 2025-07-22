import React from "react";

const NotificationsPanel = () => {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Notifications</h1>
      <div className="bg-white rounded shadow p-4">
        <ul className="space-y-2">
          <li className="flex items-center justify-between">
            <span className="text-gray-700">No notifications yet.</span>
            <button className="px-2 py-1 bg-blue-600 text-white rounded cursor-pointer">Mark as Read</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationsPanel; 