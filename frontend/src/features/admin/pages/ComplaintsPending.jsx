import ComplaintsList from "../components/ComplaintsList";

const ComplaintsPending = () => (
  <ComplaintsList
    title="Pending Complaints"
    description="Complaints awaiting review"
    defaultStatus="pending"
  />
);

export default ComplaintsPending;
