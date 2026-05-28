import {
    User,
    Briefcase,
    Calendar,
    FileText,
} from "lucide-react";

export const userRoutes = [
    { to: "/user/profile", label: "Profile", icon: User },
    { to: "/user/bookings", label: "My Bookings", icon: Calendar },
    { to: "/user/history", label: "Service History", icon: FileText },
];