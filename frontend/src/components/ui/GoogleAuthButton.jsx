import Google from "../../assets/images/google.avif";
import { firebaseGoogleLogin } from "../../services/auth.service";
import { googleAuthApi } from "../../api/googleapi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getRedirectByRole } from "../../utils/roleRedirect";
import { toast } from "react-toastify";

const GoogleAuthButton = ({ role = "user" }) => {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const { idToken, role: selectedRole } = await firebaseGoogleLogin(role);

      const res = await googleAuthApi({
        token: idToken,
        role: selectedRole,
      });

      await fetchUser();

      navigate(getRedirectByRole(res?.user?.role));
      toast.success(res?.message || "Login successful");
    } catch (error) {
      const actualRole = error?.response?.data?.role || role;
      toast.error(error?.message || "Login failed");

      if(actualRole) {
        navigate(getRedirectByRole(actualRole));
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="mt-5 rounded-xl w-full flex items-center justify-center gap-3 cursor-pointer border border-slate-800 hover:bg-slate-100 dark:bg-white text-black py-2 hover:opacity-90 transition"
    >
      <img src={Google} alt="Google auth" width={24} />
      Continue with Google
    </button>
  );
};

export default GoogleAuthButton;
