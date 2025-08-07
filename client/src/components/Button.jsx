import { motion } from "framer-motion";

const Button = ({ children, className = "", ...props }) => (
  <motion.button
    className={`cursor-pointer ${className}`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    {...props}
  >
    {children}
  </motion.button>
);

export default Button;  