export const ListLayout = ({ children, className = "" }) => (
  <div className={`flex flex-col gap-4 ${className}`}>
    {children}
  </div>
);

export const ListSkeleton = ({ count = 4 }) => (
  <div className="flex flex-col gap-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
    ))}
  </div>
);

export default ListLayout;
