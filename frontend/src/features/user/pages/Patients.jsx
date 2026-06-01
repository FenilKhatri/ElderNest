import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import UserPageLayout from "../../../layout/dashboard/UserPageLayout";
import { getMyPatients, deletePatient } from "../../patient/api/patient.api";
import Button from "../../../components/ui/Button";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import EmptyState from "../../../components/ui/EmptyState";
import CardSkeleton from "../../../components/feedback/skeleton/CardSkeleton";

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    getMyPatients()
      .then((res) => setPatients(res?.data?.patients || []))
      .catch(() => toast.error("Failed to load patients"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    try {
      await deletePatient(deleteTarget);
      toast.success("Patient removed");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || "Failed to remove patient");
    }
  };

  return (
    <UserPageLayout
      title="Patient profiles"
      description="Manage profiles for family members receiving care."
      action={
        <Button onClick={() => navigate("/user/patients/new")} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add patient
        </Button>
      }
    >
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : patients.length === 0 ? (
        <EmptyState
          icon={User}
          title="No patient profiles"
          description="Create a patient profile to speed up future bookings."
          action={
            <Button onClick={() => navigate("/user/patients/new")}>Add patient</Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {patients.map((p) => (
            <div
              key={p._id}
              className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
            >
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                {p.name}, {p.age}y
              </h3>
              {p.gender && (
                <p className="text-sm text-slate-500 capitalize mt-1">{p.gender}</p>
              )}
              {p.medicalRequirements && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                  {p.medicalRequirements}
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/user/patients/edit?edit=${p._id}`)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDeleteTarget(p._id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove patient"
        message="This profile will be removed. Existing bookings are not affected."
        confirmLabel="Remove"
      />
    </UserPageLayout>
  );
};

export default Patients;
