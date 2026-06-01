import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import { validationResult } from "express-validator";
import * as caregiverService from "./caregiver.services.js";

// Get all caregivers (public)
export const getCaregivers = asyncHandler(async (req, res) => {
    const filters = req.query;
    const caregivers = await caregiverService.getAllCaregivers(filters);
    return successResponse(res, 200, "Caregivers fetched", { caregivers });
});

// Get caregiver by ID (public)
export const getCaregiver = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const caregiver = await caregiverService.getCaregiverById(id);
    return successResponse(res, 200, "Caregiver fetched", { caregiver });
});

// Complete caregiver profile
export const completeProfile = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const caregiver = await caregiverService.completeProfile(req.user.id, req.body);
    return successResponse(res, 200, "Profile completed successfully", { caregiver });
});

// Update availability
export const updateAvailability = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const caregiver = await caregiverService.updateAvailability(req.user.id, req.body.availability);
    return successResponse(res, 200, "Availability updated", { caregiver });
});

// Get my profile (caregiver)
export const getMyProfile = asyncHandler(async (req, res) => {
    const caregiver = await caregiverService.getCaregiverByUserId(req.user.id);
    return successResponse(res, 200, "Profile fetched", { caregiver });
});

// Caregiver dashboard
export const caregiverDashboard = asyncHandler(async (req, res) => {
    const stats = await caregiverService.getCaregiverDashboardStats(req.user.id);
    return successResponse(res, 200, "Dashboard stats fetched", { stats });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const caregiver = await caregiverService.updateProfile(req.user.id, req.body);
    return successResponse(res, 200, "Profile updated", { caregiver });
});

export const submitVerification = asyncHandler(async (req, res) => {
    const caregiver = await caregiverService.submitVerification(req.user.id, req.body);
    return successResponse(res, 201, "Verification submitted", { caregiver });
});

export const getOnboardingStatus = asyncHandler(async (req, res) => {
    const status = await caregiverService.getOnboardingStatus(req.user.id);
    return successResponse(res, 200, "Onboarding status fetched", status);
});