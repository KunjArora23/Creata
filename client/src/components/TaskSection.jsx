import React, { useState } from "react";
import { motion } from "framer-motion";
import TaskCard from "./TaskCard.jsx";
import { ChevronDown, ChevronUp } from "lucide-react";

const TaskSection = ({ title, tasks, icon: Icon, color, onRequest }) => {
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
              <TaskCard 
                key={task._id} 
                task={task} 
                index={index} 
                onRequest={onRequest ? () => onRequest(task._id) : null}
              />
            ))}
          </div>
          
         
          {hasMoreTasks && (
            <motion.div className="flex justify-center mt-8">
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

export default TaskSection;