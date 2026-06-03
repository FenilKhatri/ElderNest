import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Trash2, Calendar, Shield, Info, Clock, Loader2 } from "lucide-react";
import { useNotifications } from "../../../context/NotificationContext";
import { markAsRead, deleteNotification } from "../../notification/api/notification.api";
import { formatDate } from "../../../utils/helpers";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import Button from "../../../components/ui/Button";

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, loading, refreshNotifications, unreadCount } = useNotifications();
  const [actionLoading, setActionLoading] = useState(null);

  // Poll notifications when the component is mounted
  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(() => {
      refreshNotifications();
    }, 30000); // 30 seconds polling
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      setActionLoading(id + "-read");
      await markAsRead(id);
      refreshNotifications();
    } catch (error) {
      console.error("Failed to mark as read", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpen = async (notif) => {
    if (!notif.link) return;
    if (!notif.isRead) await handleMarkAsRead(notif._id);
    navigate(notif.link);
  };

  const handleDelete = async (id) => {
    try {
      setActionLoading(id + "-delete");
      await deleteNotification(id);
      refreshNotifications();
    } catch (error) {
      console.error("Failed to delete notification", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "booking":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "system":
        return <Shield className="w-5 h-5 text-amber-500" />;
      case "admin":
        return <Shield className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-500" />
            Notifications
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Stay updated with your latest alerts and booking requests.
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-semibold">
            {unreadCount} Unread
          </div>
        )}
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading && notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Notifications</h3>
            <p className="text-slate-500 dark:text-slate-400">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence>
              {notifications.map((notif) => (
                <motion.div
                  key={notif._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  role={notif.link ? "button" : undefined}
                  tabIndex={notif.link ? 0 : undefined}
                  onClick={() => notif.link && handleOpen(notif)}
                  onKeyDown={(e) => notif.link && e.key === "Enter" && handleOpen(notif)}
                  className={`p-5 transition-colors flex gap-4 w-full text-left ${
                    notif.isRead ? "bg-white dark:bg-slate-900" : "bg-blue-50/50 dark:bg-blue-900/10"
                  } ${notif.link ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50" : ""}`}
                >
                  <div className="mt-1 shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      notif.isRead ? "bg-slate-100 dark:bg-slate-800" : "bg-white dark:bg-slate-800 shadow-sm"
                    }`}>
                      {getIcon(notif.type)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className={`text-base font-semibold ${
                          notif.isRead ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white"
                        }`}>
                          {notif.title}
                        </h4>
                        <p className={`mt-1 text-sm ${
                          notif.isRead ? "text-slate-500 dark:text-slate-400" : "text-slate-700 dark:text-slate-300"
                        }`}>
                          {notif.message}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      {!notif.isRead && (
                        <Button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notif._id); }}
                          disabled={actionLoading === notif._id + "-read"}
                        >
                          {actionLoading === notif._id + "-read" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Mark as Read
                        </Button>
                      )}
                      <Button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDelete(notif._id); }}
                        variant="outline"
                        disabled={actionLoading === notif._id + "-delete"}
                      >
                        {actionLoading === notif._id + "-delete" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Notifications;
