import { LayoutDashboard, Users, HeartPulse, FileText, Settings, CalendarCheck, MessageSquare, Briefcase, PlusCircle, UserCircle, Bell, History, CheckSquare } from "lucide-react";

export const roleConfig = {
  admin: {
    title: "Admin Panel",
    color: "bg-purple-600",
    menu: [
      { path: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
      { path: "/admin/users", icon: Users, label: "Users" },
      { path: "/admin/caregivers", icon: HeartPulse, label: "Caregivers" },
      { path: "/admin/services", icon: Briefcase, label: "Services" },
      { path: "/admin/bookings", icon: CalendarCheck, label: "Bookings" },
      { path: "/admin/blogs", icon: FileText, label: "Blogs" },
      { path: "/admin/complaints", icon: MessageSquare, label: "Complaints" },
      { path: "/admin/settings", icon: Settings, label: "Settings" },
    ],
  },
  caregiver: {
    title: "Caregiver Portal",
    color: "bg-blue-600",
    menu: [
      { path: "/caregiver/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/caregiver/profile", icon: UserCircle, label: "My Profile" },
      { path: "/caregiver/verification", icon: CheckSquare, label: "Verification" },
      { path: "/caregiver/availability", icon: CalendarCheck, label: "Availability" },
      { path: "/caregiver/bookings", icon: CalendarCheck, label: "Bookings" },
      { path: "/caregiver/patients", icon: Users, label: "My Patients" },
      { path: "/caregiver/care-notes", icon: FileText, label: "Care Notes" },
      { path: "/caregiver/notifications", icon: Bell, label: "Notifications" },
      { path: "/caregiver/settings", icon: Settings, label: "Settings" },
    ],
  },
  user: {
    title: "User Dashboard",
    color: "bg-emerald-600",
    menu: [
      { path: "/user/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/user/patients", icon: Users, label: "My Patients" },
      { path: "/user/bookings", icon: CalendarCheck, label: "My Bookings" },
      { path: "/user/services/book", icon: PlusCircle, label: "Book Service" },
      { path: "/user/history", icon: History, label: "History" },
      { path: "/user/complaints", icon: MessageSquare, label: "Complaints" },
      { path: "/user/notifications", icon: Bell, label: "Notifications" },
      { path: "/user/profile", icon: UserCircle, label: "Profile Settings" },
    ],
  },
};
