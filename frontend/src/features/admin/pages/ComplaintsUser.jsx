import ComplaintsList from "../components/ComplaintsList";

const ComplaintsUser = () => (
  <ComplaintsList
    title="User Complaints"
    description="Complaints submitted by users regarding bookings or caregivers"
    typeFilter="user"
  />
);

export default ComplaintsUser;
