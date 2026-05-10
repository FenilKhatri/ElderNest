import { toast } from "react-toastify";
import { getRedirectByRole } from "./roleRedirect";

export const handleAuthSubmit = async ({
    apiCall,
    form,
    navigate,
    setLoading,
    fetchUser,
    validate,
    successMessage,
}) => {
    try {
        // Validation
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
        const message = responseData?.message;
        const user =
            responseData?.data?.user ||
            responseData?.user;
        // Login only
        if (fetchUser) {
            await fetchUser();
        }
        navigate(getRedirectByRole(user?.role));
        toast.success(
            message || successMessage || "Success"
        );
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