import SectionTitle from "../components/SectionTitle";
import { motion } from "framer-motion";

const steps = [
  "Post a task with clear expectations",
  "Let contributors request or get assigned",
  "Complete the task collaboratively",
  "Approve and transfer credits",
  "Build your trust score and work history"
];

const HowItWorksSection = () => (
  <section className="py-20 px-4 snap-start bg-[#0D1117] font-inter">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7 }}
    >
      <SectionTitle className="mb-10 text-[#6366F1] text-3xl font-extrabold text-center font-grotesk">How It Works</SectionTitle>
    </motion.div>
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          className="rounded-2xl p-7 flex flex-col items-center text-center hover:shadow-[0_4px_24px_0_rgba(99,102,241,0.16)] transition-all duration-300 cursor-pointer border border-[#30363D] bg-[#161B22] text-[#F2F3F5] font-semibold"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: i * 0.10 }}
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full mb-2 bg-[#6366F1] text-[#F2F3F5] font-bold font-grotesk">{i + 1}</div>
          <div className="text-sm font-semibold text-[#AAB1B8] font-inter">{step}</div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default HowItWorksSection; 