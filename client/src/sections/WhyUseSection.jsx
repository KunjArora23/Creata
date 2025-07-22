import SectionTitle from "../components/SectionTitle";
import { motion } from "framer-motion";

const benefits = [
  "Post or complete tasks without middlemen",
  "Escrow system ensures fair handling",
  "Great for solo professionals, small teams, creators, or communities",
  "Track contributions, credits, and trust — all in one place",
  "Work across categories: tech, writing, design, marketing, research, admin & more"
];

const WhyUseSection = () => (
  <section className="py-20 px-4 snap-start bg-[#0D1117] font-inter">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7 }}
    >
      <SectionTitle className="mb-10 text-[#6366F1] text-3xl font-extrabold text-center font-grotesk">Why Use This Platform?</SectionTitle>
    </motion.div>
    <ul className="max-w-3xl mx-auto text-lg space-y-4 rounded-2xl p-10 bg-[#161B22] shadow-[0_4px_24px_0_rgba(99,102,241,0.08)] border border-[#30363D] text-[#AAB1B8]">
      {benefits.map((b, i) => (
        <motion.li
          key={i}
          className="flex items-start gap-3"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: i * 0.10 }}
        >
          <span className="w-3 h-3 mt-2 rounded-full bg-[#6366F1]"></span>
          <span className="text-[#F2F3F5] font-inter">{b}</span>
        </motion.li>
      ))}
    </ul>
  </section>
);

export default WhyUseSection; 