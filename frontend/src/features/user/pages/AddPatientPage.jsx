import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import UserPageLayout from "../../../layout/dashboard/UserPageLayout";
import { createPatient, updatePatient, getMyPatients } from "../../patient/api/patient.api";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";
import { GENDER_OPTIONS } from "../../../constants/caregiverConstants";

const emptyForm = {
  name: "",
  age: "",
  gender: "",
  medicalRequirements: "",
  healthInformation: "",
  emergencyContact: { name: "", phone: "", relation: "" },
};

const AddPatientPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editId) return;
    getMyPatients().then((res) => {
      const p = (res?.data?.patients || []).find((x) => x._id === editId);
      if (p) {
        setForm({
          name: p.name,
          age: String(p.age),
          gender: p.gender || "",
          medicalRequirements: p.medicalRequirements || "",
          healthInformation: p.healthInformation || "",
          emergencyContact: p.emergencyContact || { name: "", phone: "", relation: "" },
        });
      }
    });
  }, [editId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.age) {
      toast.error("Name and age are required");
      return;
    }
    try {
      setSaving(true);
      const payload = { ...form, age: Number(form.age) };
      if (editId) {
        await updatePatient(editId, payload);
        toast.success("Patient updated");
      } else {
        await createPatient(payload);
        toast.success("Patient created");
      }
      navigate("/user/patients");
    } catch (err) {
      toast.error(err.message || "Failed to save patient");
    } finally {
      setSaving(false);
    }
  };

  return (
    <UserPageLayout
      title={editId ? "Edit patient" : "Add patient"}
      description="Create a profile for someone receiving care. This speeds up future bookings."
      backTo="/user/patients"
      backLabel="Back to patients"
    >
      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Full name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Patient full name"
          />
          <Input
            label="Age *"
            type="number"
            min="1"
            max="150"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            required
            placeholder="e.g. 72"
          />
        </div>

        <Select
          label="Gender"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          options={GENDER_OPTIONS}
          placeholder="Select gender"
        />

        <Textarea
          label="Medical requirements"
          value={form.medicalRequirements}
          onChange={(e) => setForm({ ...form, medicalRequirements: e.target.value })}
          rows={3}
          placeholder="Mobility needs, medications, special care instructions..."
        />

        <Textarea
          label="Health information"
          value={form.healthInformation}
          onChange={(e) => setForm({ ...form, healthInformation: e.target.value })}
          rows={3}
          placeholder="Conditions, allergies, doctor notes..."
        />

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Emergency contact</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Name"
              value={form.emergencyContact.name}
              onChange={(e) =>
                setForm({ ...form, emergencyContact: { ...form.emergencyContact, name: e.target.value } })
              }
              placeholder="Contact name"
            />
            <Input
              label="Phone"
              value={form.emergencyContact.phone}
              onChange={(e) =>
                setForm({ ...form, emergencyContact: { ...form.emergencyContact, phone: e.target.value } })
              }
              placeholder="10-digit mobile"
            />
            <Input
              label="Relation"
              value={form.emergencyContact.relation}
              onChange={(e) =>
                setForm({ ...form, emergencyContact: { ...form.emergencyContact, relation: e.target.value } })
              }
              placeholder="Son, daughter, etc."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={() => navigate("/user/patients")}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : editId ? "Update patient" : "Save patient"}
          </Button>
        </div>
      </form>
    </UserPageLayout>
  );
};

export default AddPatientPage;
