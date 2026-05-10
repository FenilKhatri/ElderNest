import { useState } from "react";
import Google from "../../assets/images/google.avif";
import { firebaseGoogleLogin } from "../../features/auth/services/auth.service";

const GoogleAuthButton = ({ role = "user" }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      await firebaseGoogleLogin(role);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleGoogleLogin}
      className={`
        mt-5 rounded-xl w-full flex items-center justify-center gap-3
        border border-slate-800 py-2 transition
        dark:bg-white text-black
        ${
          loading
            ? "opacity-60 cursor-not-allowed"
            : "hover:bg-slate-100 cursor-pointer hover:opacity-90"
        }
      `}
    >
      <img src={Google} alt="Google auth" width={24} />

      {loading ? "Redirecting to Google..." : "Continue with Google"}
    </button>
  );
};

export default GoogleAuthButton;
