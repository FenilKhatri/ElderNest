import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { completeProfile } from "../api/caregiver.api";
import { getAllServices } from "../../service/api/service.api";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import { indianStates, getCitiesByState } from "../data/locations";
import { GENDER_OPTIONS, AVAILABLE_TIMINGS, LANGUAGES } from "../../../utils/constants";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";
import Checkbox from "../../../components/ui/Checkbox";

const steps = [
  { id: 1, title: "Personal Information", fields: ["fullName", "email", "contactNumber", "alternateContact", "gender", "age"] },
  { id: 2, title: "Experience & Bio", fields: ["experienceYears", "bio"] },
  { id: 3, title: "Services & Skills", fields: ["servicesOffered", "languages"] },
  { id: 4, title: "Location", fields: ["location.state", "location.city", "location.pincode", "location.fullAddress"] },
  { id: 5, title: "Availability & Pricing", fields: ["availableTiming", "pricing.hourlyRate", "pricing.dailyRate", "pricing.monthlyRate"] },
];

const schema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  alternateContact: z.union([z.string().regex(/^[6-9]\d{9}$/, "Invalid number"), z.string().length(0)]).optional().transform(e => e === "" ? undefined : e),
  gender: z.enum(["male", "female", "other"], { errorMap: () => ({ message: "Please select a gender" }) }),
  age: z.coerce.number({ invalid_type_error: "Age is required" }).min(18, "Age must be at least 18").max(80),
  experienceYears: z.coerce.number({ invalid_type_error: "Experience is required" }).min(0).max(60),
  bio: z.string().min(50, "Bio must be at least 50 characters").max(1000),
  servicesOffered: z.array(z.string()).min(1, "Select at least 1 service").max(3, "Select up to 3 services"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  location: z.object({
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
    fullAddress: z.string().min(10, "Address must be at least 10 characters").max(300),
  }),
  availableTiming: z.enum(["morning", "afternoon", "evening", "night", "full-day", "flexible"], { errorMap: () => ({ message: "Please select availability" }) }),
  pricing: z.object({
    hourlyRate: z.coerce.number().min(0).optional().or(z.literal("")),
    dailyRate: z.coerce.number().min(0).optional().or(z.literal("")),
    monthlyRate: z.coerce.number().min(0).optional().or(z.literal("")),
  }).optional(),
});

const CompleteProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
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
      location: { state: "", city: "", pincode: "", fullAddress: "" },
      availableTiming: "",
      pricing: { hourlyRate: "", dailyRate: "", monthlyRate: "" },
    },
    mode: "onTouched",
  });

  const watchState = watch("location.state");

  useEffect(() => {
    getAllServices({ isActive: true })
      .then((res) => setServices(res?.data?.services || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (watchState) {
      setCities(getCitiesByState(watchState).map((c) => ({ value: c, label: c })));
      // Reset city when state changes, unless it's already empty
      if (watch("location.city")) {
        setValue("location.city", "");
      }
    }
  }, [watchState, setValue, watch]);

  const nextStep = async () => {
    const fieldsToValidate = steps[currentStep - 1].fields;
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((p) => Math.min(p + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((p) => Math.max(p - 1, 1));
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        pricing: {
          hourlyRate: data.pricing?.hourlyRate ? Number(data.pricing.hourlyRate) : undefined,
          dailyRate: data.pricing?.dailyRate ? Number(data.pricing.dailyRate) : undefined,
          monthlyRate: data.pricing?.monthlyRate ? Number(data.pricing.monthlyRate) : undefined,
        },
      };
      
      await completeProfile(payload);
      toast.success("Profile completed! Waiting for admin approval.");
      navigate("/caregiver/dashboard");
    } catch (error) {
      if (error.validationErrors && typeof error.validationErrors === 'object') {
        const backendErrors = {};
        if (Array.isArray(error.validationErrors)) {
            error.validationErrors.forEach(err => {
                backendErrors[err.path || err.param] = err.msg || err.message;
            });
        } else {
            Object.assign(backendErrors, error.validationErrors);
        }
        
        let errorStep = currentStep;
        
        Object.entries(backendErrors).forEach(([key, msg]) => {
          setError(key, { type: "server", message: msg });
          // Find which step this error belongs to
          const stepIndex = steps.findIndex(s => s.fields.some(f => f.startsWith(key) || key.startsWith(f)));
          if (stepIndex !== -1 && stepIndex + 1 < errorStep) {
            errorStep = stepIndex + 1;
          }
        });
        
        setCurrentStep(errorStep);
        toast.error("Please fix the validation errors in the form.");
      } else {
        toast.error(error.message || "Failed to complete profile");
      }
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
                {...register("fullName")}
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
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
                  {...register("email")}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className={inputClass}
                  placeholder="10-digit mobile number"
                  {...register("contactNumber")}
                />
                {errors.contactNumber && <p className="mt-1 text-sm text-red-500">{errors.contactNumber.message}</p>}
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
                {...register("alternateContact")}
              />
              {errors.alternateContact && <p className="mt-1 text-sm text-red-500">{errors.alternateContact.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Gender"
                    options={GENDER_OPTIONS}
                    error={errors.gender?.message}
                    required
                    {...field}
                  />
                )}
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="Your age"
                  {...register("age")}
                />
                {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age.message}</p>}
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
                {...register("experienceYears")}
              />
              {errors.experienceYears && <p className="mt-1 text-sm text-red-500">{errors.experienceYears.message}</p>}
            </div>
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Bio / About Yourself"
                  rows={6}
                  placeholder="Tell families about your experience, approach to care, and what makes you special... (min 50 characters)"
                  error={errors.bio?.message}
                  required
                  {...field}
                />
              )}
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
                <Controller
                  name="servicesOffered"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {services.map((service) => {
                        const isChecked = field.value.includes(service._id);
                        return (
                          <div
                            key={service._id}
                            onClick={() => {
                              if (isChecked) {
                                field.onChange(field.value.filter(id => id !== service._id));
                              } else {
                                if (field.value.length >= 3) {
                                  toast.error("You can select maximum 3 services");
                                  return;
                                }
                                field.onChange([...field.value, service._id]);
                              }
                            }}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              isChecked
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <Checkbox
                                checked={isChecked}
                                onChange={() => {}} // Handled by parent div
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
                        );
                      })}
                    </div>
                  )}
                />
              )}
              {errors.servicesOffered && (
                <p className="mt-1 text-sm text-red-500">{errors.servicesOffered.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Languages <span className="text-red-500">*</span>
              </label>
              <Controller
                name="languages"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {LANGUAGES.map((lang) => {
                      const isChecked = field.value.includes(lang);
                      return (
                        <Checkbox
                          key={lang}
                          label={lang}
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              field.onChange(field.value.filter(l => l !== lang));
                            } else {
                              field.onChange([...field.value, lang]);
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              />
              {errors.languages && (
                <p className="mt-1 text-sm text-red-500">{errors.languages.message}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Controller
                name="location.state"
                control={control}
                render={({ field }) => (
                  <Select
                    label="State"
                    options={indianStates.map((s) => ({ value: s, label: s }))}
                    error={errors.location?.state?.message}
                    required
                    {...field}
                  />
                )}
              />
              <Controller
                name="location.city"
                control={control}
                render={({ field }) => (
                  <Select
                    label="City"
                    options={cities}
                    error={errors.location?.city?.message}
                    required
                    disabled={!watchState}
                    placeholder={watchState ? "Select city" : "Select state first"}
                    {...field}
                  />
                )}
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
                {...register("location.pincode")}
              />
              {errors.location?.pincode && <p className="mt-1 text-sm text-red-500">{errors.location.pincode.message}</p>}
            </div>
            <Controller
              name="location.fullAddress"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Full Address"
                  rows={3}
                  placeholder="Enter your complete address..."
                  error={errors.location?.fullAddress?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Controller
              name="availableTiming"
              control={control}
              render={({ field }) => (
                <Select
                  label="Available Timing"
                  options={AVAILABLE_TIMINGS}
                  error={errors.availableTiming?.message}
                  required
                  {...field}
                />
              )}
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
                      {...register(`pricing.${key}`)}
                    />
                    {errors.pricing?.[key] && <p className="mt-1 text-sm text-red-500">{errors.pricing[key].message}</p>}
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
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
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
                  type="submit"
                  disabled={loading}
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
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default CompleteProfile;
