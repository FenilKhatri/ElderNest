import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import Settings from "./settings.model.js";

// Get settings
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return successResponse(res, 200, "Settings fetched successfully", { settings });
});

// Update settings (Admin only)
export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }

  const { maintenanceMode, allowNewRegistrations, siteName, platformFeePercentage, contactEmail, contactPhone } = req.body;

  if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
  if (allowNewRegistrations !== undefined) settings.allowNewRegistrations = allowNewRegistrations;
  if (siteName !== undefined) settings.siteName = siteName;
  if (platformFeePercentage !== undefined) settings.platformFeePercentage = platformFeePercentage;
  if (contactEmail !== undefined) settings.contactEmail = contactEmail;
  if (contactPhone !== undefined) settings.contactPhone = contactPhone;

  await settings.save();

  return successResponse(res, 200, "Settings updated successfully", { settings });
});
