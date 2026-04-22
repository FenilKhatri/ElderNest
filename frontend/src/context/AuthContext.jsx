import { createContext, useContext, useEffect, useState } from "react";
import { getMe as getUserMe } from "../api/authapi";
import { getMe as getCaregiverMe } from "../api/caregiversapi";
import { ROLES } from "../utils/constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getUserMe();

      if (res?.user?.role === ROLES?.CAREGIVER) {
        const cg = await getCaregiverMe();
        setUser({
          ...cg.user,
          caregiver: cg.caregiver,
        });
      } else {
        setUser(res.user);
      }
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
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
