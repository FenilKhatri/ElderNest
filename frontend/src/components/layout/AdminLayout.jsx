import DashboardLayout from "./DashboardLayout";
import AdminSidebar from "./sidebar/AdminSidebar";

const AdminLayout = (props) => {
  return (
    <DashboardLayout title="Admin Panel" Sidebar={AdminSidebar} {...props} />
  );
};

export default AdminLayout;
