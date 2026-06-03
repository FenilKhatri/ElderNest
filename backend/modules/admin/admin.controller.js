import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import * as adminService from "./admin.service.js";
import Caregiver from "../caregiver/caregiver.model.js";
import { getCaregiverByUserId } from "../caregiver/caregiver.services.js";
import { sanitizeCaregiver } from "../../common/utils/sanitizeUser.js";
import * as patientService from "../patient/patient.service.js";
import Setting from "./setting.model.js";

export const getCaregiverByIdAdmin = asyncHandler(async (req, res) => {
    const caregiver = await Caregiver.findById(req.params.caregiverId)
        .populate("userId", "name email phone profileImage status isApproved")
        .populate("servicesOffered", "title description price slug");

    if (!caregiver) {
        return errorResponse(res, 404, "Caregiver not found");
    }

    return successResponse(res, 200, "Caregiver fetched", { caregiver: sanitizeCaregiver(caregiver) });
});

export const getCaregiverByUserIdAdmin = asyncHandler(async (req, res) => {
    try {
        const caregiver = await getCaregiverByUserId(req.params.userId);
        return successResponse(res, 200, "Caregiver fetched", { caregiver });
    } catch (error) {
        // Return minimal data if not found
        const users = await adminService.getAllUsers();
        const user = users.find(u => u._id.toString() === req.params.userId);
        if (user) {
            return successResponse(res, 200, "Caregiver fetched", { 
                caregiver: { userId: user, _id: null, isApproved: user.isApproved, status: user.status } 
            });
        }
        throw error;
    }
});

export const getPendingCaregivers = asyncHandler(async (req, res) => {
    const caregivers = await adminService.getPendingCaregivers();
    return successResponse(res, 200, "Pending caregivers fetched", { caregivers });
});

// Approve caregiver registration
export const approveCaregiverRegistration = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await adminService.approveCaregiverRegistration(userId);
    return successResponse(res, 200, "Caregiver approved successfully", { user });
});

// Reject caregiver registration
export const rejectCaregiverRegistration = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { reason } = req.body;
    const user = await adminService.rejectCaregiverRegistration(userId, reason);
    return successResponse(res, 200, "Caregiver registration rejected", { user });
});

export const getPendingProfiles = asyncHandler(async (req, res) => {
    const caregivers = await adminService.getPendingProfiles();
    return successResponse(res, 200, "Pending profiles fetched", { caregivers });
});

// Approve caregiver profile / verification
export const approveCaregiverProfile = asyncHandler(async (req, res) => {
    const { caregiverId } = req.params;
    const caregiver = await adminService.reviewCaregiverVerification(caregiverId, "approve");
    return successResponse(res, 200, "Profile approved successfully", { caregiver });
});

// Reject caregiver profile
export const rejectCaregiverProfile = asyncHandler(async (req, res) => {
    const { caregiverId } = req.params;
    const { feedback } = req.body;
    const caregiver = await adminService.reviewCaregiverVerification(caregiverId, "changes", feedback);
    return successResponse(res, 200, "Profile changes requested", { caregiver });
});

export const getCaregiverVerificationDetail = asyncHandler(async (req, res) => {
    const caregiver = await adminService.getCaregiverVerificationDetail(req.params.caregiverId);
    return successResponse(res, 200, "Verification details fetched", { caregiver });
});

export const reviewCaregiverVerification = asyncHandler(async (req, res) => {
    const { caregiverId } = req.params;
    const { action, feedback } = req.body;
    const caregiver = await adminService.reviewCaregiverVerification(caregiverId, action, feedback);
    return successResponse(res, 200, "Verification reviewed", { caregiver });
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const { role } = req.query;
    const users = await adminService.getAllUsers(role);
    return successResponse(res, 200, "Users fetched successfully", { users });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
    const { timeframe } = req.query;
    const stats = await adminService.getDashboardStats(timeframe);
    return successResponse(res, 200, "Dashboard stats fetched", { stats });
});

export const getAllContacts = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const contacts = await adminService.getAllContacts(status);
    return successResponse(res, 200, "Contacts fetched successfully", { contacts });
});

export const updateContactStatus = asyncHandler(async (req, res) => {
    const { contactId } = req.params;
    const { status, adminNotes } = req.body;
    const contact = await adminService.updateContactStatus(
        contactId,
        status,
        req.user.id,
        adminNotes
    );
    return successResponse(res, 200, "Contact status updated", { contact });
});

export const getAnalytics = asyncHandler(async (req, res) => {
    const analytics = await adminService.getAnalytics();
    return successResponse(res, 200, "Analytics fetched", { analytics });
});

export const getAllPatients = asyncHandler(async (req, res) => {
    const patients = await patientService.getAllPatientsAdmin();
    return successResponse(res, 200, "Patients fetched", { patients });
});

export const updatePatient = asyncHandler(async (req, res) => {
    const patient = await patientService.updatePatient(req.params.id, null, req.body);
    return successResponse(res, 200, "Patient updated", { patient });
});

export const deletePatient = asyncHandler(async (req, res) => {
    await patientService.deletePatient(req.params.id, null);
    return successResponse(res, 200, "Patient removed");
});

export const suspendCaregiver = asyncHandler(async (req, res) => {
    const { suspend = true } = req.body;
    const result = await adminService.suspendCaregiver(req.params.userId, suspend !== false);
    return successResponse(res, 200, suspend !== false ? "Caregiver suspended" : "Caregiver reactivated", result);
});

export const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    await adminService.deleteUser(userId);
    return successResponse(res, 200, "User deleted successfully");
});


export const getSettings = asyncHandler(async (req, res) => {
    const settings = await Setting.find({});
    const formattedSettings = {};
    settings.forEach(s => { formattedSettings[s.key] = s.value; });
    return successResponse(res, 200, "Settings fetched", { settings: formattedSettings });
});

export const updateSettings = asyncHandler(async (req, res) => {
    const updates = req.body;
    for (const key in updates) {
        await Setting.findOneAndUpdate(
            { key },
            { value: updates[key] },
            { upsert: true, returnDocument: 'after' }
        );
    }
    return successResponse(res, 200, "Settings updated successfully");
});