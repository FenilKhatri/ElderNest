const CardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-6 shadow-sm animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
      <div className="mt-5 h-5 w-40 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-4 space-y-3">
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-4/6 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
};

export default CardSkeleton;