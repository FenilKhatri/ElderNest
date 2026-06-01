import { useState } from "react";
import Google from "../../assets/images/google.avif";
import { firebaseGoogleLogin } from "../../features/auth/services/auth.service";
import { googleAuthApi } from "../../features/auth/api/google.api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getRedirectByRole } from "../../utils/auth/roleRedirect";
import { clearSessionOnRoleMismatch } from "../../utils/auth/clearSessionOnRoleMismatch";

const GoogleAuthButton = ({ role = "user", allowedRoles = null }) => {
  const [loading, setLoading] = useState(false);
  const { setUser, fetchUser } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      // 1. Open Google popup
      const result = await firebaseGoogleLogin(role);

      // 2. Guard — if popup closed or no user
      if (!result?.user) {
        toast.error("Google sign-in was cancelled");
        return;
      }

      // 3. Get Firebase ID token
      const idToken = await result.user.getIdToken();

      // 4. Send to backend → sets cookie
      const res = await googleAuthApi({ token: idToken, role });

      // 5. Extract user from response
      const loggedInUser = res?.data?.user || res?.data?.caregiver || null;

      if (!loggedInUser) {
        toast.error("Failed to retrieve user data");
        return;
      }

      const rolesAllowed = allowedRoles || [role];
      if (!rolesAllowed.includes(loggedInUser.role)) {
        await clearSessionOnRoleMismatch();
        toast.error("Invalid email or password.");
        return;
      }

      // 6. Refresh auth state and navigate
      if (fetchUser) {
        await fetchUser();
      } else {
        setUser(loggedInUser);
      }
      toast.success(res?.message || "Login successful");
      navigate(getRedirectByRole(loggedInUser?.role));
    } catch (error) {
      if (
        error?.code === "auth/popup-closed-by-user" ||
        error?.code === "auth/cancelled-popup-request"
      ) {
        return;
      }
      console.error("Google login error:", error);
      toast.error(error?.message || "Google login failed");
    } finally {
      setLoading(false);
      sessionStorage.removeItem("google_role");
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleGoogleLogin}
      className={`mt-5 rounded-xl w-full flex items-center justify-center gap-3
        border border-slate-800 py-2 transition dark:bg-white text-black
        ${
          loading
            ? "opacity-60 cursor-not-allowed"
            : "hover:bg-slate-100 cursor-pointer hover:opacity-90"
        }`}
    >
      <img src={Google} alt="Google auth" width={24} />
      {loading ? "Connecting to Google..." : "Continue with Google"}
    </button>
  );
};

export default GoogleAuthButton;
