import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Calendar, User, Phone, MapPin, FileText } from "lucide-react";
import { createBooking } from "../../booking/api/booking.api";
import { getMyPatients } from "../../patient/api/patient.api";
import { getServiceById } from "../../service/api/service.api";
import { indianStates, getCitiesByState } from "../../caregiver/data/locations";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

const CARE_TYPES = [
  { value: "hourly", label: "Hourly" },
  { value: "part-time", label: "Part-Time" },
  { value: "full-time", label: "Full-Time" },
  { value: "live-in", label: "Live-In" },
  { value: "emergency", label: "Emergency" },
];

const DURATION_TYPES = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "long-term", label: "Long-Term" },
];

const BookServices = () => {
  const navigate = useNavigate();
  const { caregiverId: caregiverIdParam } = useParams();
  const [searchParams] = useSearchParams();
  const serviceIdParam = searchParams.get("serviceId");

  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    caregiverId: caregiverIdParam || "",
    serviceId: serviceIdParam || "",
    patientId: "",
    patientName: "",
    patientAge: "",
    disease: "",
    careType: "hourly",
    durationType: "hourly",
    contactNumber: "",
    email: "",
    emergencyContact: { name: "", phone: "", relation: "" },
    address: { street: "", city: "", state: "", pincode: "" },
    bookingDate: "",
    timeSlot: { startTime: "", endTime: "" },
    notes: "",
  });

  useEffect(() => {
    getMyPatients()
      .then((res) => setPatients(res?.data?.patients || []))
      .catch(() => {});
    if (serviceIdParam) {
      getServiceById(serviceIdParam).catch(() => {});
    }
  }, [serviceIdParam]);

  const setNested = (parent, field, value) => {
    setForm((prev) => {
      const newState = { ...prev, [parent]: { ...prev[parent], [field]: value } };
      if (parent === "address" && field === "state") {
        setCities(getCitiesByState(value).map((c) => ({ value: c, label: c })));
        newState.address.city = "";
      }
      return newState;
    });
  };

  const onPatientSelect = (patientId) => {
    const p = patients.find((x) => x._id === patientId);
    setForm((prev) => ({
      ...prev,
      patientId,
      patientName: p?.name || prev.patientName,
      patientAge: p?.age ? String(p.age) : prev.patientAge,
      disease: p?.medicalRequirements || prev.disease,
      emergencyContact: p?.emergencyContact?.name
        ? p.emergencyContact
        : prev.emergencyContact,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.caregiverId) {
      toast.error("Caregiver is required");
      return;
    }
    if (!form.serviceId) {
      toast.error("Please select a service from the service page");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        ...form,
        patientAge: Number(form.patientAge),
      };
      if (!payload.patientId) delete payload.patientId;
      if (!payload.patientName) delete payload.patientName;

      await createBooking(payload);
      toast.success("Booking requested successfully!");
      navigate("/user/bookings");
    } catch (error) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Book a Caregiver</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Complete the form to request care. Select an existing patient or enter details manually.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-500" /> Patient
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {patients.length > 0 && (
                <Select
                  label="Saved Patient"
                  value={form.patientId}
                  onChange={(e) => onPatientSelect(e.target.value)}
                  options={[{ value: "", label: "Enter manually" }, ...patients.map((p) => ({ value: p._id, label: `${p.name} (${p.age}y)` }))]}
                />
              )}
              <Input label="Patient Name *" placeholder="e.g. Rahul Sharma" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required disabled={!!form.patientId} />
              <Input label="Patient Age *" placeholder="e.g. 65" type="number" min="1" max="150" value={form.patientAge} onChange={(e) => setForm({ ...form, patientAge: e.target.value })} required disabled={!!form.patientId} />
              <Select label="Care Type *" value={form.careType} onChange={(e) => setForm({ ...form, careType: e.target.value })} options={CARE_TYPES} required />
              <Select label="Duration Type *" value={form.durationType} onChange={(e) => setForm({ ...form, durationType: e.target.value })} options={DURATION_TYPES} required />
              <Input label="Medical Condition *" placeholder="e.g. Diabetes, Arthritis" value={form.disease} onChange={(e) => setForm({ ...form, disease: e.target.value })} required />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Emergency Contact *</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Input label="Name" placeholder="e.g. Priya Sharma" value={form.emergencyContact.name} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, name: e.target.value } })} required />
              <Input label="Phone" placeholder="e.g. 9876543210" value={form.emergencyContact.phone} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, phone: e.target.value } })} required />
              <Input label="Relation" placeholder="e.g. Daughter" value={form.emergencyContact.relation} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, relation: e.target.value } })} required />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-blue-500" /> Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Contact Number *" placeholder="e.g. 9876543210" type="tel" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} required />
              <Input label="Email *" placeholder="e.g. john@example.com" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <input type="hidden" value={form.serviceId} />
            <input type="hidden" value={form.caregiverId} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" /> Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <Select label="State *" searchable value={form.address.state} onChange={(e) => setNested("address", "state", e.target.value)} options={indianStates.map((s) => ({ value: s, label: s }))} required />
              <Select label="City *" searchable value={form.address.city} onChange={(e) => setNested("address", "city", e.target.value)} options={cities} disabled={!form.address.state} required />
              <Input label="Pincode *" placeholder="e.g. 400001" maxLength={6} value={form.address.pincode} onChange={(e) => setNested("address", "pincode", e.target.value)} required />
            </div>
            <Textarea label="Street Address *" placeholder="e.g. 123 Main St, Apartment 4B" rows={2} value={form.address.street} onChange={(e) => setNested("address", "street", e.target.value)} required />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" /> Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Input label="Date *" type="date" min={new Date().toISOString().split("T")[0]} value={form.bookingDate} onChange={(e) => setForm({ ...form, bookingDate: e.target.value })} required />
              <Input label="Start Time *" type="time" value={form.timeSlot.startTime} onChange={(e) => setNested("timeSlot", "startTime", e.target.value)} required />
              <Input label="End Time *" type="time" value={form.timeSlot.endTime} onChange={(e) => setNested("timeSlot", "endTime", e.target.value)} required />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" /> Notes
            </h3>
            <Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Special requirements..." />
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <Button type="submit" disabled={loading} className="px-8 py-3 w-full sm:w-auto">
              {loading ? "Submitting request..." : "Request Booking"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookServices;
