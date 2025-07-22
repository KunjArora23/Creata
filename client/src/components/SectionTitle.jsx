import { motion } from "framer-motion";

const SectionTitle = ({ children, className = "" }) => (
  <motion.h2
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.6 }}
    transition={{ duration: 0.6 }}
    className={`text-3xl md:text-4xl font-bold mb-6 text-center ${className}`}
  >
    {children}
  </motion.h2>
);

export default SectionTitle; 