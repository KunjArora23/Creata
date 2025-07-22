import Button from "../components/Button";
import { motion } from "framer-motion";

const CallToActionSection = () => (
  <section className="py-20 px-4 text-center snap-start bg-[#161B22] font-inter">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.7 }}
      transition={{ duration: 0.7 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#F2F3F5] font-grotesk">Start managing or completing tasks the better way.</h2>
      <div className="flex gap-4 justify-center mt-6 max-w-2xl mx-auto">
        <Button className="bg-[#6366F1] text-[#F2F3F5] font-bold rounded-lg px-8 py-3 text-base shadow-[0_4px_24px_0_rgba(99,102,241,0.08)] hover:bg-[#4F46E5] focus:bg-[#4F46E5] border border-[#6366F1]">Get Started for Free</Button>
        <Button className="bg-[#1F2937] text-[#6366F1] font-bold rounded-lg px-8 py-3 text-base shadow-[0_4px_24px_0_rgba(99,102,241,0.08)] border border-[#6366F1] hover:bg-[#161B22] focus:bg-[#161B22]">Browse Open Tasks</Button>
      </div>
    </motion.div>
  </section>
);

export default CallToActionSection; 