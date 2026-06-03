import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  User, Calendar, Activity, Printer, ArrowLeft,
  Droplet, Maximize2, Weight, Languages, Heart,
  MapPin, Phone, Mail, ShieldAlert, FileText, Loader2
} from "lucide-react";
import UserPageLayout from "../../../layout/dashboard/UserPageLayout";
import { getPatient } from "../../patient/api/patient.api";
import Button from "../../../components/ui/Button";
import http from "../../../lib/axios";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import { formatDate } from "../../../utils/helpers";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPatient(id)
      .then((res) => setPatient(res?.data?.patient))
      .catch((err) => {
        toast.error(err.message || "Failed to load patient details");
        navigate("/user/patients");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handlePrint = async () => {
    try {
      setPrinting(true);
      const res = await http.get(`/patients/${id}/print`, { responseType: 'blob' });
      
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${patient.name.replace(/\s+/g, "_")}_Profile.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Profile record downloaded");
    } catch (error) {
      toast.error("Failed to download profile record");
    } finally {
      setPrinting(false);
    }
  };

  if (loading) {
    return (
      <UserPageLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading patient profile...</p>
        </div>
      </UserPageLayout>
    );
  }

  if (!patient) return null;

  const patientIdShort = patient._id ? `#PT-${patient._id.slice(-4).toUpperCase()}` : "";

  return (
    <UserPageLayout
      title={
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="p-2 h-auto" onClick={() => navigate("/user/patients")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          Patient Profile
        </div>
      }
      description="Manage patient personal and medical information."
      action={
        <Button onClick={handlePrint} disabled={printing} variant="outline" className="flex items-center gap-2 bg-white">
          {printing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
          Print Record
        </Button>
      }
    >
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8 max-w-5xl">
        
        {/* ─── Header Section ─── */}
        <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border-4 border-white dark:border-slate-900 shadow-md">
            {patient.gender === 'female' ? (
              <img src={`https://ui-avatars.com/api/?name=${patient.name}&background=fdf4ff&color=c026d3&size=150`} alt={patient.name} className="w-full h-full rounded-full" />
            ) : (
              <img src={`https://ui-avatars.com/api/?name=${patient.name}&background=eff6ff&color=2563eb&size=150`} alt={patient.name} className="w-full h-full rounded-full" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">{patient.name}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
              <span>Patient ID: {patientIdShort}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <span>Registered: {formatDate(patient.createdAt)}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active Care Plan
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                {patient.relationship}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ─── Personal Information ─── */}
        <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Full Name</p>
              <p className="font-medium text-slate-900 dark:text-white">{patient.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Date of Birth / Age</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {formatDate(patient.dob)} ({patient.age} yrs)
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Gender</p>
              <p className="font-medium text-slate-900 dark:text-white capitalize">{patient.gender}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Blood Group</p>
              <div className="flex items-center gap-2 font-medium text-red-600">
                <Droplet className="w-4 h-4" /> {patient.bloodGroup || "N/A"}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5"/> Height</p>
              <p className="font-medium text-slate-900 dark:text-white">{patient.height || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1"><Weight className="w-3.5 h-3.5"/> Weight</p>
              <p className="font-medium text-slate-900 dark:text-white">{patient.weight || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1"><Languages className="w-3.5 h-3.5"/> Language</p>
              <p className="font-medium text-slate-900 dark:text-white">{patient.primaryLanguage || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> Location</p>
              <p className="font-medium text-slate-900 dark:text-white truncate" title={`${patient.address?.city}, ${patient.address?.state}`}>
                {patient.address?.city || "N/A"}, {patient.address?.state || ""}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ─── Medical Information ─── */}
        <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-500" />
              Medical & Health Information
            </h3>
          </div>
          
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Conditions */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" /> Medical Conditions
                </h4>
                {patient.medicalConditions?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.medicalConditions.map((cond, i) => (
                      <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-sm font-medium border border-rose-100">
                        {cond}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 border-dashed">No conditions recorded.</p>
                )}
              </div>

              {/* Allergies */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" /> Allergies
                </h4>
                {patient.allergies?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, i) => (
                      <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-100">
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 border-dashed">No known allergies.</p>
                )}
              </div>

              {/* Medications */}
              <div className="md:col-span-2">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" /> Current Medications
                </h4>
                {patient.currentMedications?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.currentMedications.map((med, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
                        {med}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 border-dashed">No active medications.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
               <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Mobility Status</p>
                  <p className="font-medium text-slate-900 dark:text-white bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{patient.mobilityStatus || "Independent"}</p>
               </div>
               <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Dietary Restrictions</p>
                  <p className="font-medium text-slate-900 dark:text-white bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{patient.dietaryRestrictions || "None"}</p>
               </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Emergency Contact ─── */}
        <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-10">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-orange-500" />
              Emergency Contact
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Contact Name</p>
              <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" /> {patient.emergencyContact?.contactName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Relationship</p>
              <p className="font-medium text-slate-900 dark:text-white capitalize">
                {patient.emergencyContact?.relationship || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Primary Phone</p>
              <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" /> {patient.emergencyContact?.primaryPhone || "N/A"}
              </p>
            </div>
            {patient.emergencyContact?.alternatePhone && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Alternate Phone</p>
                <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" /> {patient.emergencyContact.alternatePhone}
                </p>
              </div>
            )}
            {patient.emergencyContact?.email && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Email</p>
                <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> {patient.emergencyContact.email}
                </p>
              </div>
            )}
          </div>
        </motion.div>

      </motion.div>
    </UserPageLayout>
  );
};

export default PatientDetails;
