import { ROLES } from "./constants";

export const getRedirectByRole = (role) => {
    switch (role) {
        case ROLES?.ADMIN:
            return "/admin/dashboard";
        case ROLES?.CAREGIVER:
            return "/caregiver/dashboard";
        case ROLES?.USER:
            return "/user/profile";
        default:
            return "/";
    }
};