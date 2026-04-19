import Google from "../../assets/images/google.avif";
import { firebaseGoogleLogin } from "../../services/auth.service";
import { googleAuthApi } from "../../api/googleApi";

const GoogleAuthButton = ({ role = "user" }) => {
  const handleGoogleLogin = async () => {
    try {
      const user = await firebaseGoogleLogin();

      await googleAuthApi({
        name: user.displayName,
        email: user.email,
        profileImage: user.photoURL,
        role,
      });

      window.location.href = "/";
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="mt-5 rounded-xl w-full flex items-center justify-center gap-3 cursor-pointer border border-slate-800 hover:bg-slate-100 dark:bg-white text-black py-2 hover:opacity-90 transition"
    >
      <img src={Google} alt="Google auth" width={24} loading="lazy" />
      Continue with Google
    </button>
  );
};

export default GoogleAuthButton;