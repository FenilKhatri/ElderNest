import { createContext, useContext, useEffect, useState } from "react";
import { getRedirectResult, signOut } from "firebase/auth";
import { getMe } from "../features/auth/api/auth.api";
import { googleAuthApi } from "../features/auth/api/google.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../lib/axios";
import { auth } from "../lib/firebase";
import { getRedirectByRole } from "../utils/roleRedirect";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getMe();
      setUser(res?.data?.user ?? res?.data?.caregiver ?? null);
    } catch (error) {
      if (error?.response?.status !== 401) {
        console.error(error);
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
      console.log(error);
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
            const res = await googleAuthApi({ token: idToken, role });
            const loggedInUser =
              res?.data?.user || res?.data?.caregiver || null;
            setUser(loggedInUser);
            toast.success(res?.message || "Login successful");

            if (loggedInUser?.role) {
              window.location.href = getRedirectByRole(loggedInUser.role);
            }
          } catch (googleErr) {
            console.error("Google auth backend error:", googleErr);
            toast.error(googleErr?.message || "Google login failed");
            await signOut(auth);
            setUser(null);
          }
        } else {
          const res = await getMe();
          setUser(res?.data?.user || res?.data?.caregiver || null);
        }
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
    <AuthContext.Provider value={{ user, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
