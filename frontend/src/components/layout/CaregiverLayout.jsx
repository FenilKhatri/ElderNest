import DashboardLayout from "./DashboardLayout";
import CaregiverSidebar from "./sidebar/CaregiverSidebar";

const CaregiverLayout = (props) => {
  return (
    <DashboardLayout
      title="Caregiver Panel"
      Sidebar={CaregiverSidebar}
      {...props}
    />
  );
};

export default CaregiverLayout;
