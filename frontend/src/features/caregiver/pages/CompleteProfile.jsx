import { GENDER_OPTIONS, AVAILABLE_TIMINGS, LANGUAGES, COMPLETE_PROFILE_STEPS, PRICING_RATE_FIELDS, caregiverSchema as schema } from "@/constants";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, Search, ChevronDown, X } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { completeProfile, getMyProfile, updateProfile } from "../api/caregiver.api";
import { getAllServices } from "../../service/api/service.api";
import { useAuth } from "../../../context/AuthContext";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import { indianStates, getCitiesByState } from "@/constants";

import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Checkbox from "../../../components/ui/Checkbox";
import Textarea from "../../../components/ui/Textarea";
import Input from "../../../components/ui/Input";

const steps = COMPLETE_PROFILE_STEPS;

const ServiceDropdown = ({ field, services }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const selectedServices = services.filter(s => field.value.includes(s._id));
  const filteredServices = services.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative">
      <div 
        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2">
          {selectedServices.length === 0 ? (
            <span className="text-slate-400 text-sm">Select services...</span>
          ) : (
            selectedServices.map(s => (
              <span key={s._id} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded text-xs flex items-center gap-1">
                {s.title}
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    field.onChange(field.value.filter(id => id !== s._id));
                  }}
                  className="hover:text-blue-900 dark:hover:text-blue-200"
                >
                  <X className="w-3 h-3" />
                </Button>
              </span>
            ))
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="p-1">
            {filteredServices.length === 0 ? (
              <div className="p-3 text-sm text-center text-slate-500">No services found</div>
            ) : (
              filteredServices.map(service => {
                const isSelected = field.value.includes(service._id);
                return (
                  <div
                    key={service._id}
                    onClick={() => {
                      if (isSelected) {
                        field.onChange(field.value.filter(id => id !== service._id));
                      } else {
                        if (field.value.length >= 3) {
                          toast.error("You can select maximum 3 services");
                          return;
                        }
                        field.onChange([...field.value, service._id]);
                      }
                      setSearch("");
                    }}
                    className={`px-3 py-2 rounded-md cursor-pointer text-sm flex items-center justify-between ${
                      isSelected 
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium" 
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span>{service.title}</span>
                    {isSelected && <CheckCircle className="w-4 h-4" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CompleteProfile = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
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
      // availableTiming removed
      pricing: { hourlyRate: "", dailyRate: "", monthlyRate: "" },
    },
    mode: "onTouched",
  });

  const watchState = watch("location.state");

  useEffect(() => {
    setServicesLoading(true);
    getAllServices({ isActive: true, limit: 1000 })
      .then((res) => setServices(res?.data?.services || []))
      .catch(() => toast.error("Could not load services. Please refresh the page."))
      .finally(() => setServicesLoading(false));
  }, []);

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        const cg = res?.data?.caregiver;
        if (!cg) return;
        const hasData = cg.profileCompleted || cg.fullName || cg.bio;
        if (!hasData) return;

        setIsEditMode(true);
        const serviceIds = (cg.servicesOffered || [])
          .filter((s) => s !== null)
          .map((s) => (typeof s === "object" ? s._id : s));

        reset({
          fullName: cg.fullName || user?.name || "",
          email: cg.email || user?.email || "",
          contactNumber: cg.contactNumber || user?.phone || "",
          alternateContact: cg.alternateContact || "",
          gender: cg.gender || "",
          age: cg.age ?? "",
          experienceYears: cg.experienceYears ?? "",
          bio: cg.bio || "",
          servicesOffered: serviceIds,
          languages: cg.languages || [],
          location: {
            state: cg.location?.state || "",
            city: cg.location?.city || "",
            pincode: cg.location?.pincode || "",
            fullAddress: cg.location?.fullAddress || "",
          },
          // availableTiming removed
          pricing: {
            hourlyRate: cg.pricing?.hourlyRate ?? "",
            dailyRate: cg.pricing?.dailyRate ?? "",
            monthlyRate: cg.pricing?.monthlyRate ?? "",
          },
        });

        if (cg.location?.state) {
          setCities(getCitiesByState(cg.location.state).map((c) => ({ value: c, label: c })));
        }
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, [reset, user]);

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
      
      if (isEditMode) {
        await updateProfile(payload);
        toast.success("Profile updated successfully.");
      } else {
        await completeProfile(payload);
        toast.success("Profile completed! Waiting for admin approval.");
      }
      navigate("/caregiver/profile");
    } catch (error) {
      const apiMessage = error?.message || error?.response?.data?.message;
      if (apiMessage && apiMessage !== "Something went wrong!") {
        toast.error(apiMessage);
        setLoading(false);
        return;
      }
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
              <Input
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
                <Input
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
                <Input
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
              <Input
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
                <Input
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
              <Input
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
              {servicesLoading ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">Loading services...</p>
              ) : services.length === 0 ? (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  No active services found. Ask an admin to add services before completing your profile.
                </p>
              ) : (
                <Controller
                  name="servicesOffered"
                  control={control}
                  render={({ field }) => {
                    return <ServiceDropdown field={field} services={services} />;
                  }}
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
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...field.value, lang]);
                            } else {
                              field.onChange(field.value.filter(l => l !== lang));
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
                    searchable
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
                    searchable
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
              <Input
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
            {/* Available Timing removed */}
            <div>
              <h3 className="text-base font-medium text-slate-900 dark:text-white mb-4">
                Pricing (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {PRICING_RATE_FIELDS.map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {label}
                    </label>
                    <Input
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

  if (!user?.isApproved) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Account pending approval</h1>
          <p className="text-slate-600 dark:text-slate-400">
            An admin must approve your caregiver registration before you can complete your profile.
          </p>
          <Button type="button" onClick={() => navigate("/caregiver/pending-approval")}>
            View status
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
          <div className="group flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 cursor-pointer" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4 duration-300" /> Back to previous page</div>
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
