import Button from "../components/Button";
import { motion } from "framer-motion";

const HeroSection = () => (
  <section className="min-h-[80vh] flex flex-col justify-center items-center bg-[#0D1117] text-center px-4 py-20 snap-start font-inter">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full flex flex-col items-center"
    >
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-[#F2F3F5] font-grotesk">Collaborate. Complete Tasks. Build Trust.</h1>
      <p className="text-lg md:text-2xl text-[#AAB1B8] mb-10 max-w-2xl mx-auto font-medium">A dynamic platform to post, manage, and complete real-world tasks — across any domain. Get things done with clarity, credits, and collaboration.</p>
      <div className="flex gap-4 justify-center">
        <Button className="bg-[#6366F1] text-[#F2F3F5] font-bold rounded-lg px-8 py-3 text-base shadow-[0_4px_24px_0_rgba(99,102,241,0.08)] hover:bg-[#4F46E5] focus:bg-[#4F46E5] border border-[#6366F1]">Post a Task</Button>
        <Button className="bg-[#161B22] text-[#6366F1] font-bold rounded-lg px-8 py-3 text-base shadow-[0_4px_24px_0_rgba(99,102,241,0.08)] border border-[#6366F1] hover:bg-[#1F2937] focus:bg-[#1F2937]">Explore Tasks</Button>
      </div>
    </motion.div>
  </section>
);

export default HeroSection; 