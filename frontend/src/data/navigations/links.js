import {
    Bell,
    Briefcase,
    Calendar,
    FileText,
    KeyRound,
    LayoutDashboard,
    MessageSquare,
    Stethoscope,
    User,
    Users,
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
            to: "/admin/update-password",
            label: "Update Password",
            icon: KeyRound,
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
            to: "/caregiver/requests",
            label: "Requests",
            icon: Bell,
        },
        {
            to: "/caregiver/profile",
            label: "Profile",
            icon: User,
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
            { path: "/caregiver-login", name: "Join as Caregiver" },
            { path: "*", name: "Partner Clinics" },
            { path: "*", name: "Training Resources" },
        ],
    },
};