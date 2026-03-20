const Header = ({ label, title, description, className = "" }) => {
  return (
    <div
      className={`max-w-2xl mx-auto flex flex-col space-y-6 text-center ${className}`}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
        {label}
      </p>
      <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
        {title}
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg leading-8">
        {description}
      </p>
    </div>
  );
};

export default Header;
