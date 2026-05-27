import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import * as adminService from "./admin.service.js";
import { getCaregiverByUserId } from "../caregiver/caregiver.services.js";
import Setting from "./setting.model.js";

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

// Get pending caregiver registrations
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

// Get pending caregiver profiles
export const getPendingProfiles = asyncHandler(async (req, res) => {
    const caregivers = await adminService.getPendingProfiles();
    return successResponse(res, 200, "Pending profiles fetched", { caregivers });
});

// Approve caregiver profile
export const approveCaregiverProfile = asyncHandler(async (req, res) => {
    const { caregiverId } = req.params;
    const caregiver = await adminService.approveCaregiverProfile(caregiverId);
    return successResponse(res, 200, "Profile approved successfully", { caregiver });
});

// Reject caregiver profile
export const rejectCaregiverProfile = asyncHandler(async (req, res) => {
    const { caregiverId } = req.params;
    const { feedback } = req.body;
    const caregiver = await adminService.rejectCaregiverProfile(caregiverId, feedback);
    return successResponse(res, 200, "Profile changes requested", { caregiver });
});

// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
    const { role } = req.query;
    const users = await adminService.getAllUsers(role);
    return successResponse(res, 200, "Users fetched successfully", { users });
});

// Get dashboard stats
export const getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await adminService.getDashboardStats();
    return successResponse(res, 200, "Dashboard stats fetched", { stats });
});

// Get all contacts
export const getAllContacts = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const contacts = await adminService.getAllContacts(status);
    return successResponse(res, 200, "Contacts fetched successfully", { contacts });
});

// Update contact status
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

// Delete user or caregiver
export const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    await adminService.deleteUser(userId);
    return successResponse(res, 200, "User deleted successfully");
});


// Get settings
export const getSettings = asyncHandler(async (req, res) => {
    const settings = await Setting.find({});
    const formattedSettings = {};
    settings.forEach(s => { formattedSettings[s.key] = s.value; });
    return successResponse(res, 200, "Settings fetched", { settings: formattedSettings });
});

// Update settings
export const updateSettings = asyncHandler(async (req, res) => {
    const updates = req.body;
    for (const key in updates) {
        await Setting.findOneAndUpdate(
            { key },
            { value: updates[key] },
            { upsert: true, new: true }
        );
    }
    return successResponse(res, 200, "Settings updated successfully");
});