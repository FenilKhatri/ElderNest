import { Outlet } from "react-router-dom";

const CaregiverLayout = ({ theme, toggleTheme }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white p-4">Caregiver Menu</aside>

      {/* Main */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default CaregiverLayout;
