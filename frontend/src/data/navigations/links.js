import {
    BarChart,
    Bell,
    Briefcase,
    Calendar,
    FileText,
    KeyRound,
    LayoutDashboard,
    MessageSquare,
    Settings,
    Stethoscope,
    User,
    Users,
    CreditCard,
    Home,
} from "lucide-react";

export const links = {
    //  ADMIN 
    admin: [
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
            to: "/admin/services",
            label: "Services",
            icon: Briefcase,
        },
        {
            to: "/admin/bookings",
            label: "Bookings",
            icon: Calendar,
        },
        {
            to: "/admin/reports",
            label: "Reports",
            icon: BarChart,
        },
        {
            to: "/admin/complaints",
            label: "Complaints",
            icon: MessageSquare,
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
    ],

    //  CAREGIVER 
    caregiver: [
        {
            to: "/caregiver/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
        },
        {
            to: "/caregiver/requests",
            label: "Requests",
            icon: Bell,
        },
        {
            to: "/caregiver/active-services",
            label: "Active Services",
            icon: Briefcase,
        },
        {
            to: "/caregiver/care-notes",
            label: "Care Notes",
            icon: FileText,
        },
        {
            to: "/caregiver/availability",
            label: "Availability",
            icon: Calendar,
        },
        {
            to: "/caregiver/history",
            label: "Service History",
            icon: Stethoscope,
        },
        {
            to: "/caregiver/reviews",
            label: "Ratings/Reviews",
            icon: MessageSquare,
        },
        {
            to: "/caregiver/profile",
            label: "Profile",
            icon: User,
        },
    ],

    //  USER 
    user: [
        {
            to: "/user/profile",
            label: "Profile",
            icon: User,
        },
        {
            to: "/user/services",
            label: "Browse Services",
            icon: Briefcase,
        },
        {
            to: "/user/bookings",
            label: "My Bookings",
            icon: Calendar,
        },
        {
            to: "/user/history",
            label: "Service History",
            icon: FileText,
        },
    ],

    //  PUBLIC NAV 
    common: [
        { path: "/", name: "Home" },
        { path: "/about", name: "About Us" },
        { path: "/contact", name: "Contact Us" },
        { path: "/blogs", name: "Blogs" },
        { path: "/services", name: "Services" },
    ],

    //  FOOTER 
    footer: {
        services: [
            { path: "/services", name: "Nursing Care" },
            { path: "/services", name: "Elderly Attendant" },
            { path: "/services", name: "Physiotherapy" },
            { path: "/services", name: "Dementia Care" },
        ],
        professionals: [
            { path: "/caregiver-auth", name: "Join as Caregiver" },
            { path: "*", name: "Partner Clinics" },
            { path: "*", name: "Training Resources" },
        ],
    },
};