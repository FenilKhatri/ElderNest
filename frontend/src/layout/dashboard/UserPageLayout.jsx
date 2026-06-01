import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * Shared shell for user dashboard pages — consistent premium layout.
 */
const UserPageLayout = ({ title, description, backTo, backLabel = "Back", action, children }) => (
  <div className="min-h-[calc(100vh-5rem)] bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-site-wide mx-auto">
      {backTo && (
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
          {description && (
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm p-6 sm:p-8">
        {children}
      </div>
    </div>
  </div>
);

export default UserPageLayout;
