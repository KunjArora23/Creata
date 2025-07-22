const Icon = ({ children, className = "", ...props }) => (
  <span className={`inline-flex items-center justify-center ${className}`} {...props}>
    {children}
  </span>
);

export default Icon; 