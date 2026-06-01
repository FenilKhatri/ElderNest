import { Outlet } from "react-router-dom";
import Footer from "../core/Footer";
import Navbar from "../core/Navbar";
import MaintenanceGate from "./MaintenanceGate";

const PublicLayout = ({ theme, toggleTheme }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <MaintenanceGate>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-1 w-full min-w-0">
          <Outlet />
        </main>
        <Footer />
      </MaintenanceGate>
    </div>
  );
};

export default PublicLayout;