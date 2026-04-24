import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/authapi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getMe();
      setUser(res.user);
    } catch {
      setUser(null);
    }
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    const init = async () => {
      await fetchUser();
      setLoading(false);
    };

    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
