import SectionTitle from "../components/SectionTitle";
import { motion } from "framer-motion";

const AboutSection = () => (
  <section className="py-24 px-4 bg-[#0D1117] snap-start font-inter">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.7 }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl mx-auto bg-[#161B22] rounded-3xl shadow-[0_4px_24px_0_rgba(99,102,241,0.08)] border border-[#30363D] p-10 flex flex-col items-center"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-block w-10 h-10 rounded-full bg-[#6366F1] flex items-center justify-center">
          <svg className="w-6 h-6 text-[#F2F3F5]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
        </span>
        <SectionTitle className="text-3xl font-extrabold text-[#F2F3F5] mb-0 font-grotesk">What is CredMate?</SectionTitle>
      </div>
      <p className="mb-5 text-lg text-[#F2F3F5] font-semibold text-center">CredMate is a trust-driven task collaboration platform where individuals and teams can:</p>
      <ul className="list-disc list-inside text-left mb-5 text-[#AAB1B8] space-y-1">
        <li>Post tasks across any category — tech, design, content, research, or operations</li>
        <li>Collaborate efficiently with contributors</li>
        <li>Use an escrow-based credit system for secure task handling</li>
        <li>Build a verifiable profile based on real contributions and feedback</li>
      </ul>
      <div className="w-12 border-t-2 border-[#6366F1] my-4" />
      <p className="text-[#6B7280] text-center">Whether you're an entrepreneur, creator, freelancer, or just someone who needs help — our platform makes delegation and collaboration seamless and accountable.</p>
    </motion.div>
  </section>
);

export default AboutSection; 