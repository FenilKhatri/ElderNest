import http from "../../lib/axios";

/** Clear auth cookie when login succeeded but role is wrong for this page */
export const clearSessionOnRoleMismatch = async () => {
  try {
    await http.post("/auth/logout");
  } catch {
    /* ignore */
  }
};
