import { useEffect, useState } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { getOnboardingStatus } from "../../features/caregiver/api/caregiver.api";
import { useAuth } from "../../context/AuthContext";
import { apiStage } from "../../utils/apiHelpers";

const STAGE_ROUTE_ACCESS = {
  pending_account: ["/caregiver/profile", "/caregiver/settings", "/caregiver/pending-approval", "/caregiver/notifications"],
  account_approved: ["/caregiver/profile", "/caregiver/settings", "/caregiver/verification", "/caregiver/notifications"],
  verification_pending: ["/caregiver/profile", "/caregiver/settings", "/caregiver/verification", "/caregiver/notifications"],
  verification_changes: ["/caregiver/profile", "/caregiver/settings", "/caregiver/verification", "/caregiver/notifications"],
  active: ["*"],
  rejected: ["/caregiver/rejected", "/caregiver/settings", "/caregiver/notifications"],
};

const canAccess = (stage, path) => {
  const allowed = STAGE_ROUTE_ACCESS[stage] || STAGE_ROUTE_ACCESS.pending_account;
  if (allowed.includes("*")) {
    if (stage === "active" && path === "/caregiver/verification") return false;
    return true;
  }
  return allowed.some((p) => path === p || path.startsWith(`${p}/`));
};

const defaultRedirect = (stage) => {
  if (stage === "account_approved" || stage === "verification_changes") return "/caregiver/verification";
  if (stage === "active") return "/caregiver/dashboard";
  return "/caregiver/profile";
};

const LockedState = ({ message, actionHref, actionLabel }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
      <Lock className="w-8 h-8 text-slate-400" />
    </div>
    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Section locked</h2>
    <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">{message}</p>
    {actionHref && (
      <Link to={actionHref} className="text-blue-600 font-medium hover:underline">
        {actionLabel}
      </Link>
    )}
  </div>
);

const CaregiverStageGuard = ({ children }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [stage, setStage] = useState(user?.onboardingStage || "pending_account");

  useEffect(() => {
    if (user?.onboardingStage) setStage(user.onboardingStage);
  }, [user?.onboardingStage]);

  useEffect(() => {
    if (!user?.isApproved) return;
    let cancelled = false;
    getOnboardingStatus()
      .then((res) => {
        if (!cancelled) {
          const next = apiStage(res) || user?.onboardingStage || "pending_account";
          setStage(next);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [user?.isApproved, user?.onboardingStage, user?.status]);

  if (user?.status === "rejected" || stage === "rejected") {
    if (pathname !== "/caregiver/rejected") {
      return <Navigate to="/caregiver/rejected" replace />;
    }
    return <div className="min-h-[40vh] w-full">{children}</div>;
  }

  if (!user?.isApproved) {
    return <Navigate to="/caregiver/pending-approval" replace />;
  }

  if (stage === "active" && pathname === "/caregiver/verification") {
    return (
      <LockedState
        message="You are a verified caregiver. Document verification is no longer required."
        actionHref="/caregiver/dashboard"
        actionLabel="Go to dashboard"
      />
    );
  }

  if (!canAccess(stage, pathname)) {
    return <Navigate to={defaultRedirect(stage)} replace />;
  }

  return <div className="min-h-[40vh] w-full">{children}</div>;
};

export default CaregiverStageGuard;
