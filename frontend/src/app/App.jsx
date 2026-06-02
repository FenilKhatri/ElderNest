import { useEffect, useState } from "react";
import "../App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "../layout/core/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "../components/ui/ErrorBoundary";

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
    <>
      <ScrollToTop />
      <ToastContainer autoClose={5000} position="top-right" newestOnTop />
      <ErrorBoundary>
        <AppRoutes theme={theme} toggleTheme={toggleTheme} />
      </ErrorBoundary>
    </>
  );
}

export default App;
