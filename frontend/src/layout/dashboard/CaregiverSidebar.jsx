import { useEffect, useState } from "react";
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
  Shield,
  Lock,
  Home,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { getOnboardingStatus } from "../../features/caregiver/api/caregiver.api";
import { fadeUp } from "../../animations/motionVariants";
import Logo from "../../assets/logo.avif";
import { CAREGIVER_STAGE_UNLOCK } from "../../constants/caregiverConstants";

const isUnlocked = (stage, href) => {
  const allowed = CAREGIVER_STAGE_UNLOCK[stage] || CAREGIVER_STAGE_UNLOCK.pending_account;
  if (allowed.includes("*")) {
    if (stage === "active" && href === "/caregiver/verification") return false;
    return true;
  }
  return allowed.some((p) => href === p || href.startsWith(`${p}/`));
};

const CaregiverSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [stage, setStage] = useState("pending_account");

  useEffect(() => {
    if (!user?.isApproved) return;
    getOnboardingStatus()
      .then((res) => setStage(res?.data?.stage || user?.onboardingStage || "pending_account"))
      .catch(() => {});
  }, [user?.isApproved]);

  const menuItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/caregiver/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/caregiver/profile", icon: User },
    { name: "Verification", href: "/caregiver/verification", icon: Shield },
    { name: "Availability", href: "/caregiver/availability", icon: Calendar },
    { name: "Services", href: "/caregiver/services", icon: FileText },
    { name: "Bookings", href: "/caregiver/bookings", icon: BookOpen },
    { name: "Care Notes", href: "/caregiver/care-notes", icon: FileText },
    { name: "Complaints", href: "/caregiver/complaints", icon: AlertCircle },
    { name: "Analytics", href: "/caregiver/analytics", icon: BarChart3 },
    { name: "Notifications", href: "/caregiver/notifications", icon: Bell, badge: unreadCount > 0 ? unreadCount : null },
    { name: "Settings", href: "/caregiver/settings", icon: Settings },
  ];

  const handleNavigation = (href, locked) => {
    if (locked) return;
    navigate(href);
    onClose();
  };

  const getProfileStatus = () => {
    if (!user?.isApproved) {
      return { status: "Pending Approval", icon: Clock, color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-900/20" };
    }
    if (stage === "active") {
      return { status: "Verified Caregiver", icon: CheckCircle, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-900/20" };
    }
    if (stage === "account_approved" || stage === "verification_changes") {
      return { status: "Complete Verification", icon: AlertCircle, color: "text-red-600 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-900/20" };
    }
    if (stage === "verification_pending") {
      return { status: "Verification Pending", icon: Clock, color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-900/20" };
    }
    return { status: "Profile Active", icon: CheckCircle, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-900/20" };
  };

  const profileStatus = getProfileStatus();
  const StatusIcon = profileStatus.icon;

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <img src={Logo} alt="ElderNest" className="h-9 w-auto object-contain" />
            <span className="font-semibold text-slate-900 dark:text-white hidden sm:inline">ElderNest</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <motion.div variants={fadeUp} className={`mx-4 mt-4 p-3 rounded-lg ${profileStatus.bgColor}`}>
          <div className="flex items-center space-x-2">
            <StatusIcon className={`w-4 h-4 ${profileStatus.color}`} />
            <span className={`text-sm font-medium ${profileStatus.color}`}>{profileStatus.status}</span>
          </div>
          {(stage === "account_approved" || stage === "verification_changes") && (
            <button
              onClick={() => handleNavigation("/caregiver/verification", false)}
              className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Go to verification →
            </button>
          )}
        </motion.div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            const isPublic = item.href === "/";
            const locked = !isPublic && (user?.isApproved ? !isUnlocked(stage, item.href) : item.href !== "/caregiver/profile" && item.href !== "/caregiver/settings");

            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href, locked)}
                disabled={locked}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600"
                    : locked
                    ? "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {locked ? <Lock className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.badge && !locked && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Caregiver</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverSidebar;
