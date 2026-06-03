import { toast } from "react-toastify";
import { getRedirectByRole } from "./roleRedirect";
import { ROLES } from "@/constants";
import { clearSessionOnRoleMismatch } from "./clearSessionOnRoleMismatch";

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

        // res is the unwrapped JSON body: { success, message, data }
        const dataObj = res?.data || res;
        const user = dataObj?.user || dataObj?.caregiver || res?.user || res?.caregiver;
        const message = res?.message || dataObj?.message;

        // Block wrong-role logins (e.g. caregiver trying user form)
        if (allowedRole && user?.role) {
            const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
            
            if (!allowedRoles.includes(user.role)) {
                await clearSessionOnRoleMismatch();
                toast.error("Invalid email or password.");
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