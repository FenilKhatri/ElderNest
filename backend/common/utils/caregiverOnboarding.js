export const ONBOARDING_STAGES = {
    PENDING_ACCOUNT: "pending_account",
    ACCOUNT_APPROVED: "account_approved",
    VERIFICATION_PENDING: "verification_pending",
    VERIFICATION_CHANGES: "verification_changes",
    ACTIVE: "active",
    REJECTED: "rejected",
};

/** Routes caregivers may access per stage (path prefixes) */
export const STAGE_ROUTE_ACCESS = {
    [ONBOARDING_STAGES.PENDING_ACCOUNT]: [
        "/caregiver/profile",
        "/caregiver/settings",
        "/caregiver/pending-approval",
        "/caregiver/rejected",
        "/caregiver/notifications",
    ],
    [ONBOARDING_STAGES.ACCOUNT_APPROVED]: [
        "/caregiver/profile",
        "/caregiver/settings",
        "/caregiver/verification",
        "/caregiver/notifications",
    ],
    [ONBOARDING_STAGES.VERIFICATION_PENDING]: [
        "/caregiver/profile",
        "/caregiver/settings",
        "/caregiver/verification",
        "/caregiver/notifications",
    ],
    [ONBOARDING_STAGES.VERIFICATION_CHANGES]: [
        "/caregiver/profile",
        "/caregiver/settings",
        "/caregiver/verification",
        "/caregiver/notifications",
    ],
    [ONBOARDING_STAGES.ACTIVE]: ["*"],
    [ONBOARDING_STAGES.REJECTED]: [
        "/caregiver/rejected",
        "/caregiver/settings",
        "/caregiver/notifications",
    ],
};

export const canAccessCaregiverRoute = (stage, path) => {
    if (!path) return false;
    const allowed = STAGE_ROUTE_ACCESS[stage] || [];
    if (allowed.includes("*")) return true;
    return allowed.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
};

export const isCaregiverBookable = (caregiver) =>
    caregiver?.onboardingStage === ONBOARDING_STAGES.ACTIVE &&
    caregiver?.isPublished === true &&
    caregiver?.profileApprovalStatus === "approved" &&
    caregiver?.isActive !== false;
