import Caregiver from "./caregiver.model.js";
import User from "../user/user.model.js";
import Service from "../service/service.model.js";
import { validateLocation } from "../../common/validators/location.validator.js";
import { createNotification } from "../../common/services/notification.service.js";
import { sendEmail } from "../../common/services/email.service.js";

// Get all approved caregivers (public)
export const getAllCaregivers = async (filters = {}) => {
    const query = {
        isActive: true,
        profileCompleted: true,
        profileApprovalStatus: "approved",
    };

    // Filter by services
    if (filters.services && filters.services.length > 0) {
        query.servicesOffered = { $in: filters.services };
    }

    // Filter by location
    if (filters.city) {
        query["location.city"] = filters.city;
    }
    if (filters.state) {
        query["location.state"] = filters.state;
    }

    // Filter by rating
    if (filters.minRating) {
        query.rating = { $gte: parseFloat(filters.minRating) };
    }

    const caregivers = await Caregiver.find(query)
        .populate("userId", "name email profileImage")
        .populate("servicesOffered", "name description")
        .sort({ rating: -1, totalReviews: -1 });

    return caregivers;
};

// Get caregiver by ID
export const getCaregiverById = async (id) => {
    const caregiver = await Caregiver.findById(id)
        .populate("userId", "name email profileImage phone")
        .populate("servicesOffered", "name description basePrice");

    if (!caregiver) {
        throw new Error("Caregiver not found");
    }

    return caregiver;
};

// Complete caregiver profile
export const completeProfile = async (userId, profileData) => {
    const {
        servicesOffered,
        location,
        ...otherData
    } = profileData;

    // Find caregiver by userId
    const caregiver = await Caregiver.findOne({ userId });
    if (!caregiver) {
        throw new Error("Caregiver profile not found");
    }

    // Check if user is approved
    const user = await User.findById(userId);
    if (!user.isApproved) {
        throw new Error("Your account is not approved yet");
    }

    // Validate services (max 3)
    if (servicesOffered.length > 3) {
        throw new Error("Cannot select more than 3 services");
    }

    // Validate services exist
    const services = await Service.find({ _id: { $in: servicesOffered } });
    if (services.length !== servicesOffered.length) {
        throw new Error("Invalid service selected");
    }

    // Validate location
    const locationValidation = validateLocation(
        location.state,
        location.city,
        location.pincode
    );
    if (!locationValidation.isValid) {
        throw new Error(locationValidation.errors.join(", "));
    }

    // Update caregiver profile
    Object.assign(caregiver, {
        ...otherData,
        servicesOffered,
        location,
        profileCompleted: true,
        profileApprovalStatus: "pending",
    });

    await caregiver.save();

    // Notify admin
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
        await createNotification(
            admin._id,
            "general",
            "New Caregiver Profile",
            `${user.name} has completed their profile and needs approval`,
            "/admin/caregivers"
        );
    }

    // Notify caregiver
    await createNotification(
        userId,
        "general",
        "Profile Submitted",
        "Your profile has been submitted for admin approval",
        "/caregiver/dashboard"
    );

    return caregiver;
};

// Update availability
export const updateAvailability = async (userId, availability) => {
    const caregiver = await Caregiver.findOne({ userId });
    if (!caregiver) {
        throw new Error("Caregiver profile not found");
    }

    caregiver.availability = availability;
    await caregiver.save();

    return caregiver;
};

// Get caregiver profile by userId
export const getCaregiverByUserId = async (userId) => {
    const caregiver = await Caregiver.findOne({ userId })
        .populate("userId", "name email profileImage phone")
        .populate("servicesOffered", "name description basePrice");

    if (!caregiver) {
        throw new Error("Caregiver profile not found");
    }

    return caregiver;
};
