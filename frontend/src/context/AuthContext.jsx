import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/authapi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await getMe();
      setUser(res?.user || null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.clear();
    window.location.href = "/auth";
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, initialized, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
