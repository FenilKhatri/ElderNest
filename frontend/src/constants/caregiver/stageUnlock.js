export const CAREGIVER_STAGE_UNLOCK = {
  pending_account: ["/caregiver/profile", "/caregiver/settings", "/caregiver/notifications"],
  account_approved: ["/caregiver/profile", "/caregiver/settings", "/caregiver/verification", "/caregiver/notifications"],
  verification_pending: ["/caregiver/profile", "/caregiver/settings", "/caregiver/verification", "/caregiver/notifications"],
  verification_changes: ["/caregiver/profile", "/caregiver/settings", "/caregiver/verification", "/caregiver/notifications"],
  active: ["*"],
  rejected: ["/caregiver/rejected", "/caregiver/settings", "/caregiver/notifications"],
};

