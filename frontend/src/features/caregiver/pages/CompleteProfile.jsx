import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { completeProfile } from "../api/caregiver.api";
import { getAllServices } from "../../service/api/service.api";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import { indianStates, getCitiesByState } from "../data/locations";
import { GENDER_OPTIONS, AVAILABLE_TIMINGS, LANGUAGES } from "../../../utils/constants";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";
import Checkbox from "../../../components/ui/Checkbox";

const steps = [
  { id: 1, title: "Personal Information" },
  { id: 2, title: "Experience & Bio" },
  { id: 3, title: "Services & Skills" },
  { id: 4, title: "Location" },
  { id: 5, title: "Availability & Pricing" },
];

const initialForm = {
  fullName: "",
  email: "",
  contactNumber: "",
  alternateContact: "",
  gender: "",
  age: "",
  experienceYears: "",
  bio: "",
  servicesOffered: [],
  languages: [],
  certifications: [],
  location: { state: "", city: "", pincode: "", fullAddress: "" },
  availableTiming: "",
  pricing: { hourlyRate: "", dailyRate: "", monthlyRate: "" },
};

const CompleteProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getAllServices({ isActive: true })
      .then((res) => setServices(res?.data?.services || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (form.location.state) {
      setCities(getCitiesByState(form.location.state).map((c) => ({ value: c, label: c })));
      setForm((prev) => ({ ...prev, location: { ...prev.location, city: "" } }));
    }
  }, [form.location.state]);

  const set = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setNested = (parent, field, value) =>
    setForm((prev) => ({ ...prev, [parent]: { ...prev[parent], [field]: value } }));

  const validateStep = () => {
    const e = {};
    if (currentStep === 1) {
      if (!form.fullName.trim()) e.fullName = "Full name is required";
      if (!form.email.trim()) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
      if (!form.contactNumber.trim()) e.contactNumber = "Contact number is required";
      else if (!/^[6-9]\d{9}$/.test(form.contactNumber)) e.contactNumber = "Invalid Indian mobile number";
      if (form.alternateContact && !/^[6-9]\d{9}$/.test(form.alternateContact))
        e.alternateContact = "Invalid alternate contact";
      if (!form.gender) e.gender = "Please select gender";
      if (!form.age) e.age = "Age is required";
      else if (Number(form.age) < 18 || Number(form.age) > 80) e.age = "Age must be between 18-80";
    }
    if (currentStep === 2) {
      if (!form.experienceYears && form.experienceYears !== 0) e.experienceYears = "Experience is required";
      if (!form.bio.trim()) e.bio = "Bio is required";
      else if (form.bio.trim().length < 50) e.bio = "Bio must be at least 50 characters";
    }
    if (currentStep === 3) {
      if (!form.servicesOffered.length) e.servicesOffered = "Select at least one service";
      if (!form.languages.length) e.languages = "Select at least one language";
    }
    if (currentStep === 4) {
      if (!form.location.state) e.state = "Please select state";
      if (!form.location.city) e.city = "Please select city";
      if (!form.location.pincode) e.pincode = "Pincode is required";
      else if (!/^\d{6}$/.test(form.location.pincode)) e.pincode = "Pincode must be 6 digits";
      if (!form.location.fullAddress.trim()) e.fullAddress = "Full address is required";
      else if (form.location.fullAddress.trim().length < 10) e.fullAddress = "Address must be at least 10 characters";
    }
    if (currentStep === 5) {
      if (!form.availableTiming) e.availableTiming = "Please select available timing";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setCurrentStep((p) => Math.min(p + 1, steps.length));
  };

  const prevStep = () => {
    setErrors({});
    setCurrentStep((p) => Math.max(p - 1, 1));
  };

  const handleServiceToggle = (id) => {
    const current = form.servicesOffered;
    if (current.includes(id)) {
      set("servicesOffered", current.filter((s) => s !== id));
    } else {
      if (current.length >= 3) { toast.error("You can select maximum 3 services"); return; }
      set("servicesOffered", [...current, id]);
    }
  };

  const handleLanguageToggle = (lang) => {
    const current = form.languages;
    set("languages", current.includes(lang) ? current.filter((l) => l !== lang) : [...current, lang]);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    try {
      setLoading(true);
      const payload = {
        ...form,
        age: Number(form.age),
        experienceYears: Number(form.experienceYears),
        pricing: {
          hourlyRate: form.pricing.hourlyRate ? Number(form.pricing.hourlyRate) : undefined,
          dailyRate: form.pricing.dailyRate ? Number(form.pricing.dailyRate) : undefined,
          monthlyRate: form.pricing.monthlyRate ? Number(form.pricing.monthlyRate) : undefined,
        },
      };
      await completeProfile(payload);
      toast.success("Profile completed! Waiting for admin approval.");
      navigate("/caregiver/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm";

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                className={inputClass}
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className={inputClass}
                  placeholder="10-digit mobile number"
                  value={form.contactNumber}
                  onChange={(e) => set("contactNumber", e.target.value)}
                />
                {errors.contactNumber && <p className="mt-1 text-sm text-red-500">{errors.contactNumber}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Alternate Contact
              </label>
              <input
                type="tel"
                className={inputClass}
                placeholder="Optional alternate number"
                value={form.alternateContact}
                onChange={(e) => set("alternateContact", e.target.value)}
              />
              {errors.alternateContact && <p className="mt-1 text-sm text-red-500">{errors.alternateContact}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Select
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
                options={GENDER_OPTIONS}
                error={errors.gender}
                required
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="Your age"
                  value={form.age}
                  onChange={(e) => set("age", e.target.value)}
                />
                {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className={inputClass}
                placeholder="e.g. 3"
                value={form.experienceYears}
                onChange={(e) => set("experienceYears", e.target.value)}
              />
              {errors.experienceYears && <p className="mt-1 text-sm text-red-500">{errors.experienceYears}</p>}
            </div>
            <Textarea
              label="Bio / About Yourself"
              name="bio"
              rows={6}
              placeholder="Tell families about your experience, approach to care, and what makes you special... (min 50 characters)"
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              error={errors.bio}
              required
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Services Offered (Select up to 3) <span className="text-red-500">*</span>
              </label>
              {services.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">Loading services...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      onClick={() => handleServiceToggle(service._id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        form.servicesOffered.includes(service._id)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={form.servicesOffered.includes(service._id)}
                          onChange={() => handleServiceToggle(service._id)}
                        />
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                            {service.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {errors.servicesOffered && (
                <p className="mt-1 text-sm text-red-500">{errors.servicesOffered}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Languages <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {LANGUAGES.map((lang) => (
                  <Checkbox
                    key={lang}
                    label={lang}
                    name={`lang-${lang}`}
                    checked={form.languages.includes(lang)}
                    onChange={() => handleLanguageToggle(lang)}
                  />
                ))}
              </div>
              {errors.languages && (
                <p className="mt-1 text-sm text-red-500">{errors.languages}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Select
                label="State"
                name="state"
                value={form.location.state}
                onChange={(e) => setNested("location", "state", e.target.value)}
                options={indianStates.map((s) => ({ value: s, label: s }))}
                error={errors.state}
                required
              />
              <Select
                label="City"
                name="city"
                value={form.location.city}
                onChange={(e) => setNested("location", "city", e.target.value)}
                options={cities}
                error={errors.city}
                required
                disabled={!form.location.state}
                placeholder={form.location.state ? "Select city" : "Select state first"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                className={inputClass}
                placeholder="6-digit pincode"
                value={form.location.pincode}
                onChange={(e) => setNested("location", "pincode", e.target.value)}
              />
              {errors.pincode && <p className="mt-1 text-sm text-red-500">{errors.pincode}</p>}
            </div>
            <Textarea
              label="Full Address"
              name="fullAddress"
              rows={3}
              placeholder="Enter your complete address..."
              value={form.location.fullAddress}
              onChange={(e) => setNested("location", "fullAddress", e.target.value)}
              error={errors.fullAddress}
              required
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Select
              label="Available Timing"
              name="availableTiming"
              value={form.availableTiming}
              onChange={(e) => set("availableTiming", e.target.value)}
              options={AVAILABLE_TIMINGS}
              error={errors.availableTiming}
              required
            />
            <div>
              <h3 className="text-base font-medium text-slate-900 dark:text-white mb-4">
                Pricing (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { key: "hourlyRate", label: "Hourly Rate (₹)" },
                  { key: "dailyRate", label: "Daily Rate (₹)" },
                  { key: "monthlyRate", label: "Monthly Rate (₹)" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {label}
                    </label>
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="0"
                      value={form.pricing[key]}
                      onChange={(e) => setNested("pricing", key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Complete Your Profile
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Help families find you by completing your caregiver profile
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div variants={fadeUp} className="flex justify-center overflow-x-auto pb-2">
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                      currentStep > step.id
                        ? "bg-green-500 text-white"
                        : currentStep === step.id
                        ? "bg-blue-500 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-10 h-1 mx-1 ${
                        currentStep > step.id ? "bg-green-500" : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            variants={fadeUp}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Step {currentStep}: {steps[currentStep - 1].title}
              </h2>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {renderStep()}

            <div className="flex justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              {currentStep === steps.length ? (
                <Button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="flex items-center space-x-2"
                >
                  <span>{loading ? "Submitting..." : "Complete Profile"}</span>
                  <CheckCircle className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompleteProfile;
