import { ROLES } from "../auth/roles";
import { adminSidebarLinks } from "../../data/sidebar.data.js";

export const sidebarConfig = {
    [ROLES.ADMIN]: {
        title: "Admin Panel",
        links: adminSidebarLinks,
    },

    [ROLES.CAREGIVER]: {
        title: "Caregiver Panel",
        links: [],
    },
};