import React from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

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
          
          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#AAB1B8] mb-2">
                Task Title
              </label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] placeholder-[#6B7280] focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
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
                value={form.reward}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] placeholder-[#6B7280] focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
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
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] placeholder-[#6B7280] focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all resize-none"
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
              value={form.deadline}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] pr-12 focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all appearance-none"
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
              onClick={() => setShowForm(false)}
              className="px-6 py-3 bg-[#21262C] text-[#F2F3F5] rounded-xl font-semibold border border-[#30363D] hover:bg-[#161B22] transition-all"
            >
              Cancel
            </motion.button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
};

export default CreateTaskForm;