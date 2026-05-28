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

    // Filter by single or multiple services
    if (filters.services) {
        const servicesArray = Array.isArray(filters.services) ? filters.services : filters.services.split(',');
        query.servicesOffered = { $in: servicesArray };
    }
    if (filters.service) { // To support ?service=Physiotherapy
        const service = await Service.findOne({ 
            $or: [{ slug: filters.service.toLowerCase() }, { _id: filters.service.match(/^[0-9a-fA-F]{24}$/) ? filters.service : null }]
        });
        if (service) {
            query.servicesOffered = service._id;
        }
    }

    // Filter by location
    if (filters.city) {
        query["location.city"] = { $regex: new RegExp(filters.city, "i") };
    }
    if (filters.state) {
        query["location.state"] = filters.state;
    }

    // Filter by rating
    if (filters.rating || filters.minRating) {
        query.rating = { $gte: parseFloat(filters.rating || filters.minRating) };
    }

    // Filter by experience
    if (filters.experience) {
        // e.g., '5+', '3-5', '1-3'
        if (filters.experience === '5+') query.experienceYears = { $gte: 5 };
        else if (filters.experience === '3-5') query.experienceYears = { $gte: 3, $lt: 5 };
        else if (filters.experience === '1-3') query.experienceYears = { $gte: 1, $lt: 3 };
    }

    // Search by name (via populated userId, but since we can't easily search populated fields in mongoose find query, 
    // we first find users matching the search, then filter caregivers by those userIds)
    if (filters.search) {
        const matchingUsers = await User.find({ name: { $regex: new RegExp(filters.search, "i") } }).select('_id');
        const userIds = matchingUsers.map(u => u._id);
        
        // Also search in bio/languages for caregiver specific fields
        query.$or = [
            { userId: { $in: userIds } },
            { bio: { $regex: new RegExp(filters.search, "i") } },
            { languages: { $regex: new RegExp(filters.search, "i") } }
        ];
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
