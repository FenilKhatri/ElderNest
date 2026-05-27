import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Star,
  Clock,
  Award,
  Languages,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCaregiverById } from "../api/admin.api";

const CaregiverDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaregiverDetails();
  }, [id]);

  const fetchCaregiverDetails = async () => {
    try {
      setLoading(true);
      const response = await getCaregiverById(id);
      setCaregiver(response.data.caregiver);
    } catch (error) {
      toast.error("Failed to fetch caregiver details");
      navigate("/admin/caregivers");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!caregiver) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">Caregiver not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/caregivers")}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Caregiver Details
        </h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-600" />

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-12">
            <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-900 flex items-center justify-center">
              {caregiver.profileImage ? (
                <img
                  src={caregiver.profileImage}
                  alt={caregiver.fullName || caregiver.userId?.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={40} className="text-slate-400" />
              )}
            </div>
            <div className="pb-2 flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {caregiver.fullName || caregiver.userId?.name}
                </h2>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    caregiver.profileApprovalStatus === "approved"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : caregiver.profileApprovalStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {caregiver.profileApprovalStatus}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">{caregiver.email || caregiver.userId?.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Rating</p>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {caregiver.rating?.toFixed(1) || "0.0"}
                </p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Reviews</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {caregiver.totalReviews || 0}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Experience</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {caregiver.experienceYears || 0} yrs
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Hourly Rate</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                ${caregiver.pricing?.hourlyRate || 0}/hr
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Bookings</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {caregiver.totalBookings || 0}
              </p>
            </div>
          </div>

          {/* Bio */}
          {caregiver.bio && (
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                About
              </h3>
              <p className="text-slate-900 dark:text-white">{caregiver.bio}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                      <p className="text-slate-900 dark:text-white">{caregiver.email || caregiver.userId?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
                      <p className="text-slate-900 dark:text-white">{caregiver.contactNumber || "Not provided"}</p>
                    </div>
                  </div>
                  {caregiver.alternateContact && (
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Alternate Phone</p>
                        <p className="text-slate-900 dark:text-white">{caregiver.alternateContact}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Location</p>
                      <p className="text-slate-900 dark:text-white">
                        {caregiver.location?.city && caregiver.location?.state 
                          ? `${caregiver.location.city}, ${caregiver.location.state}`
                          : "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Joined</p>
                      <p className="text-slate-900 dark:text-white">
                        {new Date(caregiver.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Personal Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Gender</p>
                      <p className="text-slate-900 dark:text-white capitalize">{caregiver.gender || "Not specified"}</p>
                    </div>
                  </div>
                  {caregiver.age && (
                    <div className="flex items-center gap-3">
                      <User size={18} className="text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Age</p>
                        <p className="text-slate-900 dark:text-white">{caregiver.age} years</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Availability</p>
                      <p className="text-slate-900 dark:text-white capitalize">
                        {caregiver.availableTiming || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                      <p className={`font-medium capitalize ${
                        caregiver.isActive 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        {caregiver.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Skills
                </h3>
                {caregiver.servicesOffered && caregiver.servicesOffered.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {caregiver.servicesOffered.map((service, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                      >
                        {service.title || service}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400">No services specified</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Languages
                </h3>
                {caregiver.languages && caregiver.languages.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {caregiver.languages.map((language, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm flex items-center gap-1"
                      >
                        <Languages size={14} />
                        {language}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400">No languages specified</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Certifications
                </h3>
                {caregiver.certifications && caregiver.certifications.length > 0 ? (
                  <div className="space-y-2">
                    {caregiver.certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <Award size={18} className="text-green-500" />
                        <span className="text-slate-900 dark:text-white">{cert}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400">No certifications added</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Pricing
                </h3>
                <div className="space-y-2">
                  {caregiver.pricing?.hourlyRate && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Hourly Rate</p>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        ${caregiver.pricing.hourlyRate}/hr
                      </p>
                    </div>
                  )}
                  {caregiver.pricing?.dailyRate && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Daily Rate</p>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        ${caregiver.pricing.dailyRate}/day
                      </p>
                    </div>
                  )}
                  {caregiver.pricing?.monthlyRate && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Rate</p>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        ${caregiver.pricing.monthlyRate}/month
                      </p>
                    </div>
                  )}
                  {!caregiver.pricing?.hourlyRate && !caregiver.pricing?.dailyRate && !caregiver.pricing?.monthlyRate && (
                    <p className="text-slate-500 dark:text-slate-400">No pricing set</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Uploaded Documents
                </h3>
                <div className="space-y-2">
                  {caregiver.documents?.aadharCard && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-slate-400" />
                        <span className="text-slate-900 dark:text-white">Aadhar Card</span>
                      </div>
                      <span className="text-sm text-green-600 dark:text-green-400">✓ Uploaded</span>
                    </div>
                  )}
                  {caregiver.documents?.idProof && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-slate-400" />
                        <span className="text-slate-900 dark:text-white">ID Proof</span>
                      </div>
                      <span className="text-sm text-green-600 dark:text-green-400">✓ Uploaded</span>
                    </div>
                  )}
                  {caregiver.documents?.policeClearance && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-slate-400" />
                        <span className="text-slate-900 dark:text-white">Police Clearance</span>
                      </div>
                      <span className="text-sm text-green-600 dark:text-green-400">✓ Uploaded</span>
                    </div>
                  )}
                  {caregiver.documents?.certificates && caregiver.documents.certificates.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-slate-400" />
                        <span className="text-slate-900 dark:text-white">
                          Certificates ({caregiver.documents.certificates.length})
                        </span>
                      </div>
                      <span className="text-sm text-green-600 dark:text-green-400">✓ Uploaded</span>
                    </div>
                  )}
                  {!caregiver.documents?.aadharCard && 
                   !caregiver.documents?.idProof && 
                   !caregiver.documents?.policeClearance && 
                   (!caregiver.documents?.certificates || caregiver.documents.certificates.length === 0) && (
                    <p className="text-slate-500 dark:text-slate-400">No documents uploaded</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Approval Status
                </h3>
                <div
                  className={`p-4 rounded-lg ${
                    caregiver.profileApprovalStatus === "approved"
                      ? "bg-green-50 dark:bg-green-900/20"
                      : caregiver.profileApprovalStatus === "pending"
                      ? "bg-yellow-50 dark:bg-yellow-900/20"
                      : "bg-red-50 dark:bg-red-900/20"
                  }`}
                >
                  <p
                    className={`font-medium capitalize ${
                      caregiver.profileApprovalStatus === "approved"
                        ? "text-green-700 dark:text-green-400"
                        : caregiver.profileApprovalStatus === "pending"
                        ? "text-yellow-700 dark:text-yellow-400"
                        : "text-red-700 dark:text-red-400"
                    }`}
                  >
                    {caregiver.profileApprovalStatus}
                  </p>
                  {caregiver.adminFeedback && (
                    <p className="text-sm mt-2 text-slate-600 dark:text-slate-300">
                      Admin Feedback: {caregiver.adminFeedback}
                    </p>
                  )}
                  <p className="text-sm mt-2 text-slate-600 dark:text-slate-300">
                    Profile Completed: {caregiver.profileCompleted ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CaregiverDetails;
