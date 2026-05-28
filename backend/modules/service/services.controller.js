import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import { validationResult } from "express-validator";
import Service from "./service.model.js";

// Get all services
export const getAllServices = asyncHandler(async (req, res) => {
    const { category, isActive } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const services = await Service.find(query).sort({ title: 1 });
    return successResponse(res, 200, "Services fetched", { services });
});

// Get service by ID or Slug
export const getServiceByIdOrSlug = asyncHandler(async (req, res) => {
    const { idOrSlug } = req.params;
    let service;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        service = await Service.findById(idOrSlug);
    }
    
    if (!service) {
        // Handle case-insensitive slug lookup
        service = await Service.findOne({ slug: idOrSlug.toLowerCase() });
    }
    
    if (!service) {
        return errorResponse(res, 404, "Service not found");
    }

    return successResponse(res, 200, "Service fetched", { service });
});

// Create service (admin only)
export const createService = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const service = await Service.create(req.body);
    return successResponse(res, 201, "Service created", { service });
});

// Update service (admin only)
export const updateService = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const { id } = req.params;
    const service = await Service.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!service) {
        return errorResponse(res, 404, "Service not found");
    }

    return successResponse(res, 200, "Service updated", { service });
});

// Delete service (admin only)
export const deleteService = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);
    
    if (!service) {
        return errorResponse(res, 404, "Service not found");
    }

    return successResponse(res, 200, "Service deleted");
});
