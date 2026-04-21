import Google from "../../assets/images/google.avif";
import { firebaseGoogleLogin } from "../../services/auth.service";
import { googleAuthApi } from "../../api/googleApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getRedirectByRole } from "../../utils/roleRedirect";

const GoogleAuthButton = ({ role = "user" }) => {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const token = await firebaseGoogleLogin();

      const res = await googleAuthApi({
        token,
        role,
      });

      await fetchUser();

      navigate(getRedirectByRole(res?.user?.role));
    } catch (error) {
      console.error(error);
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
