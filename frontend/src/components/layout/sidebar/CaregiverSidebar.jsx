import Sidebar from "./Sidebar";
import { links } from "../../../data/navigations/links";

const CaregiverSidebar = (props) => {
  return (
    <Sidebar title="Caregiver Panel" navLinks={links.caregiver} {...props} />
  );
};

export default CaregiverSidebar;
