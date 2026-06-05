import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const UserPageLayout = ({ title, description, backTo, backLabel = "Back", action, children }) => (
  <div className="min-h-[calc(100vh-5rem)] bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
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
      {children}
    </div>
  </div>
);

export default UserPageLayout;