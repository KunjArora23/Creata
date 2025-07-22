import SectionTitle from "../components/SectionTitle";
import Icon from "../components/Icon";
import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="#6366F1" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
    ),
    title: "Open Task Marketplace",
    desc: "Explore or post tasks publicly"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="#6366F1" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" /></svg>
    ),
    title: "Multi-domain Support",
    desc: "From coding to content to creative work"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="#6366F1" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>
    ),
    title: "Escrow Credit System",
    desc: "Fair & secure value exchange"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="#6366F1" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
    ),
    title: "Reputation System",
    desc: "Build trust through verified contributions"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="#6366F1" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /></svg>
    ),
    title: "Real-time Messaging",
    desc: "Communicate and collaborate in real time"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="#6366F1" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 3v4M16 3v4" /></svg>
    ),
    title: "Contribution Records",
    desc: "Maintain a provable work history"
  }
];

const FeaturesSection = () => (
  <section className="py-20 px-4 snap-start bg-[#0D1117] font-inter">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7 }}
    >
      <SectionTitle className="mb-12 text-4xl font-extrabold text-[#6366F1] text-center font-grotesk">Features</SectionTitle>
    </motion.div>
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          className="rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_4px_24px_0_rgba(99,102,241,0.08)] border border-[#30363D] bg-[#161B22] hover:shadow-[0_4px_24px_0_rgba(99,102,241,0.16)] transition-all duration-300 cursor-pointer"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: i * 0.12 }}
        >
          <div className="mb-4 flex items-center justify-center rounded-full bg-[#1F2937] shadow p-4">
            <Icon>{f.icon}</Icon>
          </div>
          <div className="font-bold text-xl mb-2 text-[#F2F3F5] font-grotesk">{f.title}</div>
          <div className="text-base text-[#AAB1B8] font-inter">{f.desc}</div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default FeaturesSection; 