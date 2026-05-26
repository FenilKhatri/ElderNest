import http from "../../../lib/axios";

// Submit contact form (public)
export const submitContact = (data) => {
  return http.post("/contact", data);
};
