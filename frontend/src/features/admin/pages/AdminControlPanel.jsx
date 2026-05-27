import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { Users, UserCheck, Stethoscope, Calendar, Layout, Settings } from "lucide-react";

import UsersPage from "./Users";
import CaregiversPage from "./Caregivers";
import ServicesPage from "./Services";
import BookingsPage from "./Bookings";

const AdminControlPanel = () => {
  const [activeTab, setActiveTab] = useState("users");

  const tabs = [
    { id: "users", label: "Manage Users", icon: <Users className="w-4 h-4" /> },
    { id: "caregivers", label: "Manage Caregivers", icon: <UserCheck className="w-4 h-4" /> },
    { id: "services", label: "Manage Services", icon: <Stethoscope className="w-4 h-4" /> },
    { id: "bookings", label: "Manage Bookings", icon: <Calendar className="w-4 h-4" /> },
    { id: "content", label: "Site Content", icon: <Layout className="w-4 h-4" /> },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Control Panel</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Centralized management dashboard for all platform entities.
          </p>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 overflow-hidden shadow-sm flex space-x-1 overflow-x-auto w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </motion.div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "users" && <UsersPage />}
            {activeTab === "caregivers" && <CaregiversPage />}
            {activeTab === "services" && <ServicesPage />}
            {activeTab === "bookings" && <BookingsPage />}
            {activeTab === "content" && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Settings className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Site Content Management</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
                  This section is under development. Here you will be able to manage FAQs, Hero Sections, and other public-facing content.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AdminControlPanel;
