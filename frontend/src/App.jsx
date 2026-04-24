import { useEffect, useState } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/layout/ScrollToTop";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import GlobalLoader from "./components/ui/GlobalLoader";
import { ToastContainer } from "react-toastify";

function App() {

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
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
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer autoClose={5000} position="top-right" newestOnTop />
      <AppRoutes theme={theme} toggleTheme={toggleTheme} />
    </BrowserRouter>
  );
}

export default App;
