import { toast } from "react-toastify";
import { getRedirectByRole } from "./roleRedirect";
import { ROLES } from "../constants";

export const handleAuthSubmit = async ({
    apiCall,
    form,
    navigate,
    setLoading,
    fetchUser,
    validate,
    successMessage,
    allowedRole, // optional — if set, block other roles from logging in
}) => {
    try {
        if (validate) {
            const errorMessage = validate();
            if (errorMessage) {
                toast.error(errorMessage);
                return;
            }
        }

        setLoading(true);

        const res = await apiCall(form);

        const responseData = res?.data || res;
        const message = res?.message || responseData?.message;
        const user =
            responseData?.data?.user ||
            responseData?.data?.caregiver ||
            responseData?.user ||
            responseData?.caregiver;

        // Block wrong-role logins (e.g. caregiver trying user form)
        if (allowedRole && user?.role) {
            const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
            
            if (!allowedRoles.includes(user.role)) {
                toast.error(
                    user.role === ROLES.CAREGIVER
                        ? "Caregivers must use the caregiver login page."
                        : "Please use the correct login page for your account."
                );
                setLoading(false);
                return;
            }
        }

        if (fetchUser) {
            await fetchUser();
        }

        navigate(getRedirectByRole(user?.role));
        toast.success(message || successMessage || "Success");
    } catch (error) {
        toast.error(
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong"
        );
    } finally {
        setLoading(false);
    }
};