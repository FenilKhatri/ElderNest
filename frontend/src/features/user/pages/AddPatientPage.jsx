import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Save, Plus, X, Bookmark } from "lucide-react";
import UserPageLayout from "../../../layout/dashboard/UserPageLayout";
import { createPatient, updatePatient, getMyPatients } from "../../patient/api/patient.api";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import { indianStates, getCitiesByState, validatePincode } from "../../../constants";

const patientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  bloodGroup: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  primaryLanguage: z.string().optional(),
  relationship: z.string().min(1, "Relationship to user is required"),
  
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (data.state && data.city) {
      const validCities = getCitiesByState(data.state);
      if (!validCities.includes(data.city)) {
        ctx.addIssue({ path: ["city"], message: "Invalid city for selected state", code: z.ZodIssueCode.custom });
      }
    }
    if (data.state && data.pincode) {
      if (!/^\d{6}$/.test(data.pincode)) {
        ctx.addIssue({ path: ["pincode"], message: "Pincode must be 6 digits", code: z.ZodIssueCode.custom });
      } else if (!validatePincode(data.pincode, data.state)) {
        ctx.addIssue({ path: ["pincode"], message: "Invalid pincode for selected state", code: z.ZodIssueCode.custom });
      }
    }
  }),

  medicalConditions: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  currentMedications: z.array(z.string()).default([]),
  mobilityStatus: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  
  emergencyContact: z.object({
    contactName: z.string().min(2, "Emergency contact name is required"),
    relationship: z.string().min(1, "Emergency relationship is required"),
    primaryPhone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
    alternatePhone: z.string().optional().or(z.literal("")),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    address: z.string().optional(),
  }),
});

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const BLOOD_GROUPS = [
  { value: "", label: "Select..." },
  { value: "A+", label: "A+" }, { value: "A-", label: "A-" },
  { value: "B+", label: "B+" }, { value: "B-", label: "B-" },
  { value: "O+", label: "O+" }, { value: "O-", label: "O-" },
  { value: "AB+", label: "AB+" }, { value: "AB-", label: "AB-" },
];

const ArrayInput = ({ label, items, setItems, placeholder }) => {
  const [val, setVal] = useState("");
  const handleAdd = (e) => {
    e.preventDefault();
    if (val.trim() && !items.includes(val.trim())) {
      setItems([...items, val.trim()]);
      setVal("");
    }
  };
  const handleRemove = (itemToRemove) => {
    setItems(items.filter((i) => i !== itemToRemove));
  };
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <div className="flex gap-2">
        <Input 
          value={val} 
          onChange={(e) => setVal(e.target.value)} 
          placeholder={placeholder}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(e); }}
        />
        <Button type="button" onClick={handleAdd} variant="outline" className="px-3 shrink-0"><Plus className="w-4 h-4" /></Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {items.map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm bg-blue-50 text-blue-700 border border-blue-200">
              {item}
              <button type="button" onClick={() => handleRemove(item)} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const AddPatientPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [patientStatus, setPatientStatus] = useState(null);
  const [cities, setCities] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      dob: "",
      gender: undefined,
      bloodGroup: "",
      height: "",
      weight: "",
      primaryLanguage: "",
      relationship: "",
      address: { street: "", city: "", state: "", pincode: "" },
      medicalConditions: [],
      allergies: [],
      currentMedications: [],
      mobilityStatus: "Independent",
      dietaryRestrictions: "",
      emergencyContact: { contactName: "", relationship: "", primaryPhone: "", alternatePhone: "", email: "", address: "" }
    }
  });

  const medicalConditions = watch("medicalConditions");
  const allergies = watch("allergies");
  const currentMedications = watch("currentMedications");
  const watchState = watch("address.state");

  useEffect(() => {
    if (watchState) {
      setCities(getCitiesByState(watchState).map(c => ({ value: c, label: c })));
      // Only reset city if the current city is not in the new state's cities
      const currentCity = getValues("address.city");
      if (currentCity && !getCitiesByState(watchState).includes(currentCity)) {
        setValue("address.city", "");
      }
    } else {
      setCities([]);
    }
  }, [watchState, setValue, getValues]);

  useEffect(() => {
    if (!editId) return;
    setFetching(true);
    getMyPatients().then((res) => {
      const p = (res?.data?.patients || []).find((x) => x._id === editId);
      if (p) {
        setPatientStatus(p.status);
        reset({
          name: p.name || "",
          dob: p.dob ? new Date(p.dob).toISOString().split('T')[0] : "",
          gender: p.gender,
          bloodGroup: p.bloodGroup || "",
          height: p.height || "",
          weight: p.weight || "",
          primaryLanguage: p.primaryLanguage || "",
          relationship: p.relationship || "",
          address: p.address || { street: "", city: "", state: "", pincode: "" },
          medicalConditions: p.medicalConditions || [],
          allergies: p.allergies || [],
          currentMedications: p.currentMedications || [],
          mobilityStatus: p.mobilityStatus || "Independent",
          dietaryRestrictions: p.dietaryRestrictions || "",
          emergencyContact: p.emergencyContact || { contactName: "", relationship: "", primaryPhone: "", alternatePhone: "", email: "", address: "" }
        });
      }
    }).finally(() => setFetching(false));
  }, [editId, reset]);

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      const data = getValues();
      const payload = { ...data, status: "draft" };
      if (!payload.dob) delete payload.dob; // Prevent Mongoose CastError for empty date

      if (editId) {
        await updatePatient(editId, payload);
        toast.success("Draft updated");
      } else {
        await createPatient(payload);
        toast.success("Draft saved");
      }
      navigate("/user/patients");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to save draft");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (editId) {
        await updatePatient(editId, { ...data, status: "published" });
        toast.success("Patient profile updated");
      } else {
        await createPatient({ ...data, status: "published" });
        toast.success("Patient profile created");
      }
      navigate("/user/patients");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to save patient profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <UserPageLayout>
      <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
    </UserPageLayout>
  );

  return (
    <UserPageLayout
      title={
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="p-2 h-auto" onClick={() => navigate("/user/patients")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          {editId ? "Edit Patient Profile" : "Create Patient Profile"}
        </div>
      }
      description="Fill in the details carefully. Accurate medical information helps caregivers provide better service."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-10">
        
        {/* Section 1: Personal Info */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-t-xl">
            <h3 className="font-bold text-slate-900 dark:text-white">Personal Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Input labelName="Full Name *" {...register("name")} placeholder="Patient full name" />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Input labelName="Date of Birth *" type="date" {...register("dob")} />
              {errors.dob && <p className="text-red-500 text-xs">{errors.dob.message}</p>}
            </div>
            <div className="space-y-1">
              <Select label="Gender *" {...register("gender")} value={watch("gender")} options={GENDER_OPTIONS} placeholder="Select gender" />
              {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
            </div>
            <div className="space-y-1">
               <Select label="Blood Group" {...register("bloodGroup")} value={watch("bloodGroup")} options={BLOOD_GROUPS} />
            </div>
            <div className="space-y-1">
              <Input labelName="Height" {...register("height")} placeholder="e.g. 5'6'' or 168cm" />
            </div>
            <div className="space-y-1">
              <Input labelName="Weight" {...register("weight")} placeholder="e.g. 65kg" />
            </div>
            <div className="space-y-1">
              <Input labelName="Primary Language" {...register("primaryLanguage")} placeholder="e.g. English, Hindi" />
            </div>
            <div className="space-y-1">
              <Input labelName="Relationship to you *" {...register("relationship")} placeholder="e.g. Mother, Father, Self" />
              {errors.relationship && <p className="text-red-500 text-xs">{errors.relationship.message}</p>}
            </div>
          </div>
        </motion.div>

        {/* Section 1.5: Patient Address */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-t-xl">
            <h3 className="font-bold text-slate-900 dark:text-white">Patient Address</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <Input labelName="Street Address" {...register("address.street")} placeholder="Building, Street name" />
            </div>
            <div className="space-y-1">
              <Select 
                label="State" 
                {...register("address.state")} 
                value={watch("address.state")}
                options={indianStates.map(s => ({ value: s, label: s }))} 
                placeholder="Select State" 
                searchable
              />
            </div>
            <div className="space-y-1">
              <Select 
                label="City" 
                {...register("address.city")} 
                value={watch("address.city")}
                options={cities.length > 0 ? cities : [{ value: "", label: "Select state first" }]} 
                disabled={!watchState}
                placeholder={watchState ? "Select City" : "Select state first"}
                searchable
              />
              {errors.address?.city && <p className="text-red-500 text-xs">{errors.address.city.message}</p>}
            </div>
            <div className="space-y-1">
              <Input labelName="Pincode" {...register("address.pincode")} placeholder="6-digit PIN" />
              {errors.address?.pincode && <p className="text-red-500 text-xs">{errors.address.pincode.message}</p>}
            </div>
          </div>
        </motion.div>

        {/* Section 2: Medical Info */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-t-xl">
            <h3 className="font-bold text-slate-900 dark:text-white">Medical & Health Information</h3>
          </div>
          <div className="p-6 space-y-6">
             <div className="grid grid-cols-1 gap-6">
               <ArrayInput label="Medical Conditions" items={medicalConditions} setItems={(val) => setValue("medicalConditions", val, { shouldDirty: true })} placeholder="Type and press add (e.g. Diabetes)" />
               <ArrayInput label="Allergies" items={allergies} setItems={(val) => setValue("allergies", val, { shouldDirty: true })} placeholder="Type and press add (e.g. Peanuts)" />
               <ArrayInput label="Current Medications" items={currentMedications} setItems={(val) => setValue("currentMedications", val, { shouldDirty: true })} placeholder="Type and press add" />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
               <div className="space-y-1">
                 <Select label="Mobility Status" {...register("mobilityStatus")} value={watch("mobilityStatus")} options={[
                   { value: "Independent", label: "Independent" },
                   { value: "Uses Cane/Walker", label: "Uses Cane/Walker" },
                   { value: "Wheelchair Bound", label: "Wheelchair Bound" },
                   { value: "Bedridden", label: "Bedridden" }
                 ]}
                  />
               </div>
               <div className="space-y-1">
                 <Input labelName="Dietary Restrictions" {...register("dietaryRestrictions")} placeholder="e.g. Diabetic Diet, Low Salt" />
               </div>
             </div>
          </div>
        </motion.div>

        {/* Section 3: Emergency Contact */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-t-xl">
            <h3 className="font-bold text-slate-900 dark:text-white">Emergency Contact</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Input labelName="Contact Name *" {...register("emergencyContact.contactName")} />
              {errors.emergencyContact?.contactName && <p className="text-red-500 text-xs">{errors.emergencyContact.contactName.message}</p>}
            </div>
            <div className="space-y-1">
              <Input labelName="Relationship *" {...register("emergencyContact.relationship")} placeholder="e.g. Son, Daughter" />
              {errors.emergencyContact?.relationship && <p className="text-red-500 text-xs">{errors.emergencyContact.relationship.message}</p>}
            </div>
            <div className="space-y-1">
              <Input labelName="Primary Phone *" {...register("emergencyContact.primaryPhone")} placeholder="10-digit mobile" />
              {errors.emergencyContact?.primaryPhone && <p className="text-red-500 text-xs">{errors.emergencyContact.primaryPhone.message}</p>}
            </div>
            <div className="space-y-1">
              <Input labelName="Alternate Phone" {...register("emergencyContact.alternatePhone")} placeholder="Optional" />
              {errors.emergencyContact?.alternatePhone && <p className="text-red-500 text-xs">{errors.emergencyContact.alternatePhone.message}</p>}
            </div>
            <div className="space-y-1">
              <Input labelName="Email Address" type="email" {...register("emergencyContact.email")} placeholder="Optional" />
              {errors.emergencyContact?.email && <p className="text-red-500 text-xs">{errors.emergencyContact.email.message}</p>}
            </div>
            <div className="space-y-1 md:col-span-2">
              <Input labelName="Address" {...register("emergencyContact.address")} placeholder="Optional emergency contact address" />
            </div>
          </div>
        </motion.div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate("/user/patients")}>
            Cancel
          </Button>
          {(!editId || patientStatus === "draft") && (
            <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={loading} className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Save Draft
            </Button>
          )}
          <Button type="submit" disabled={loading} className="flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editId ? "Update Profile" : "Save Profile"}
          </Button>
        </div>
      </form>
    </UserPageLayout>
  );
};

export default AddPatientPage;
