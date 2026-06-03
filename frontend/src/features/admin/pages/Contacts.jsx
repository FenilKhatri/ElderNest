import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Eye, CheckCircle } from "lucide-react";
import { getAllContacts, updateContactStatus } from "../api/admin.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { formatDateTime } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import { CONTACT_STATUS_OPTIONS } from "@/constants";
import Textarea from "../../../components/ui/Textarea";

const Complaints = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewContact, setViewContact] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchContacts = () => {
    setLoading(true);
    getAllContacts(statusFilter || null)
      .then((res) => setContacts(res?.data?.contacts || []))
      .catch(() => toast.error("Failed to load contacts"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchContacts(); }, [statusFilter]);

  const openContact = (c) => {
    setViewContact(c);
    setAdminNotes(c.adminNotes || "");
    setNewStatus(c.status);
  };

  const handleUpdateStatus = async () => {
    try {
      setSaving(true);
      await updateContactStatus(viewContact._id, newStatus, adminNotes);
      toast.success("Contact updated!");
      setViewContact(null);
      fetchContacts();
    } catch (err) {
      toast.error(err.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Inquiries</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage contact form submissions and inquiries</p>
        </div>
        <div className="w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "", label: "All Status" },
              ...CONTACT_STATUS_OPTIONS
            ]}
          />
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="animate-pulse h-12 bg-slate-200 dark:bg-slate-700 rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {["Name", "Email", "Subject", "Received", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {contacts.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">No inquiries found</td></tr>
                ) : contacts.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{c.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{c.subject}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatDateTime(c.createdAt)}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3">
                      <Button
                        onClick={() => openContact(c)}
                        className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        title="View & Respond"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* View / Respond Modal */}
      <Modal
        isOpen={!!viewContact}
        onClose={() => setViewContact(null)}
        title="Contact Inquiry"
        size="md"
      >
        {viewContact && (
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Name</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{viewContact.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Email</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{viewContact.email}</p>
              </div>
              {viewContact.phone && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Phone</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{viewContact.phone}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Received</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDateTime(viewContact.createdAt)}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Subject</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{viewContact.subject}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Message</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">{viewContact.message}</p>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Update Status</label>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  options={CONTACT_STATUS_OPTIONS}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Admin Notes</label>
                <Textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" size="sm" onClick={() => setViewContact(null)}>Cancel</Button>
                <Button size="sm" disabled={saving} onClick={handleUpdateStatus}>
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  {saving ? "Saving..." : "Update"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Complaints;
