import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

export const firebaseGoogleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();

    return idToken;
};