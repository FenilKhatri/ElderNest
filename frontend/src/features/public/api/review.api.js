import http from "../../../lib/axios";

// Fetch public reviews for the homepage
export const getPublicReviews = () => {
  return http.get("/reviews/public");
};
