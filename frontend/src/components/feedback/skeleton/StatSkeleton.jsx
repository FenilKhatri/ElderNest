const StatSkeleton = () => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 animate-pulse">
      <div className="h-8 w-20 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-3 h-4 w-28 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
};

export default StatSkeleton;