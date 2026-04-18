import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/authapi";
import { logOut } from "../api/logoutapi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await getMe();
      setUser(res?.user || null);
    } catch (err) {
      if (err?.response?.status !== 401) {
        console.error(err);
      }
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await logOut();
    } catch (error) {}

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, initialized, logout, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
