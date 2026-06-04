  indianStates,
  getCitiesByState,
} from "@/constants";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Calendar,
  User,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  Clock,
  Shield,
  CreditCard,
} from "lucide-react";
import {
  createBooking,
  createPaymentOrder,
  verifyPayment,
  getRazorpayKey,
  getAvailableSlots,
} from "../../booking/api/booking.api";
import { getMyPatients } from "../../patient/api/patient.api";
import { getCaregiverById } from "../../caregiver/api/caregiver.api";

import { loadRazorpayScript } from "../../../utils/loadRazorpay";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

const BookServices = () => {
  const navigate = useNavigate();
  const { caregiverId } = useParams();
  const [searchParams] = useSearchParams();
  const serviceIdParam = searchParams.get("serviceId");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [caregiver, setCaregiver] = useState(null);
  const [cities, setCities] = useState([]);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [form, setForm] = useState({
    caregiverId: caregiverId || "",
    serviceId: serviceIdParam || "",
    patientId: "",
    patientName: "",
    patientAge: "",
    disease: "",
    serviceType: "hourly",
    billingType: "hourly",
    quantity: 1,
    contactNumber: "",
    email: "",
    emergencyContact: { name: "", phone: "", relation: "" },
    address: { street: "", city: "", state: "", pincode: "" },
    bookingDate: "",
    timeSlot: { startTime: "", endTime: "" },
    notes: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, caregiverRes] = await Promise.all([
          getMyPatients().catch(() => ({ data: { patients: [] } })),
          getCaregiverById(caregiverId).catch(() => null),
        ]);
        setPatients(patientsRes?.data?.patients?.filter(p => p.status !== "draft") || []);
        if (caregiverRes?.data?.caregiver) {
          const cg = caregiverRes.data.caregiver;
          setCaregiver(cg);
          // Auto-select service if passed, otherwise default to first service
          let selectedService = serviceIdParam;
          if (!selectedService && cg.servicesOffered?.length > 0) {
            selectedService = cg.servicesOffered[0]._id;
          }
          if (selectedService) {
            setForm((prev) => ({ ...prev, serviceId: selectedService }));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [caregiverId, serviceIdParam]);
  const setNested = (parent, field, value) => {
    setForm((prev) => {
      const newState = {
        ...prev,
        [parent]: { ...prev[parent], [field]: value },
      };
      if (parent === "address" && field === "state") {
        setCities(getCitiesByState(value).map((c) => ({ value: c, label: c })));
        newState.address.city = "";
      }
      return newState;
    });
  };
  const onPatientSelect = (patientId) => {
    const p = patients.find((x) => x._id === patientId);
    if (!p) return;

    if (p?.address?.state) {
      setCities(getCitiesByState(p.address.state).map((c) => ({ value: c, label: c })));
    }

    setForm((prev) => {
      let age = prev.patientAge;
      if (p?.dob) {
        const birthDate = new Date(p.dob);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }
        age = String(calculatedAge);
      } else if (p?.age) {
        age = String(p.age);
      }

      return {
        ...prev,
        patientId,
        patientName: p?.name || prev.patientName,
        patientAge: age,
        disease: p?.medicalConditions?.length ? p.medicalConditions.join(", ") : prev.disease,
        emergencyContact: {
          name: p?.emergencyContact?.contactName || prev.emergencyContact.name,
          phone: p?.emergencyContact?.primaryPhone || prev.emergencyContact.phone,
          relation: p?.emergencyContact?.relationship || prev.emergencyContact.relation,
        },
        address: {
          street: p?.address?.street || prev.address.street || "",
          city: p?.address?.city || prev.address.city || "",
          state: p?.address?.state || prev.address.state || "",
          pincode: p?.address?.pincode || prev.address.pincode || ""
        }
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.caregiverId) return toast.error("Caregiver is required");
    if (!form.serviceId) return toast.error("Please select a service");
    try {
      setLoading(true);
      setPaymentProcessing(true);
      const payload = { ...form, patientAge: Number(form.patientAge) };
      if (!payload.patientId) delete payload.patientId;
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error(
          "Failed to load payment gateway. Please check your internet connection.",
        );
        return;
      }
      const keyRes = await getRazorpayKey();
      const razorpayKey = keyRes?.data?.key;
      if (!razorpayKey) {
        toast.error(
          "Payment gateway configuration error. Please try again later.",
        );
        return;
      }
      const orderRes = await createPaymentOrder(payload);
      const { orderId, amount, currency } = orderRes?.data || {};
      if (!orderId) {
        toast.error("Failed to create payment order. Please try again.");
        return;
      }
      const options = {
        key: razorpayKey,
        amount,
        currency,
        name: "ElderNest",
        description: `Booking — ${form.serviceType} Care Service`,
        order_id: orderId,
        prefill: {
          name: form.patientName,
          email: form.email,
          contact: form.contactNumber,
        },
        theme: {
          color: "#2563eb",
        },
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: payload,
            });
            toast.success("Payment successful! Booking confirmed.");
            navigate("/user/bookings");
          } catch (verifyError) {
            toast.error(
              verifyError?.message ||
                "Payment verification failed. Please contact support.",
            );
          } finally {
            setPaymentProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentProcessing(false);
            toast.info("Payment cancelled. No booking was created.");
          },
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        setPaymentProcessing(false);
        toast.error(
          `Payment failed: ${response.error?.description || "Unknown error"}`,
        );
      });
      razorpay.open();
    } catch (error) {
      if (error.validationErrors && error.validationErrors.length > 0) {
        toast.error(
          error.validationErrors[0].msg ||
            "Please fill all required fields correctly.",
        );
      } else {
        toast.error(
          error?.response?.data?.message ||
          error?.message ||
          "Unknown error"
        );
      }
      setPaymentProcessing(false);
    } finally {
      setLoading(false);
    }
  };
  if (initialLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (!caregiver) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Caregiver Not Found
        </h2>
        <Button onClick={() => navigate("/caregivers")} className="mt-4">
          Browse Caregivers
        </Button>
      </div>
    );
  }
  const hasServices =
    caregiver.servicesOffered && caregiver.servicesOffered.length > 0;
  // Note: we no longer check caregiver.availability directly as it is now managed via CaregiverAvailability blocks on the backend.
  if (!hasServices) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Caregiver Unavailable
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          This caregiver has not configured their services yet and cannot be
          booked at this time.
        </p>
        <Button onClick={() => navigate("/caregivers")} className="mt-6">
          Browse Other Caregivers
        </Button>
      </div>
    );
  }
  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setForm((prev) => ({
      ...prev,
      bookingDate: newDate,
      timeSlot: { startTime: "", endTime: "" },
    }));
    if (newDate && form.caregiverId) {
      setSlotsLoading(true);
      try {
        const res = await getAvailableSlots(form.caregiverId, newDate);
        setAvailableSlots(res?.data?.slots || []);
      } catch (error) {
        toast.error("Failed to load available slots");
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    } else {
      setAvailableSlots([]);
    }
  };
  
  const handleServiceTypeChange = (e) => {
    const val = e.target.value;
    let billing = "hourly";
    if (val === "part-time" || val === "full-time") billing = "daily";
    else if (val === "live-in") billing = "monthly";
    else billing = "hourly";
    
    setForm({ ...form, serviceType: val, billingType: billing, quantity: 1 });
  };

  const getPricingDetails = () => {
    if (!caregiver || !caregiver.pricing) return { rate: 0, label: "Rate", quantityLabel: "Quantity", total: 0 };
    
    let rate = 0;
    let label = "Rate";
    let quantityLabel = "Quantity";
    
    if (form.billingType === "hourly") {
      rate = caregiver.pricing.hourlyRate || 0;
      label = "Hourly Rate";
      quantityLabel = "Hours";
    } else if (form.billingType === "daily") {
      rate = caregiver.pricing.dailyRate || 0;
      label = "Daily Rate";
      quantityLabel = "Days";
    } else if (form.billingType === "monthly") {
      rate = caregiver.pricing.monthlyRate || 0;
      label = "Monthly Rate";
      quantityLabel = "Months";
    }
    
    return { rate, label, quantityLabel, total: rate * (form.quantity || 1) };
  };

  const pricing = getPricingDetails();
  const slotOptions = availableSlots.map((slot) => ({
    value: `${slot.startTime}-${slot.endTime}`,
    label: `${slot.startTime} to ${slot.endTime} ${!slot.available ? "(Unavailable)" : ""}`,
    disabled: !slot.available,
  }));
  return (
    <div className="w-full max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Book Caregiver
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Complete the details below to request a booking.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Form Section */}
        <div className="w-full lg:w-2/3 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" /> Select Service
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Select
                  label="Required Service *"
                  value={form.serviceId}
                  onChange={(e) =>
                    setForm({ ...form, serviceId: e.target.value })
                  }
                  options={
                    caregiver.servicesOffered?.map((s) => ({
                      value: s._id,
                      label: s.title || s.name,
                    })) || []
                  }
                  required
                />
                <Select
                  label="Care Mode *"
                  value={form.serviceType}
                  onChange={handleServiceTypeChange}
                  options={[
                    { value: "hourly", label: "Hourly Care" },
                    { value: "part-time", label: "Part-Time Care" },
                    { value: "full-time", label: "Full-Time Care" },
                    { value: "live-in", label: "Live-In Care" },
                    { value: "emergency", label: "Emergency Care" }
                  ]}
                  required
                />
                <Input
                  labelName={pricing.quantityLabel + " *"}
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{pricing.label}:</span>
                  <span className="text-slate-900 dark:text-white font-bold">₹{pricing.rate}</span>
                </div>
                <div className="flex justify-between items-center border-t border-blue-200 dark:border-blue-700/50 pt-2 mt-2">
                  <span className="text-slate-800 dark:text-slate-200 font-bold text-lg">Total Amount:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">₹{pricing.total}</span>
                </div>
              </div>
            </div>
            {/* Patient Information */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" /> Patient Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                {patients.length > 0 && (
                  <Select
                    label="Saved Patient"
                    value={form.patientId}
                    onChange={(e) => onPatientSelect(e.target.value)}
                    options={[
                      { value: "", label: "Enter manually" },
                      ...patients.map((p) => ({
                        value: p._id,
                        label: `${p.name} (${p.age}y)`,
                      })),
                    ]}
                  />
                )}
                <Input
                  labelName="Patient Name *"
                  placeholder="e.g. Rahul Sharma"
                  value={form.patientName}
                  onChange={(e) =>
                    setForm({ ...form, patientName: e.target.value })
                  }
                  required
                  disabled={!!form.patientId}
                />
                <Input
                  labelName="Patient Age *"
                  placeholder="e.g. 65"
                  type="number"
                  min="1"
                  max="150"
                  value={form.patientAge}
                  onChange={(e) =>
                    setForm({ ...form, patientAge: e.target.value })
                  }
                  required
                  disabled={!!form.patientId}
                />
                <Input
                  labelName="Medical Condition *"
                  placeholder="e.g. Diabetes, Arthritis"
                  value={form.disease}
                  onChange={(e) =>
                    setForm({ ...form, disease: e.target.value })
                  }
                  required
                />
              </div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-6 mb-3">
                Emergency Contact *
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Input
                  labelName="Name"
                  placeholder="e.g. Aman Sharma"
                  value={form.emergencyContact.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      emergencyContact: {
                        ...form.emergencyContact,
                        name: e.target.value,
                      },
                    })
                  }
                  required
                />
                <Input
                  labelName="Phone"
                  placeholder="e.g. 9876543210"
                  value={form.emergencyContact.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      emergencyContact: {
                        ...form.emergencyContact,
                        phone: e.target.value,
                      },
                    })
                  }
                  required
                />
                <Input
                  labelName="Relation"
                  placeholder="e.g. Son"
                  value={form.emergencyContact.relation}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      emergencyContact: {
                        ...form.emergencyContact,
                        relation: e.target.value,
                      },
                    })
                  }
                  required
                />
              </div>
            </div>
            {/* Location & Contact */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" /> Location &
                Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <Input
                  labelName="Your Contact Number *"
                  placeholder="e.g. 9876543210"
                  type="tel"
                  value={form.contactNumber}
                  onChange={(e) =>
                    setForm({ ...form, contactNumber: e.target.value })
                  }
                  required
                />
                <Input
                  labelName="Your Email *"
                  placeholder="e.g. john@example.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <Select
                  label="State *"
                  searchable
                  value={form.address.state}
                  onChange={(e) =>
                    setNested("address", "state", e.target.value)
                  }
                  options={indianStates.map((s) => ({ value: s, label: s }))}
                  required
                />
                <Select
                  label="City *"
                  searchable
                  value={form.address.city}
                  onChange={(e) => setNested("address", "city", e.target.value)}
                  options={cities}
                  disabled={!form.address.state}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2">
                  <Textarea
                    label="Street Address *"
                    placeholder="e.g. 123 Main St, Apartment 4B"
                    rows={2}
                    value={form.address.street}
                    onChange={(e) =>
                      setNested("address", "street", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Input
                    labelName="Pincode *"
                    placeholder="e.g. 400001"
                    maxLength={6}
                    value={form.address.pincode}
                    onChange={(e) =>
                      setNested("address", "pincode", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>
            {/* Schedule */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" /> Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Input
                  labelName="Start Date *"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.bookingDate}
                  onChange={handleDateChange}
                  required
                />
                <div className="md:col-span-2">
                  <Select
                    label="Time Slot *"
                    value={
                      form.timeSlot.startTime
                        ? `${form.timeSlot.startTime}-${form.timeSlot.endTime}`
                        : ""
                    }
                    onChange={(e) => {
                      if (!e.target.value) {
                        setForm((prev) => ({
                          ...prev,
                          timeSlot: { startTime: "", endTime: "" },
                        }));
                        return;
                      }
                      const [start, end] = e.target.value.split("-");
                      setForm((prev) => ({
                        ...prev,
                        timeSlot: { startTime: start, endTime: end },
                      }));
                    }}
                    placeholder={
                      !form.bookingDate
                        ? "Select a date first"
                        : slotsLoading
                          ? "Loading slots..."
                          : slotOptions.length === 0
                            ? "No availability on this day"
                            : "Select a time slot"
                    }
                    options={slotOptions}
                    disabled={
                      !form.bookingDate ||
                      slotsLoading ||
                      slotOptions.length === 0
                    }
                    required
                  />
                </div>
              </div>
            </div>
            {/* Notes */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" /> Additional
                Notes
              </h3>
              <Textarea
                rows={4}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any specific requirements or instructions for the caregiver..."
              />
            </div>
            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                disabled={loading || paymentProcessing}
                className="px-10 py-3.5 text-lg font-bold w-full sm:w-auto shadow-md flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                {paymentProcessing
                  ? "Processing Payment..."
                  : loading
                    ? "Preparing..."
                    : "Pay & Confirm Booking"}
              </Button>
            </div>
          </form>
        </div>
        {/* Sticky Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Selected Caregiver
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    caregiver.profileImage ||
                    caregiver.userId?.profileImage ||
                    `https://ui-avatars.com/api/?name=${caregiver.userId?.name}`
                  }
                  alt={caregiver.userId?.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 dark:border-blue-900"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {caregiver.userId?.name}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                    {caregiver.gender} • {caregiver.experienceYears} Yrs Exp
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-sm border-t border-slate-100 dark:border-slate-700 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Location</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {caregiver.location?.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rating</span>
                  <span className="font-medium text-slate-900 dark:text-white flex items-center">
                    {caregiver.rating || "New"}{" "}
                    <span className="text-yellow-500 ml-1">★</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Availability</span>
                  <span className="font-medium text-slate-900 dark:text-white capitalize">
                    {caregiver.availableTiming}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                Booking Information
              </h3>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 shrink-0 mt-0.5" />
                  <span>No upfront payment required to request.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 shrink-0 mt-0.5" />
                  <span>
                    You can communicate with the caregiver before confirming.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 shrink-0 mt-0.5" />
                  <span>Your details are kept secure and confidential.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookServices;
