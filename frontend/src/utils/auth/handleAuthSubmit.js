import { toast } from "react-toastify";
import { getRedirectByRole } from "./roleRedirect";

/**
 * Unified auth submit handler for login and register flows.
 *
 * Root cause of previous bug:
 * - For register flows, fetchUser was not called, so AuthContext.user stayed null.
 * - ProtectedRoute saw null user and immediately redirected to "/" after navigate().
 * - Fix: always call fetchUser() if provided before navigating, so context is
 *   populated before the protected route renders.
 */
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
        // Client-side validation (e.g. confirm password check)
        if (validate) {
            const errorMessage = validate();
            if (errorMessage) {
                toast.error(errorMessage);
                return;
            }
        }

        setLoading(true);

        const res = await apiCall(form);

        // Axios interceptor already unwraps res.data (the response body).
        // Body shape: { success, message, data: { user } }
        const responseData = res?.data || res;
        const message = res?.message || responseData?.message;
        const user =
            responseData?.data?.user ||
            responseData?.data?.caregiver ||
            responseData?.user ||
            responseData?.caregiver;

        // Refresh auth context BEFORE navigating so ProtectedRoute passes
        if (fetchUser) {
            await fetchUser();
        }

        // Navigate based on role returned from API (covers both login + register)
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