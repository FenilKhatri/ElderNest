export const STAGE_ROUTE_ACCESS = {
  pending_account: ["/caregiver/profile", "/caregiver/settings", "/caregiver/notifications"],
  account_approved: ["/caregiver/profile", "/caregiver/settings", "/caregiver/verification", "/caregiver/notifications"],
  verification_pending: ["/caregiver/profile", "/caregiver/settings", "/caregiver/verification", "/caregiver/notifications"],
  verification_changes: ["/caregiver/profile", "/caregiver/settings", "/caregiver/verification", "/caregiver/notifications"],
  active: ["*"], // All routes
  rejected: ["/caregiver/rejected", "/caregiver/notifications"],
};

export const LockedState = {
  title: "Account Setup Incomplete",
  message: "Please complete your profile and verification to access this feature.",
};
