import { useEffect, useState } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/layout/ScrollToTop";
import { BrowserRouter } from "react-router-dom";
import { getMe } from "./api/authapi";

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      return next;
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setUser(res.user);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes user={user} theme={theme} toggleTheme={toggleTheme} />
      </BrowserRouter>
    </>
  );
}

export default App;
