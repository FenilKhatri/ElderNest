const Descriptiontext = ({ children, className = "", center = true }) => {
  return (
    <p
      className={`max-w-lg ${center ? "mx-auto" : ""} text-slate-600 dark:text-slate-400 text-lg leading-8 ${className}`}
    >
      {children}
    </p>
  );
};

export default Descriptiontext;
