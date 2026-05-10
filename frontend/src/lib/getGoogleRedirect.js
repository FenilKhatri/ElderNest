import { toast } from "react-toastify";

const handleGoogleRedirect = async () => {
    try {
        const result = await getRedirectResult(auth);
        if (!result?.user) {
            await fetchUser();
            return;
        }

        const idToken = await result.user.getIdToken();
        const role = sessionStorage.getItem("google_role");

        const res = await googleAuthApi({
            token: idToken,
            role,
        });

        sessionStorage.removeItem("google_role");
        const loggedInUser = res?.user || res?.caregiver;
        await fetchUser();
        navigate(getRedirectByRole(loggedInUser?.role));
        toast.success(res?.message || "Login successful");
    } catch (error) {
        console.error(error);
        sessionStorage.removeItem("google_role");
        toast.error(error?.message || "Google login failed");
        await signOut(auth);
    }
  };