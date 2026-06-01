import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserPageLayout from "../../../layout/dashboard/UserPageLayout";
import { submitComplaint } from "../../complaint/api/complaint.api";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";

const SubmitComplaintPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ subject: "", description: "", bookingId: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = { ...form, type: "user" };
      if (!payload.bookingId?.trim()) delete payload.bookingId;
      await submitComplaint(payload);
      toast.success("Complaint submitted. Our team will review it soon.");
      navigate("/user/complaints");
    } catch (err) {
      toast.error(err.message || "Failed to submit complaint");
    } finally {
      setSaving(false);
    }
  };

  return (
    <UserPageLayout
      title="Submit a complaint"
      description="Tell us what went wrong. We typically respond within 1–2 business days."
      backTo="/user/complaints"
      backLabel="Back to complaints"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <Input
          label="Subject *"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
          placeholder="Brief summary of the issue"
        />
        <Input
          label="Booking reference (optional)"
          value={form.bookingId}
          onChange={(e) => setForm({ ...form, bookingId: e.target.value })}
          placeholder="Your booking ID if this relates to a booking"
        />
        <Textarea
          label="Description *"
          rows={6}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          placeholder="Describe the issue in detail..."
        />
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={() => navigate("/user/complaints")}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Submitting..." : "Submit complaint"}
          </Button>
        </div>
      </form>
    </UserPageLayout>
  );
};

export default SubmitComplaintPage;
