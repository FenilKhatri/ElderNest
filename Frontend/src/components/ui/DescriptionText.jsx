const Descriptiontext = ({ children, className = "" }) => {
  return (
    <p
      className={`max-w-lg mx-auto text-slate-600 dark:text-slate-400 text-lg leading-8 ${className}`}
    >
      {children}
    </p>
  );
};

export default Descriptiontext;
