import {
  Home,
  LayoutDashboard,
  User,
  Settings,
  Users,
  Briefcase,
  CreditCard,
  MessageSquare,
  Bell,
  Mail,
} from "lucide-react";

export const adminSidebarLinks = [
  {
    to: "/",
    label: "Home",
    icon: Home,
  },
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/profile",
    label: "Profile",
    icon: User,
  },
  {
    to: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
  {
    label: "Users",
    icon: Users,
    subLinks: [
      { to: "/admin/users", label: "Users" },
      { to: "/admin/caregivers", label: "Caregivers" },
      { to: "/admin/patients", label: "Patients" },
    ],
  },
  {
    label: "Management",
    icon: Briefcase,
    subLinks: [
      { to: "/admin/services", label: "Services" },
      { to: "/admin/bookings", label: "Bookings" },
      { to: "/admin/blogs", label: "Blogs" },
    ],
  },
  {
    label: "Payments",
    icon: CreditCard,
    subLinks: [
      { to: "/admin/payments/transactions", label: "Transactions" },
      { to: "/admin/payments/refunds", label: "Refund Requests" },
      { to: "/admin/payments/payouts", label: "Payouts" },
    ],
  },
  {
    to: "/admin/complaints",
    label: "Complaints",
    icon: MessageSquare,
  },
  {
    to: "/admin/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    to: "/admin/newsletter",
    label: "Newsletter",
    icon: Mail,
  },
];
