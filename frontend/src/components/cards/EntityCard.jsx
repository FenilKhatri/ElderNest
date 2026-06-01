const EntityCard = ({ children, className = "", onClick, footer }) => {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`flex flex-col h-full min-h-[180px] text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow p-5 ${onClick ? "cursor-pointer hover:border-blue-300 dark:hover:border-blue-700" : ""} ${className}`}
    >
      <div className="flex-1">{children}</div>
      {footer && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">{footer}</div>
      )}
    </Tag>
  );
};

export default EntityCard;
