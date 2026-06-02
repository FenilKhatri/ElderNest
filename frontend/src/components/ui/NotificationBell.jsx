import React, { useRef, useEffect, useState } from "react";
import { Bell, Check, ExternalLink } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { formatTimeAgo } from "../../utils/helpers";
import { AnimatePresence, motion } from "framer-motion";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    setIsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    markAllAsRead();
                    setIsOpen(false);
                  }}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto overscroll-contain">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  <Bell className="w-8 h-8 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors ${
                        !notification.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium text-slate-900 dark:text-white ${!notification.isRead ? "font-bold" : ""}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-slate-500 dark:text-slate-500">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            {notification.link && (
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                View <ExternalLink className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 mt-1.5 shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
