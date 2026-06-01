import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MessageSquare, Plus } from "lucide-react";
import UserPageLayout from "../../../layout/dashboard/UserPageLayout";
import { getMyComplaints } from "../../complaint/api/complaint.api";
import Button from "../../../components/ui/Button";
import StatusBadge from "../../../components/ui/StatusBadge";
import EmptyState from "../../../components/ui/EmptyState";
import { formatDateTime } from "../../../utils/helpers";

const UserComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyComplaints()
      .then((res) => setComplaints(res?.data?.complaints || []))
      .catch(() => toast.error("Failed to load complaints"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserPageLayout
      title="My complaints"
      description="Track issues reported to our support team."
      action={
        <Button onClick={() => navigate("/user/complaints/new")} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Submit complaint
        </Button>
      }
    >
      {loading ? (
        <div className="animate-pulse h-32 bg-slate-100 dark:bg-slate-800 rounded-xl" />
      ) : complaints.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No complaints"
          description="If you experience any issues, submit a complaint and our team will review it."
          action={
            <Button onClick={() => navigate("/user/complaints/new")}>Submit complaint</Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div
              key={c._id}
              className="rounded-xl border border-slate-200 dark:border-slate-700 p-5"
            >
              <div className="flex justify-between gap-4 mb-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">{c.subject}</h3>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{c.description}</p>
              {c.adminNotes && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  Admin response: {c.adminNotes}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-3">{formatDateTime(c.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </UserPageLayout>
  );
};

export default UserComplaints;
