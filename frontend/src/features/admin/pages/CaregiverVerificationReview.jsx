import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Check, X, MessageSquare, Eye } from "lucide-react";
import {
  getCaregiverVerificationDetail,
  reviewCaregiverVerification,
} from "../api/admin.api";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";
import Modal from "../../../components/ui/Modal";
import GlobalLoader from "../../../components/ui/GlobalLoader";

const DocRow = ({ label, url }) => {
  if (!url) return null;
  const isImage = /\.(jpe?g|png|gif|webp|avif)$/i.test(url);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{label}</p>
        {isImage && (
          <img src={url} alt={label} className="mt-2 max-h-32 rounded-lg border border-slate-200 dark:border-slate-700" />
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="flex items-center gap-2 shrink-0"
        onClick={() => {
          let openUrl = url;
          if (openUrl.includes('cloudinary.com') && openUrl.toLowerCase().endsWith('.pdf') && !openUrl.includes('fl_attachment')) {
            openUrl = openUrl.replace('/upload/', '/upload/fl_attachment/');
          }
          window.open(openUrl, "_blank", "noopener,noreferrer");
        }}
      >
        <Eye className="w-4 h-4" /> Preview
      </Button>
    </div>
  );
};

const CaregiverVerificationReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [changesModal, setChangesModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);

  useEffect(() => {
    getCaregiverVerificationDetail(id)
      .then((res) => setCaregiver(res?.data?.caregiver))
      .catch(() => toast.error("Failed to load verification"))
      .finally(() => setLoading(false));
  }, [id]);

  const review = async (action, note) => {
    const msg = note ?? feedback;
    if ((action === "reject" || action === "changes") && !msg?.trim()) {
      toast.error("Please provide feedback for the caregiver");
      return;
    }
    try {
      setSubmitting(true);
      await reviewCaregiverVerification(id, action, msg);
      toast.success(
        action === "approve"
          ? "Verification approved"
          : action === "reject"
            ? "Verification rejected"
            : "Change request sent"
      );
      setChangesModal(false);
      setRejectModal(false);
      navigate("/admin/caregivers", { replace: true, state: { tab: "profiles" } });
    } catch (err) {
      toast.error(err?.message || "Review failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <GlobalLoader />;
  if (!caregiver) return <p className="text-center py-12">Caregiver not found</p>;

  const user = caregiver.userId;
  const docs = caregiver.documents || {};

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/admin/caregivers" className="inline-flex items-center gap-2 text-blue-600 mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to caregivers
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verification review</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        {user?.name} · {user?.email}
      </p>

      <div className="grid gap-6 mb-8">
        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 text-slate-900 dark:text-white">Profile & services</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Bio: {caregiver.bio || "—"}</p>
          <p className="text-sm mt-2 text-slate-600 dark:text-slate-400">
            Services: {(caregiver.servicesOffered || []).map((s) => s.title || s).join(", ") || "—"}
          </p>
          <p className="text-sm mt-2 text-slate-600 dark:text-slate-400">Info: {caregiver.verificationInfo || "—"}</p>
        </section>

        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 text-slate-900 dark:text-white">Documents</h2>
          <DocRow label="Government ID (Aadhaar/PAN)" url={docs.aadharCard} />
          <DocRow label="ID proof" url={docs.idProof} />
          <DocRow label="Experience document" url={docs.policeClearance} />
          {(docs.certificates || []).map((url, i) => (
            <DocRow key={url} label={`Qualification certificate ${i + 1}`} url={url} />
          ))}
        </section>

        <Textarea
          label="Admin feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
          placeholder="Required for reject or request changes..."
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => review("approve")} loading={submitting} className="flex items-center gap-2">
          <Check className="w-4 h-4" /> Approve
        </Button>
        <Button variant="outline" onClick={() => setChangesModal(true)} className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> Request changes
        </Button>
        <Button variant="outline" onClick={() => setRejectModal(true)} className="flex items-center gap-2 text-red-600">
          <X className="w-4 h-4" /> Reject
        </Button>
      </div>

      <Modal isOpen={changesModal} onClose={() => setChangesModal(false)} title="Request changes">
        <div className="p-6 space-y-4">
          <Textarea
            label="Message to caregiver *"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            placeholder="Explain what documents or information need to be updated..."
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setChangesModal(false)}>Cancel</Button>
            <Button loading={submitting} onClick={() => review("changes", feedback)}>
              Send to caregiver
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={rejectModal} onClose={() => setRejectModal(false)} title="Reject verification">
        <div className="p-6 space-y-4">
          <Textarea
            label="Rejection reason *"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setRejectModal(false)}>Cancel</Button>
            <Button loading={submitting} onClick={() => review("reject", feedback)} className="bg-red-600 hover:bg-red-700">
              Reject
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CaregiverVerificationReview;
