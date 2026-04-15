import { useEffect, useState } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/layout/ScrollToTop";
import { BrowserRouter } from "react-router-dom";
import { getMe } from "./api/authapi";
import { AuthProvider } from "./context/AuthContext";

function App() {
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

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <AppRoutes theme={theme} toggleTheme={toggleTheme} />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
