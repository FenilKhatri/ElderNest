import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import { validationResult } from "express-validator";
import Service from "./service.model.js";
import Caregiver from "../caregiver/caregiver.model.js";

const syncServiceCaregivers = async (serviceId, caregiverIds = []) => {
    if (!caregiverIds?.length) return;

    await Caregiver.updateMany(
        { _id: { $in: caregiverIds } },
        { $addToSet: { servicesOffered: serviceId } }
    );
};

export const getAllServices = asyncHandler(async (req, res) => {
    const { category, isActive, search, featured, page = 1, limit = 50, drafts } = req.query;

    const query = {};
    if (drafts === "true") {
        query.isDraft = true;
    } else if (drafts !== "all") {
        query.isDraft = { $ne: true };
    }
    if (category) {
        if (Array.isArray(category)) query.category = { $in: category };
        else if (category.includes(',')) query.category = { $in: category.split(',') };
        else query.category = category;
    }
    if (req.query.serviceMode) {
        if (Array.isArray(req.query.serviceMode)) query.serviceMode = { $in: req.query.serviceMode };
        else if (req.query.serviceMode.includes(',')) query.serviceMode = { $in: req.query.serviceMode.split(',') };
        else query.serviceMode = req.query.serviceMode;
    }
    if (req.query.rating) query.rating = { $gte: Number(req.query.rating) };
    if (isActive !== undefined) {
        const isTrue = isActive === "true" || isActive === true;
        if (isTrue) {
            query.isActive = { $ne: false };
        } else {
            query.isActive = false;
        }
    }
    if (featured === "true") query.isFeatured = true;
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { shortDescription: { $regex: search, $options: "i" } },
        ];
    }

    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedLimit = parseInt(limit, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    const [services, total] = await Promise.all([
        Service.find(query)
            .populate({
                path: "caregivers",
                select: "fullName rating totalReviews profileImage experienceYears",
                populate: { path: "userId", select: "name profileImage" },
            })
            .sort({ isFeatured: -1, title: 1 })
            .skip(skip)
            .limit(parsedLimit),
        Service.countDocuments(query),
    ]);

    const hasMore = total > skip + services.length;

    return successResponse(res, 200, "Services fetched", {
        services,
        pagination: { total, page: parsedPage, limit: parsedLimit, hasMore },
    });
});

export const getServiceByIdOrSlug = asyncHandler(async (req, res) => {
    const { idOrSlug } = req.params;
    let service;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        service = await Service.findById(idOrSlug);
    }

    if (!service) {
        service = await Service.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!service) {
        return errorResponse(res, 404, "Service not found");
    }

    await service.populate({
        path: "caregivers",
        match: { profileApprovalStatus: "approved", isActive: true },
        select: "fullName rating totalReviews profileImage experienceYears skills languages bio location",
        populate: { path: "userId", select: "name profileImage" },
    });

    if (!service.caregivers?.length) {
        const assignedCaregivers = await Caregiver.find({
            servicesOffered: service._id,
            profileApprovalStatus: "approved",
            isActive: true,
        })
            .populate("userId", "name profileImage")
            .select("fullName rating totalReviews profileImage experienceYears skills languages bio location")
            .limit(20);
        service = service.toObject();
        service.caregivers = assignedCaregivers;
    }

    return successResponse(res, 200, "Service fetched", { service });
});

export const getRelatedServices = asyncHandler(async (req, res) => {
    const { idOrSlug } = req.params;
    let service;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        service = await Service.findById(idOrSlug);
    }
    if (!service) {
        service = await Service.findOne({ slug: idOrSlug.toLowerCase() });
    }
    if (!service) return errorResponse(res, 404, "Service not found");

    let related = await Service.find({
        category: service.category,
        _id: { $ne: service._id },
        isActive: { $ne: false },
        isDraft: { $ne: true }
    }).limit(4);
    
    // Fallback to other category if < 3
    if (related.length < 3) {
        const others = await Service.find({
            _id: { $ne: service._id, $nin: related.map(r => r._id) },
            isActive: { $ne: false },
            isDraft: { $ne: true }
        }).limit(4 - related.length);
        related = [...related, ...others];
    }

    return successResponse(res, 200, "Related services fetched", { services: related });
});

export const createService = asyncHandler(async (req, res) => {
    try {
        await Service.collection.dropIndex("name_1");
        console.log("Dropped obsolete index name_1");
    } catch (e) {
    }

    if (!req.body.isDraft) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, "Validation failed", errors.array());
        }
    }

    const payload = { ...req.body };
    if (payload.isDraft) {
        payload.isActive = false;
    }

    const service = await Service.create(payload);
    if (req.body.caregivers?.length) {
        await syncServiceCaregivers(service._id, req.body.caregivers);
    }
    return successResponse(res, 201, "Service created", { service });
});

export const updateService = asyncHandler(async (req, res) => {
    if (!req.body.isDraft) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, "Validation failed", errors.array());
        }
    }

    const { id } = req.params;
    const payload = { ...req.body };
    if (payload.isDraft) payload.isActive = false;
    const service = await Service.findByIdAndUpdate(id, payload, { returnDocument: 'after' });

    if (!service) {
        return errorResponse(res, 404, "Service not found");
    }

    if (req.body.caregivers) {
        await syncServiceCaregivers(service._id, req.body.caregivers);
    }

    return successResponse(res, 200, "Service updated", { service });
});

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
