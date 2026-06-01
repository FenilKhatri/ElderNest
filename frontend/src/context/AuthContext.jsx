import { createContext, useContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import http from "../lib/axios";
import { getMe } from "../features/auth/api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getMe();
      // The backend successResponse wraps the payload in a 'data' key,
      // and Axios interceptor returns res.data, so we get { success, message, data }
      const loggedUser = res?.data?.user || null;
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
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
