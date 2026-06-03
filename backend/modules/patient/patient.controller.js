import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import * as patientService from "./patient.service.js";
import PDFDocument from "pdfkit";

export const createPatient = asyncHandler(async (req, res) => {
    const patient = await patientService.createPatient(req.user.id, req.body);
    return successResponse(res, 201, "Patient profile created", { patient });
});

export const getMyPatients = asyncHandler(async (req, res) => {
    const patients = await patientService.getPatientsByUser(req.user.id);
    return successResponse(res, 200, "Patients fetched", { patients });
});

export const getPatient = asyncHandler(async (req, res) => {
    const patient = await patientService.getPatientById(req.params.id, req.user.id);
    return successResponse(res, 200, "Patient fetched", { patient });
});

export const updatePatient = asyncHandler(async (req, res) => {
    const patient = await patientService.updatePatient(req.params.id, req.user.id, req.body);
    return successResponse(res, 200, "Patient updated", { patient });
});

export const deletePatient = asyncHandler(async (req, res) => {
    await patientService.deletePatient(req.params.id, req.user.id);
    return successResponse(res, 200, "Patient removed");
});

export const getAllPatientsAdmin = asyncHandler(async (req, res) => {
    const patients = await patientService.getAllPatientsAdmin();
    return successResponse(res, 200, "Patients fetched", { patients });
});

export const printPatientProfile = asyncHandler(async (req, res) => {
    const patient = await patientService.getPatientById(req.params.id, req.user.id);
    
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Disposition", `attachment; filename="${patient.name.replace(/\s+/g, "_")}_Profile.pdf"`);
    res.setHeader("Content-Type", "application/pdf");
    
    doc.pipe(res);
    
    doc.fontSize(20).text("ElderNest Patient Profile", { align: "center" });
    doc.moveDown();
    
    doc.fontSize(16).text("Personal Information", { underline: true });
    doc.fontSize(12).text(`Name: ${patient.name}`);
    doc.text(`DOB: ${new Date(patient.dob).toLocaleDateString()}`);
    doc.text(`Gender: ${patient.gender}`);
    doc.text(`Blood Group: ${patient.bloodGroup || "N/A"}`);
    doc.text(`Relationship: ${patient.relationship}`);
    doc.moveDown();
    
    doc.fontSize(16).text("Medical Information", { underline: true });
    doc.fontSize(12).text(`Medical Conditions: ${patient.medicalConditions?.join(", ") || "None"}`);
    doc.text(`Allergies: ${patient.allergies?.join(", ") || "None"}`);
    doc.text(`Current Medications: ${patient.currentMedications?.join(", ") || "None"}`);
    doc.moveDown();
    
    if (patient.emergencyContact) {
        doc.fontSize(16).text("Emergency Contact", { underline: true });
        doc.fontSize(12).text(`Name: ${patient.emergencyContact.contactName}`);
        doc.text(`Relationship: ${patient.emergencyContact.relationship}`);
        doc.text(`Phone: ${patient.emergencyContact.primaryPhone}`);
    }
    
    doc.end();
});
