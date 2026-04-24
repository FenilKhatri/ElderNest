import Sidebar from "./Sidebar";
import { links } from "../../../data/navigations/links";

const AdminSidebar = (props) => {
  return <Sidebar title="Admin Panel" navLinks={links.admin} {...props} />;
};

export default AdminSidebar;
