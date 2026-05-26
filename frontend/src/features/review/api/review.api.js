import http from "../../../lib/axios";

// Create review (user)
export const createReview = (data) => {
  return http.post("/reviews", data);
};

// Get caregiver reviews (public)
export const getCaregiverReviews = (caregiverId) => {
  return http.get(`/reviews/caregiver/${caregiverId}`);
};

// Get my reviews (user)
export const getMyReviews = () => {
  return http.get("/reviews/my-reviews");
};
