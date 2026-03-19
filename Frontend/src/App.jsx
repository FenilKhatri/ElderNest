import { useEffect, useState } from "react";
import "./App.css";

import AppRoute from "./routes/AppRoutes";

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
      <AppRoute theme={theme} toggleTheme={toggleTheme} />
  );
}

export default App;
