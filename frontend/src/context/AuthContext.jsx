import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/authapi";
import { logOut } from "../api/logoutapi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await getMe();
      setUser(res?.user || null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
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
