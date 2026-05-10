import { ROLES } from "../constants";

export const getRedirectByRole = (role) => {
    switch (role) {
        case ROLES?.ADMIN:
            return "/admin/profile";
        case ROLES?.CAREGIVER:
            return "/caregiver/profile";
        case ROLES?.USER:
            return "/user/profile";
        default:
            return "/";
    }
};