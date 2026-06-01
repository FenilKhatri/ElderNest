import ComplaintsList from "../components/ComplaintsList";

const ComplaintsResolved = () => (
  <ComplaintsList
    title="Resolved Complaints"
    description="Complaints that have been resolved or closed"
    defaultStatus="resolved"
  />
);

export default ComplaintsResolved;
