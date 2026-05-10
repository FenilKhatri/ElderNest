import { signInWithRedirect, signOut } from "firebase/auth";
import { auth, googleProvider } from "../../../lib/firebase";

export const firebaseGoogleLogin = async (role) => {
    await signOut(auth);
    sessionStorage.setItem("google_role", role);
    await signInWithRedirect(auth, googleProvider);
};