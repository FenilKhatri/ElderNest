import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FileText, Plus } from "lucide-react";
import { getMyCareNotes, createCareNote, updateCareNote } from "../../careNote/api/careNote.api";
import { getCaregiverBookings } from "../../booking/api/booking.api";
import { getMyProfile } from "../api/caregiver.api";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";
import Modal from "../../../components/ui/Modal";
import EmptyState from "../../../components/ui/EmptyState";
import { formatDateTime } from "../../../utils/helpers";

const CareNotes = () => {
  const [notes, setNotes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, editing: null });
  const [form, setForm] = useState({ bookingId: "", title: "", content: "", vitals: "", medications: "", followUp: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [notesRes, profileRes] = await Promise.all([getMyCareNotes(), getMyProfile()]);
      setNotes(notesRes?.data?.careNotes || []);
      const cg = profileRes?.data?.caregiver;
      if (cg?._id) {
        const bRes = await getCaregiverBookings(cg._id);
        setBookings((bRes?.data?.bookings || []).filter((b) => ["accepted", "in-progress", "completed"].includes(b.status)));
      }
    } catch {
      toast.error("Failed to load care notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (modal.editing) {
        await updateCareNote(modal.editing, form);
        toast.success("Care note updated");
      } else {
        await createCareNote(form);
        toast.success("Care note created");
      }
      setModal({ open: false, editing: null });
      setForm({ bookingId: "", title: "", content: "", vitals: "", medications: "", followUp: "" });
      load();
    } catch (err) {
      toast.error(err.message || "Failed to save care note");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Care Notes</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Document care provided during bookings</p>
        </div>
        <Button onClick={() => setModal({ open: true, editing: null })} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Note
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      ) : notes.length === 0 ? (
        <EmptyState icon={FileText} title="No care notes" description="Add notes after starting a service." action={<Button onClick={() => setModal({ open: true, editing: null })}>Add Note</Button>} />
      ) : (
        <div className="space-y-3">
          {notes.map((n) => (
            <div key={n._id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex justify-between gap-2 mb-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">{n.title}</h3>
                <span className="text-xs text-slate-500">{formatDateTime(n.createdAt)}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{n.content}</p>
              {n.bookingId?.patientName && (
                <p className="text-xs text-slate-500 mt-2">Patient: {n.bookingId.patientName}</p>
              )}
              <Button type="button" className="mt-3 hover:underline" onClick={() => { setForm({ bookingId: n.bookingId?._id || n.bookingId, title: n.title, content: n.content, vitals: n.vitals || "", medications: n.medications || "", followUp: n.followUp || "" }); setModal({ open: true, editing: n._id }); }}>
                Edit
              </Button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, editing: null })} title={modal.editing ? "Edit Care Note" : "New Care Note"}>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {!modal.editing && (
            <Select
              label="Booking *"
              value={form.bookingId}
              onChange={(e) => setForm({ ...form, bookingId: e.target.value })}
              options={[{ value: "", label: "Select booking" }, ...bookings.map((b) => ({ value: b._id, label: `${b.patientName} — ${b.bookingId}` }))]}
              required
            />
          )}
          <Input label="Title" placeholder="e.g. Daily Progress Note" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea label="Content *" placeholder="Detail the care provided, patient's status, and any observations..." rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          <Input label="Vitals" placeholder="e.g. BP 120/80, Pulse 72, Temp 98.6" value={form.vitals} onChange={(e) => setForm({ ...form, vitals: e.target.value })} />
          <Input label="Medications" placeholder="e.g. Aspirin 81mg at 9AM" value={form.medications} onChange={(e) => setForm({ ...form, medications: e.target.value })} />
          <Textarea label="Follow-up" placeholder="e.g. Check blood pressure again tomorrow morning." rows={2} value={form.followUp} onChange={(e) => setForm({ ...form, followUp: e.target.value })} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setModal({ open: false, editing: null })}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CareNotes;
