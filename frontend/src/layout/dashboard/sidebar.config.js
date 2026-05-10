import { adminRoutes } from "../../features/public/data/routes/admin.routes";
import { caregiverRoutes } from "../../features/public/data/routes/caregiver.routes";
import { ROLES } from "../../utils/constants";
import {
    LayoutDashboard,
    Users,
    PersonStanding,
    BriefcaseMedical,
    CalendarCheck,
    CreditCard,
    Star,
    Settings,
    Calendar,
    User,
    Home,
    Stethoscope,
    Notebook,
    ClipboardList
} from "lucide-react";

export const sidebarConfig = {
    [ROLES.ADMIN]: {
        title: "Admin Panel",
        links: adminRoutes,
    },

    [ROLES.CAREGIVER]: {
        title: "Caregiver Panel",
        links: caregiverRoutes,
    },
};