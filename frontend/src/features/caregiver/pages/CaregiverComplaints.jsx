import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AlertCircle, Plus } from "lucide-react";
import { getMyComplaints, submitComplaint } from "../../complaint/api/complaint.api";
import { getCaregiverBookings } from "../../booking/api/booking.api";
import { getMyProfile } from "../api/caregiver.api";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";
import Modal from "../../../components/ui/Modal";
import EmptyState from "../../../components/ui/EmptyState";
import StatusBadge from "../../../components/ui/StatusBadge";
import { formatDateTime } from "../../../utils/helpers";

const CaregiverComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", description: "", bookingId: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [compRes, profileRes] = await Promise.all([getMyComplaints(), getMyProfile()]);
      setComplaints(compRes?.data?.complaints || []);
      
      const cg = profileRes?.data?.caregiver;
      if (cg?._id) {
        const bRes = await getCaregiverBookings(cg._id);
        setBookings(bRes?.data?.bookings || []);
      }
    } catch {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await submitComplaint({ ...form, type: "caregiver" });
      toast.success("Complaint submitted successfully");
      setModalOpen(false);
      setForm({ subject: "", description: "", bookingId: "" });
      load();
    } catch (err) {
      toast.error(err.message || "Failed to submit complaint");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Complaints</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Report issues regarding bookings or users</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Submit Complaint
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      ) : complaints.length === 0 ? (
        <EmptyState 
          icon={AlertCircle} 
          title="No complaints" 
          description="You haven't submitted any complaints." 
          action={<Button onClick={() => setModalOpen(true)}>Submit Complaint</Button>} 
        />
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c._id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex justify-between gap-2 mb-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">{c.subject}</h3>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{c.description}</p>
              
              {c.adminNotes && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">Admin Response</p>
                  <p className="text-sm text-slate-800 dark:text-slate-300">{c.adminNotes}</p>
                </div>
              )}
              
              <div className="mt-4 text-xs text-slate-500 flex justify-between">
                <span>Submitted on {formatDateTime(c.createdAt)}</span>
                {c.resolvedAt && <span>Resolved on {formatDateTime(c.resolvedAt)}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Submit Complaint">
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <Input 
            label="Subject *" 
            placeholder="Brief summary of the issue"
            value={form.subject} 
            onChange={(e) => setForm({ ...form, subject: e.target.value })} 
            required 
          />
          <Select
            label="Related Booking (Optional)"
            value={form.bookingId}
            onChange={(e) => setForm({ ...form, bookingId: e.target.value })}
            options={[
              { value: "", label: "General issue (not booking related)" }, 
              ...bookings.map((b) => ({ value: b.bookingId, label: `${b.patientName} — ${b.bookingId}` }))
            ]}
          />
          <Textarea 
            label="Description *" 
            placeholder="Provide details about the issue..."
            rows={4} 
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })} 
            required 
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Submitting..." : "Submit Complaint"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CaregiverComplaints;
