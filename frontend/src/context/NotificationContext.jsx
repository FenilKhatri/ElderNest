import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead as markNotificationReadApi,
  markAllAsRead as markAllNotificationsReadApi,
} from "../features/notification/api/notification.api";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const res = await getNotifications();
      setNotifications(res?.data?.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    
    try {
      const res = await getUnreadCount();
      setUnreadCount(res?.data?.count || 0);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  }, [user]);

  const refreshNotifications = () => {
    fetchNotifications();
    fetchUnreadCount();
  };

  const markAsRead = async (id) => {
    await markNotificationReadApi(id);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAllAsRead = async () => {
    await markAllNotificationsReadApi();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refreshNotifications,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        setNotifications,
        setUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within <NotificationProvider>");
  return ctx;
};
