import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import CaregiverSidebar from "./CaregiverSidebar";
import CaregiverHeader from "./CaregiverHeader";
import CaregiverStageGuard from "./CaregiverStageGuard";

const CaregiverLayout = ({ theme, toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <CaregiverSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="w-full min-w-0 lg:pl-64">
        {/* Header */}
        <CaregiverHeader
          onMenuClick={() => setSidebarOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* Page Content */}
        <main className="w-full min-w-0 p-4 lg:p-8">
          <motion.div
            className="w-full max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CaregiverStageGuard>
              <Outlet />
            </CaregiverStageGuard>
          </motion.div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default CaregiverLayout;