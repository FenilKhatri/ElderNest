import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Upload, Shield, FileText, Download, X, Loader2 } from "lucide-react";
import http from "../../../lib/axios";
import { getOnboardingStatus, submitVerification } from "../api/caregiver.api";
import { getAllServices } from "../../service/api/service.api";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";
import CustomDropdown from "../../../components/ui/CustomDropdown";
import { apiPayload, apiStage, apiCaregiver, uploadUrlFromResponse } from "../../../utils/apiHelpers";
import { MB, UPLOAD_RULES } from "@/constants";

const uploadFile = async (file, folder) => {
  const data = new FormData();
  data.append("image", file);
  if (folder) data.append("folder", folder);
  const res = await http.post("/upload", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return uploadUrlFromResponse(res);
};

const DocPreview = ({ url, label, onRemove, onReplace, replaceAccept, isUploading }) => {
  const isImage = /\.(jpe?g|png|gif|webp|avif)$/i.test(url);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = label.replace(/\s+/g, "_") + ".pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open in new tab with fl_attachment for Cloudinary
      let openUrl = url;
      if (openUrl.includes("cloudinary.com") && !openUrl.includes("fl_attachment")) {
        openUrl = openUrl.replace("/upload/", "/upload/fl_attachment/");
      }
      window.open(openUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-green-600 dark:text-green-400">Uploaded: {label}</p>
        <div className="flex gap-2 items-center">
          {onReplace && (
            <label className={`cursor-pointer px-2 py-1 text-xs font-medium rounded transition-colors ${isUploading ? "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-wait" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50"}`}>
               {isUploading && <Loader2 className="w-3 h-3 animate-spin inline mr-1" />}
               Replace
               <input type="file" className="hidden" accept={replaceAccept} onChange={onReplace} disabled={isUploading} />
            </label>
          )}
          {onRemove && (
            <Button variant="danger" type="button" onClick={onRemove} className="hover:text-red-500 px-2 py-1 h-auto" aria-label="Remove" disabled={isUploading}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      {isImage ? (
        <img src={url} alt={label} className="mt-2 max-h-40 rounded-lg border border-slate-200 dark:border-slate-600 object-contain" />
      ) : (
        <Button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
        >
          <Download className="w-4 h-4" />
          {downloading ? "Downloading..." : "Download PDF"}
        </Button>
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
    Promise.all([getOnboardingStatus(), getAllServices({ isActive: true, limit: 1000 })])
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
          setSelectedServices(cg.servicesOffered.filter(s => s !== null).map((s) => (typeof s === "object" ? s._id : s)));
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
    const folder = rule.accept.includes("pdf") ? "documents" : "photos";
    
    if (rule.multi && rule.maxFiles) {
      const currentCount = docs[field]?.length || 0;
      if (currentCount + files.length > rule.maxFiles) {
        toast.error(`You can upload a maximum of ${rule.maxFiles} files for ${rule.label}`);
        e.target.value = "";
        return;
      }
    }

    setUploadingField(field);
    try {
      if (rule.multi) {
        const urls = [];
        for (const file of files) {
          if (!validateFile(file, field)) continue;
          urls.push(await uploadFile(file, folder));
        }
        if (urls.length) {
          setDocs((d) => ({ ...d, [field]: [...(d[field] || []), ...urls] }));
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

  const handleReplace = async (e, field, index) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const rule = UPLOAD_RULES[field];
    const folder = rule.accept.includes("pdf") ? "documents" : "photos";
    const file = files[0];
    if (!validateFile(file, field)) return;

    setUploadingField(`${field}-${index}`);
    try {
      const url = await uploadFile(file, folder);
      setDocs((d) => {
        const newArr = [...(d[field] || [])];
        newArr[index] = url;
        return { ...d, [field]: newArr };
      });
      toast.success("File replaced successfully");
    } catch {
      toast.error("Replacement failed");
    } finally {
      setUploadingField(null);
    }
    e.target.value = "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!docs.governmentId || !docs.idProof || !docs.experienceDocuments) {
      toast.error("Government ID, ID proof, and Experience Documents are required");
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
              onReplace={(e) => handleReplace(e, key, i)}
              replaceAccept={rule.accept}
              isUploading={uploadingField === `${key}-${i}`}
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
