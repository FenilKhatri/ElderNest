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
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
