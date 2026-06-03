export const MB = 1024 * 1024;
export const UPLOAD_RULES = {
  profileImage: { label: "Profile Image", hint: "Max 5MB", maxSize: 5 * MB, accept: "image/jpeg, image/png, image/webp", validate: (f) => f.size <= 5 * MB, maxBytes: 5 * MB },
  idProof: { label: "ID Proof", hint: "Max 5MB", maxSize: 5 * MB, accept: "image/jpeg, image/png, application/pdf", validate: (f) => f.size <= 5 * MB, maxBytes: 5 * MB },
  governmentId: { label: "Government ID", hint: "Max 5MB", maxSize: 5 * MB, accept: "image/jpeg, image/png, application/pdf", validate: (f) => f.size <= 5 * MB, maxBytes: 5 * MB },
  experienceDocuments: { label: "Experience Documents", hint: "Max 5MB (PDF only)", maxSize: 5 * MB, accept: "application/pdf", validate: (f) => f.size <= 5 * MB && f.type === "application/pdf", maxBytes: 5 * MB },
  certificates: { label: "Certificates", hint: "Max 5MB per file (PDF only, up to 5 files)", maxSize: 5 * MB, accept: "application/pdf", validate: (f) => f.size <= 5 * MB && f.type === "application/pdf", maxBytes: 5 * MB, multi: true, maxFiles: 5 },
  policeVerification: { label: "Police Verification", hint: "Max 5MB", maxSize: 5 * MB, accept: "image/jpeg, image/png, application/pdf", validate: (f) => f.size <= 5 * MB, maxBytes: 5 * MB },
  certifications: { label: "Certifications", hint: "Max 5MB", maxSize: 5 * MB, accept: "image/jpeg, image/png, application/pdf", validate: (f) => f.size <= 5 * MB, maxBytes: 5 * MB },
};
