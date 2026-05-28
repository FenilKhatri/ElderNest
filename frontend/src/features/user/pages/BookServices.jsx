import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Calendar, User, Phone, MapPin, FileText, CheckCircle } from "lucide-react";
import { createBooking } from "../../booking/api/booking.api";
import { indianStates, getCitiesByState } from "../../caregiver/data/locations";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

const CARE_TYPES = [
  { value: "personal", label: "Personal Care" },
  { value: "medical", label: "Medical Care" },
  { value: "companionship", label: "Companionship" },
  { value: "post-surgery", label: "Post Surgery Care" },
];

const BookServices = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const caregiverIdParam = searchParams.get("caregiverId");
  
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    caregiverId: caregiverIdParam || "",
    patientName: "",
    patientAge: "",
    disease: "",
    careType: "",
    contactNumber: "",
    email: "",
    address: { street: "", city: "", state: "", pincode: "" },
    bookingDate: "",
    timeSlot: { startTime: "", endTime: "" },
    notes: ""
  });

  const setNested = (parent, field, value) => {
    setForm(prev => {
      const newState = { ...prev, [parent]: { ...prev[parent], [field]: value } };
      if (parent === "address" && field === "state") {
        setCities(getCitiesByState(value).map(c => ({ value: c, label: c })));
        newState.address.city = "";
      }
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...form,
        patientAge: Number(form.patientAge)
      };
      if (!payload.caregiverId) delete payload.caregiverId;
      
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Book a Caregiver</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Fill out the form below to request a caregiver. Our team will verify and confirm your booking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Patient Details */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-500" /> Patient Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Patient Name *"
                value={form.patientName}
                onChange={e => setForm({...form, patientName: e.target.value})}
                required
              />
              <Input
                label="Patient Age *"
                type="number"
                min="0"
                max="120"
                value={form.patientAge}
                onChange={e => setForm({...form, patientAge: e.target.value})}
                required
              />
              <Select
                label="Care Type *"
                value={form.careType}
                onChange={e => setForm({...form, careType: e.target.value})}
                options={CARE_TYPES}
                required
              />
              <Input
                label="Medical Condition / Disease"
                value={form.disease}
                onChange={e => setForm({...form, disease: e.target.value})}
                placeholder="e.g. Dementia, Diabetes..."
              />
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-blue-500" /> Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Contact Number *"
                type="tel"
                value={form.contactNumber}
                onChange={e => setForm({...form, contactNumber: e.target.value})}
                required
              />
              <Input
                label="Email Address *"
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" /> Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <Select
                label="State *"
                value={form.address.state}
                onChange={e => setNested("address", "state", e.target.value)}
                options={indianStates.map(s => ({ value: s, label: s }))}
                required
              />
              <Select
                label="City *"
                value={form.address.city}
                onChange={e => setNested("address", "city", e.target.value)}
                options={cities}
                disabled={!form.address.state}
                required
              />
              <Input
                label="Pincode *"
                maxLength={6}
                value={form.address.pincode}
                onChange={e => setNested("address", "pincode", e.target.value)}
                required
              />
            </div>
            <Textarea
              label="Full Street Address *"
              rows={2}
              value={form.address.street}
              onChange={e => setNested("address", "street", e.target.value)}
              required
            />
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" /> Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Input
                label="Start Date *"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={form.bookingDate}
                onChange={e => setForm({...form, bookingDate: e.target.value})}
                required
              />
              <Input
                label="Start Time *"
                type="time"
                value={form.timeSlot.startTime}
                onChange={e => setNested("timeSlot", "startTime", e.target.value)}
                required
              />
              <Input
                label="End Time *"
                type="time"
                value={form.timeSlot.endTime}
                onChange={e => setNested("timeSlot", "endTime", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" /> Additional Notes
            </h3>
            <Textarea
              rows={3}
              placeholder="Any specific requirements or preferences?"
              value={form.notes}
              onChange={e => setForm({...form, notes: e.target.value})}
            />
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <Button type="submit" disabled={loading} className="px-8 py-3 text-lg w-full sm:w-auto">
              {loading ? "Submitting Request..." : "Request Booking"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookServices;