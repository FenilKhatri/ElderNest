import { createContext, useContext, useEffect, useState } from "react";
import { getRedirectResult, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../lib/firebase";
import http from "../lib/axios";
import { getMe } from "../features/auth/api/auth.api";
import { googleAuthApi } from "../features/auth/api/google.api";
import { getRedirectByRole } from "../utils/auth/roleRedirect";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getMe();
      const loggedUser = res?.data?.user || res?.data?.caregiver || null;

      setUser(loggedUser);
    } catch (error) {
      if (error?.response?.status !== 401) {
        console.error("fetchUser error:", error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await http.post("/auth/logout");
    } catch (error) {
      console.log("Logout error:", error);
    }

    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      try {
        const result = await getRedirectResult(auth);

        if (result?.user) {
          const idToken = await result.user.getIdToken();
          const role = sessionStorage.getItem("google_role");
          sessionStorage.removeItem("google_role");

          try {
            const res = await googleAuthApi({
              token: idToken,
              role,
            });

            const loggedInUser =
              res?.data?.user || res?.data?.caregiver || null;
            setUser(loggedInUser);
            toast.success(res?.message || "Login successful");

            // redirect after login
            if (loggedInUser?.role) {
              window.location.href = getRedirectByRole(loggedInUser.role);
            }
          } catch (googleErr) {
            console.error("Google login error:", googleErr);
            toast.error(googleErr?.message || "Google login failed");
            await signOut(auth);
            setUser(null);
          }

          return;
        }

        const res = await getMe();
        const loggedUser = res?.data?.user || res?.data?.caregiver || null;

        setUser(loggedUser);
      } catch (error) {
        if (error?.response?.status !== 401) {
          console.error("initAuth error:", error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        fetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
