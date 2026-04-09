const H3 = ({ children, className = "" }) => {
  return (
    <h3
      className={`text-lg lg:text-2xl font-bold text-slate-900 dark:text-white leading-tight ${className}`}
    >
      {children}
    </h3>
  );
};

export default H3;
