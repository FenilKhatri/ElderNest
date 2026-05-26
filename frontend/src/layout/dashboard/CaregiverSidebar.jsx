import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Calendar,
  BookOpen,
  Bell,
  Settings,
  FileText,
  BarChart3,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { fadeUp } from "../../animations/motionVariants";

const CaregiverSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/caregiver/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Profile",
      href: "/caregiver/profile",
      icon: User,
    },
    {
      name: "Availability",
      href: "/caregiver/availability",
      icon: Calendar,
      disabled: !user?.profileCompleted,
    },
    {
      name: "Bookings",
      href: "/caregiver/bookings",
      icon: BookOpen,
      disabled: !user?.profileCompleted,
    },
    {
      name: "Notifications",
      href: "/caregiver/notifications",
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      name: "Documents",
      href: "/caregiver/documents",
      icon: FileText,
    },
    {
      name: "Analytics",
      href: "/caregiver/analytics",
      icon: BarChart3,
      disabled: !user?.profileCompleted,
    },
    {
      name: "Settings",
      href: "/caregiver/settings",
      icon: Settings,
    },
  ];

  const handleNavigation = (href, disabled) => {
    if (disabled) return;
    navigate(href);
    onClose();
  };

  const getProfileStatus = () => {
    if (!user?.isApproved) {
      return {
        status: "Pending Approval",
        icon: Clock,
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-50 dark:bg-amber-900/20",
      };
    }
    
    if (!user?.profileCompleted) {
      return {
        status: "Complete Profile",
        icon: AlertCircle,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-900/20",
      };
    }

    return {
      status: "Profile Active",
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    };
  };

  const profileStatus = getProfileStatus();
  const StatusIcon = profileStatus.icon;

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EN</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                ElderNest
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Profile Status */}
          <motion.div
            variants={fadeUp}
            className={`mx-4 mt-4 p-3 rounded-lg ${profileStatus.bgColor}`}
          >
            <div className="flex items-center space-x-2">
              <StatusIcon className={`w-4 h-4 ${profileStatus.color}`} />
              <span className={`text-sm font-medium ${profileStatus.color}`}>
                {profileStatus.status}
              </span>
            </div>
            {!user?.profileCompleted && user?.isApproved && (
              <button
                onClick={() => handleNavigation("/caregiver/complete-profile", false)}
                className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Complete now →
              </button>
            )}
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href, item.disabled)}
                  disabled={item.disabled}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-400"
                      : item.disabled
                      ? "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Caregiver
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CaregiverSidebar;