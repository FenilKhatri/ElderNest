import { useEffect } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../../../context/NotificationContext";
import EmptyState from "../../../components/ui/EmptyState";
import { formatDateTime } from "../../../utils/helpers";
import { Link, useNavigate } from "react-router-dom";
import UserPageLayout from "../../../layout/dashboard/UserPageLayout";

const UserNotifications = () => {
  const navigate = useNavigate();
  const { notifications, loading, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <UserPageLayout
      title="Notifications"
      description="Booking updates and care activity"
      action={
        notifications?.length > 0 ? (
          <button type="button" onClick={markAllAsRead} className="text-sm font-medium text-blue-600 hover:underline">
            Mark all read
          </button>
        ) : null
      }
    >
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
      ) : notifications?.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n._id}
              role={n.link ? "button" : undefined}
              tabIndex={n.link ? 0 : undefined}
              onClick={() => {
                if (!n.link) return;
                if (!n.isRead) markAsRead(n._id);
                navigate(n.link);
              }}
              className={`rounded-xl border p-4 transition-colors ${
                n.isRead
                  ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
              } ${n.link ? "cursor-pointer hover:border-blue-400" : ""}`}
            >
              <div className="flex justify-between gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{n.title}</h3>
                <span className="text-xs text-slate-500 shrink-0">{formatDateTime(n.createdAt)}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{n.message}</p>
              <div className="flex gap-3 mt-3">
                {n.link && (
                  <Link to={n.link} className="text-xs font-medium text-blue-600 hover:underline" onClick={() => !n.isRead && markAsRead(n._id)}>
                    View
                  </Link>
                )}
                {!n.isRead && (
                  <button type="button" onClick={() => markAsRead(n._id)} className="text-xs text-slate-500 hover:underline">
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </UserPageLayout>
  );
};

export default UserNotifications;
