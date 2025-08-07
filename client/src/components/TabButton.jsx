import React from 'react';
import { motion } from 'framer-motion';

const TabButton = ({ tab, icon: Icon, label, count, activeTab, setActiveTab }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => setActiveTab(tab)}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
      activeTab === tab
        ? 'bg-[#6366F1] text-white'
        : 'bg-[#21262C] text-[#F2F3F5] hover:bg-[#161B22]'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
    {count > 0 && (
      <span className="bg-white/20 text-white text-xs rounded-full px-2 py-1">
        {count}
      </span>
    )}
  </motion.button>
);

export default TabButton;