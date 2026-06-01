import { toast } from "react-toastify";

export const handleBookCaregiver = ({ user, caregiverId, navigate, serviceId }) => {
  if (!user) {
    toast.info("Please login first to book a caregiver");
    const path = `/user/book-caregiver/${caregiverId}${serviceId ? `?serviceId=${serviceId}` : ""}`;
    navigate("/auth", { state: { from: path } });
    return false;
  }
  if (user.role !== "user") {
    toast.error("Only family accounts can book caregivers. Please use the correct account.");
    return false;
  }
  const path = `/user/book-caregiver/${caregiverId}${serviceId ? `?serviceId=${serviceId}` : ""}`;
  navigate(path);
  return true;
};
