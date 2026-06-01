import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Upload, Shield, FileText, Eye, X, Loader2 } from "lucide-react";
import http from "../../../lib/axios";
import { getOnboardingStatus, submitVerification } from "../api/caregiver.api";
import { getAllServices } from "../../service/api/service.api";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";
import CustomDropdown from "../../../components/ui/CustomDropdown";
import { apiPayload, apiStage, apiCaregiver, uploadUrlFromResponse } from "../../../utils/apiHelpers";

const MB = 1024 * 1024;

const UPLOAD_RULES = {
  governmentId: {
    label: "Government ID",
    hint: "Upload Aadhaar card, PAN card, or passport. JPG/PNG only, max 5 MB.",
    accept: "image/jpeg,image/png,.jpg,.jpeg,.png",
    maxBytes: 5 * MB,
    validate: (f) => /\.(jpe?g|png)$/i.test(f.name) || f.type.startsWith("image/"),
  },
  idProof: {
    label: "ID proof",
    hint: "Secondary ID such as voter ID, driving licence, or passport photo page. JPG/PNG only, max 5 MB.",
    accept: "image/jpeg,image/png,.jpg,.jpeg,.png",
    maxBytes: 5 * MB,
    validate: (f) => /\.(jpe?g|png)$/i.test(f.name) || f.type.startsWith("image/"),
  },
  experienceDocuments: {
    label: "Experience documents",
    hint: "Employment letters or experience certificates. PDF only, max 2 MB.",
    accept: "application/pdf,.pdf",
    maxBytes: 2 * MB,
    validate: (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name),
  },
  certificates: {
    label: "Qualification certificates",
    hint: "Nursing or caregiving certificates. PDF only, max 2 MB each.",
    accept: "application/pdf,.pdf",
    maxBytes: 2 * MB,
    validate: (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name),
    multi: true,
  },
};

const uploadFile = async (file, folder) => {
  const data = new FormData();
  data.append("image", file);
  if (folder) data.append("folder", folder);
  const res = await http.post("/upload", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return uploadUrlFromResponse(res);
};

const DocPreview = ({ url, label, onRemove }) => {
  const isImage = /\.(jpe?g|png|gif|webp|avif)$/i.test(url);
  return (
    <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-green-600 dark:text-green-400">Uploaded: {label}</p>
        {onRemove && (
          <button type="button" onClick={onRemove} className="text-slate-400 hover:text-red-500" aria-label="Remove">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {isImage ? (
        <img src={url} alt={label} className="mt-2 max-h-40 rounded-lg border border-slate-200 dark:border-slate-600 object-contain" />
      ) : (
        <a href={url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
          <Eye className="w-4 h-4" /> Preview PDF
        </a>
      )}
    </div>
  );
};

const Verification = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stage, setStage] = useState("");
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [verificationInfo, setVerificationInfo] = useState("");
  const [uploadingField, setUploadingField] = useState(null);
  const [docs, setDocs] = useState({
    governmentId: "",
    idProof: "",
    certificates: [],
    experienceDocuments: "",
  });

  useEffect(() => {
    Promise.all([getOnboardingStatus(), getAllServices({ isActive: true })])
      .then(([statusRes, servicesRes]) => {
        setStage(apiStage(statusRes) || "");
        const cg = apiCaregiver(statusRes);
        if (cg?.documents) {
          setDocs({
            governmentId: cg.documents.aadharCard || "",
            idProof: cg.documents.idProof || "",
            certificates: cg.documents.certificates || [],
            experienceDocuments: cg.documents.policeClearance || "",
          });
        }
        if (cg?.servicesOffered?.length) {
          setSelectedServices(cg.servicesOffered.map((s) => (typeof s === "object" ? s._id : s)));
        }
        if (cg?.verificationInfo) setVerificationInfo(cg.verificationInfo);
        const svcPayload = apiPayload(servicesRes);
        setServices(svcPayload?.services || servicesRes?.services || []);
      })
      .catch(() => toast.error("Failed to load verification data"))
      .finally(() => setLoading(false));
  }, []);

  const validateFile = (file, ruleKey) => {
    const rule = UPLOAD_RULES[ruleKey];
    if (!rule.validate(file)) {
      toast.error(`Invalid file type for ${rule.label}`);
      return false;
    }
    if (file.size > rule.maxBytes) {
      toast.error(`${rule.label}: max ${rule.maxBytes / MB} MB`);
      return false;
    }
    return true;
  };

  const handleUpload = async (e, field) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const rule = UPLOAD_RULES[field];
    // Route PDFs to documents subfolder, images to photos subfolder
    const folder = rule.accept.includes("pdf") ? "documents" : "photos";
    setUploadingField(field);
    try {
      if (rule.multi) {
        const urls = [];
        for (const file of files) {
          if (!validateFile(file, field)) continue;
          urls.push(await uploadFile(file, folder));
        }
        if (urls.length) {
          setDocs((d) => ({ ...d, certificates: [...d.certificates, ...urls] }));
          toast.success("Uploaded");
        }
      } else {
        const file = files[0];
        if (!validateFile(file, field)) return;
        const url = await uploadFile(file, folder);
        setDocs((d) => ({ ...d, [field]: url }));
        toast.success("Uploaded");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingField(null);
    }
    e.target.value = "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!docs.governmentId || !docs.idProof) {
      toast.error("Government ID and ID proof are required");
      return;
    }
    if (!selectedServices.length) {
      toast.error("Select at least one service");
      return;
    }
    try {
      setSubmitting(true);
      await submitVerification({
        servicesOffered: selectedServices,
        verificationInfo,
        documents: {
          governmentId: docs.governmentId,
          idProof: docs.idProof,
          certificates: docs.certificates,
          experienceDocuments: docs.experienceDocuments,
        },
      });
      toast.success("Verification submitted. Wait for admin approval.");
      setStage("verification_pending");
    } catch (err) {
      toast.error(err?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  if (stage === "verification_pending") {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <Shield className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Under review</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Your documents were submitted. An admin will review them shortly.
        </p>
      </div>
    );
  }

  const serviceOptions = services.map((s) => ({ value: s._id, label: s.title }));

  const renderDocField = (key) => {
    const rule = UPLOAD_RULES[key];
    const isUploading = uploadingField === key;
    if (key === "certificates") {
      return (
        <div key={key} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-blue-600 shrink-0" />
            <span className="font-medium text-slate-900 dark:text-white">{rule.label}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{rule.hint}</p>
          <label className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors ${isUploading ? "bg-blue-400 text-white cursor-wait" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload certificates
              </>
            )}
            <input type="file" className="hidden" multiple accept={rule.accept} onChange={(e) => handleUpload(e, key)} disabled={isUploading} />
          </label>
          {docs.certificates.map((url, i) => (
            <DocPreview
              key={url}
              url={url}
              label={`Certificate ${i + 1}`}
              onRemove={() => setDocs((d) => ({ ...d, certificates: d.certificates.filter((_, j) => j !== i) }))}
            />
          ))}
        </div>
      );
    }

    return (
      <div key={key} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-blue-600 shrink-0" />
          <span className="font-medium text-slate-900 dark:text-white">{rule.label}</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{rule.hint}</p>
        <label className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors ${isUploading ? "bg-blue-400 text-white cursor-wait" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              {docs[key] ? "Replace file" : "Upload"}
            </>
          )}
          <input type="file" className="hidden" accept={rule.accept} onChange={(e) => handleUpload(e, key)} disabled={isUploading} />
        </label>
        {docs[key] && (
          <DocPreview url={docs[key]} label={rule.label} onRemove={() => setDocs((d) => ({ ...d, [key]: "" }))} />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Document verification</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Upload required documents and select services you provide.
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="space-y-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
      >
        <CustomDropdown
          label="Services offered"
          options={serviceOptions}
          value={selectedServices}
          onChange={setSelectedServices}
          multiple
          searchable
          required
          placeholder="Select services from catalog"
        />

        {renderDocField("governmentId")}
        {renderDocField("idProof")}
        {renderDocField("experienceDocuments")}
        {renderDocField("certificates")}

        <Textarea
          label="Verification information"
          value={verificationInfo}
          onChange={(e) => setVerificationInfo(e.target.value)}
          rows={4}
          placeholder="Additional details for admin review..."
        />

        <Button type="submit" loading={submitting} disabled={submitting || !!uploadingField} className="w-full sm:w-auto">
          {submitting ? "Submitting request..." : "Submit for verification"}
        </Button>
      </motion.form>
    </div>
  );
};

export default Verification;
