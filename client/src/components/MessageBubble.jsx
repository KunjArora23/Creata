import React from 'react';
import { motion } from 'framer-motion';

const MessageBubble = ({ message, isOwn, formatTime }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
  >
    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isOwn
      ? 'bg-[#6366F1] text-white rounded-br-md'
      : 'bg-[#1F2937] text-[#F2F3F5] rounded-bl-md'
      }`}>
      <p className="text-sm break-words">{message.content}</p>
      <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-[#AAB1B8]'
        }`}>
        {formatTime(message.timestamp)}
      </p>
    </div>
  </motion.div>
);

export default MessageBubble; 