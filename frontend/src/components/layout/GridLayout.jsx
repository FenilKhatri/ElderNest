const GridLayout = ({ children, className = "" }) => (
  <div
    className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 ${className}`}
  >
    {children}
  </div>
);

export const GridSkeleton = ({ count = 6 }) => (
  <GridLayout>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="h-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 animate-pulse"
      />
    ))}
  </GridLayout>
);

export default GridLayout;
