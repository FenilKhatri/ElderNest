import {
  LayoutDashboard,
  Users,
  PersonStanding,
  BriefcaseMedical,
  CalendarCheck,
  CreditCard,
  Star,
  Settings,
  User,
  Home,
  Stethoscope,
  Notebook,
} from "lucide-react";

export const adminRoutes = [
  {
    to: "/",
    label: "Home",
    icon: Home,
  },
  {
    to: "/admin/profile",
    label: "Profile",
    icon: User,
  },
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    to: "/admin/caregivers",
    label: "Caregivers",
    icon: Stethoscope,
  },
  {
    to: "/admin/elders",
    label: "Elders",
    icon: PersonStanding,
  },
  {
    to: "/admin/services",
    label: "Services",
    icon: BriefcaseMedical,
  },
  {
    to: "/admin/bookings",
    label: "Bookings",
    icon: CalendarCheck,
  },
  {
    to: "/admin/complaints",
    label: "Complaints",
    icon: Notebook,
  },
  {
    to: "/admin/payments",
    label: "Payments",
    icon: CreditCard,
  },
  {
    to: "/admin/reviews",
    label: "Reviews",
    icon: Star,
  },
  {
    to: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];
