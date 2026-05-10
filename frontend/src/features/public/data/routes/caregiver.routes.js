import {
  LayoutDashboard,
  BriefcaseMedical,
  CalendarCheck,
  CreditCard,
  Star,
  User,
  ClipboardList,
  Home,
} from "lucide-react";

export const caregiverRoutes = [
  {
    to: "/",
    label: "Home",
    icon: Home,
  },
  {
    to: "/caregiver/profile",
    label: "Profile",
    icon: User,
  },
  {
    to: "/caregiver/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/caregiver/bookings",
    label: "Bookings",
    icon: CalendarCheck,
  },
  {
    to: "/caregiver/requests",
    label: "Requests",
    icon: ClipboardList,
  },
  {
    to: "/caregiver/services",
    label: "My Services",
    icon: BriefcaseMedical,
  },
  {
    to: "/caregiver/payments",
    label: "Payments",
    icon: CreditCard,
  },
  {
    to: "/caregiver/reviews",
    label: "Reviews",
    icon: Star,
  },
];
