import Caregiver from "./caregiver.model.js";
import User from "../user/user.model.js";
import Service from "../service/service.model.js";
import Booking from "../booking/booking.model.js";
import { validateLocation } from "../../common/validators/location.validator.js";
import { createNotification } from "../../common/services/notification.service.js";
import { AppError } from "../../common/utils/appError.js";
import { ROLES } from "../../common/utils/constants.js";
import { ONBOARDING_STAGES, isCaregiverBookable } from "../../common/utils/caregiverOnboarding.js";

const buildPricing = (pricing) => {
    if (!pricing || typeof pricing !== "object") return undefined;

    const rates = {};
    for (const key of ["hourlyRate", "dailyRate", "monthlyRate"]) {
        const value = pricing[key];
        if (value === undefined || value === null || value === "") continue;
        const num = Number(value);
        if (!Number.isNaN(num) && num >= 0) rates[key] = num;
    }

    return Object.keys(rates).length > 0 ? rates : undefined;
};

const notifySafely = async (fn) => {
    try {
        await fn();
    } catch (err) {
        console.error("Profile notification failed:", err?.message || err);
    }
};

// Get all approved caregivers (public)
export const getAllCaregivers = async (filters = {}) => {
    const query = {
        isActive: true,
        profileCompleted: true,
        profileApprovalStatus: "approved",
        onboardingStage: ONBOARDING_STAGES.ACTIVE,
        isPublished: true,
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
        .populate("servicesOffered", "title description price slug")
        .sort({ rating: -1, totalReviews: -1 });

    return caregivers;
};

// Get caregiver by ID
export const getCaregiverById = async (id) => {
    const caregiver = await Caregiver.findById(id)
        .populate("userId", "name email profileImage phone")
        .populate("servicesOffered", "title description price slug");

    if (!caregiver) {
        throw new Error("Caregiver not found");
    }

    if (!isCaregiverBookable(caregiver)) {
        throw new AppError("Caregiver is not available for booking", 404);
    }

    return caregiver;
};

// Complete caregiver profile
export const completeProfile = async (userId, profileData) => {
    const {
        servicesOffered,
        location,
        pricing,
        alternateContact,
        certifications,
        fullName,
        email,
        contactNumber,
        gender,
        age,
        experienceYears,
        bio,
        availableTiming,
        languages,
    } = profileData;

    const caregiver = await Caregiver.findOne({ userId });
    if (!caregiver) {
        throw new AppError("Caregiver profile not found", 404);
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.status !== "approved" || !user.isApproved) {
        throw new AppError(
            "Your account must be approved by an admin before you can complete your profile.",
            403
        );
    }

    if (!Array.isArray(servicesOffered) || servicesOffered.length === 0) {
        throw new AppError("Select at least one service", 400);
    }

    if (servicesOffered.length > 3) {
        throw new AppError("Cannot select more than 3 services", 400);
    }

    const services = await Service.find({
        _id: { $in: servicesOffered },
        isActive: true,
    });
    if (services.length !== servicesOffered.length) {
        throw new AppError("One or more selected services are invalid or inactive", 400);
    }

    if (!location?.state || !location?.city || !location?.pincode) {
        throw new AppError("Location details are required", 400);
    }

    const locationValidation = validateLocation(
        location.state,
        location.city,
        location.pincode
    );
    if (!locationValidation.isValid) {
        throw new AppError(locationValidation.errors.join(", "), 400);
    }

    const updatePayload = {
        fullName,
        email,
        contactNumber,
        gender,
        age: Number(age),
        experienceYears: Number(experienceYears),
        bio,
        availableTiming,
        languages,
        servicesOffered,
        location: {
            ...location,
            country: location.country || "India",
        },
        profileCompleted: true,
        profileApprovalStatus: "pending",
    };

    if (alternateContact) {
        updatePayload.alternateContact = alternateContact;
    }

    if (Array.isArray(certifications) && certifications.length > 0) {
        updatePayload.certifications = certifications;
    }

    const pricingRates = buildPricing(pricing);
    if (pricingRates) {
        updatePayload.pricing = pricingRates;
    }

    Object.assign(caregiver, updatePayload);
    await caregiver.save();

    await Service.updateMany(
        { caregivers: caregiver._id },
        { $pull: { caregivers: caregiver._id } }
    );
    await Service.updateMany(
        { _id: { $in: servicesOffered } },
        { $addToSet: { caregivers: caregiver._id } }
    );

    const admins = await User.find({ role: ROLES.ADMIN });
    for (const admin of admins) {
        await notifySafely(() =>
            createNotification(
                admin._id,
                "general",
                "Caregiver Profile Submitted",
                `${user.name} submitted profile details for review.`,
                "/admin/caregivers"
            )
        );
    }

    return caregiver;
};

// Update caregiver profile (edit mode)
export const updateProfile = async (userId, profileData) => {
    const caregiver = await Caregiver.findOne({ userId });
    if (!caregiver) {
        throw new AppError("Caregiver profile not found", 404);
    }

    const allowed = [
        "fullName",
        "contactNumber",
        "alternateContact",
        "gender",
        "age",
        "experienceYears",
        "bio",
        "languages",
        "location",
        "availableTiming",
        "pricing",
        "profileImage",
        "skills",
        "certifications",
        "servicesOffered",
    ];

    for (const key of allowed) {
        if (profileData[key] !== undefined) {
            caregiver[key] = profileData[key];
        }
    }

    if (profileData.pricing) {
        const rates = buildPricing(profileData.pricing);
        if (rates) caregiver.pricing = rates;
    }

    await caregiver.save();

    if (profileData.servicesOffered?.length) {
        await Service.updateMany(
            { caregivers: caregiver._id },
            { $pull: { caregivers: caregiver._id } }
        );
        await Service.updateMany(
            { _id: { $in: profileData.servicesOffered } },
            { $addToSet: { caregivers: caregiver._id } }
        );
    }

    return caregiver;
};

// Submit verification (stage 3)
export const submitVerification = async (userId, payload) => {
    const caregiver = await Caregiver.findOne({ userId });
    if (!caregiver) {
        throw new AppError("Caregiver profile not found", 404);
    }

    const allowedStages = [
        ONBOARDING_STAGES.ACCOUNT_APPROVED,
        ONBOARDING_STAGES.VERIFICATION_CHANGES,
    ];
    if (!allowedStages.includes(caregiver.onboardingStage)) {
        throw new AppError("Verification cannot be submitted at this stage", 403);
    }

    const {
        servicesOffered,
        documents,
        verificationInfo,
        fullName,
        contactNumber,
        bio,
        experienceYears,
        location,
        languages,
    } = payload;

    if (!documents?.governmentId || !documents?.idProof) {
        throw new AppError("Government ID and ID proof are required", 400);
    }

    if (!Array.isArray(servicesOffered) || servicesOffered.length === 0) {
        throw new AppError("Select at least one service", 400);
    }

    const services = await Service.find({
        _id: { $in: servicesOffered },
        isActive: true,
    });
    if (services.length !== servicesOffered.length) {
        throw new AppError("Invalid service selection", 400);
    }

    if (fullName) caregiver.fullName = fullName;
    if (contactNumber) caregiver.contactNumber = contactNumber;
    if (bio) caregiver.bio = bio;
    if (experienceYears != null) caregiver.experienceYears = Number(experienceYears);
    if (location) caregiver.location = { ...caregiver.location?.toObject?.() || caregiver.location, ...location };
    if (languages?.length) caregiver.languages = languages;

    caregiver.servicesOffered = servicesOffered;
    caregiver.documents = {
        aadharCard: documents.governmentId,
        idProof: documents.idProof,
        certificates: documents.certificates || [],
        policeClearance: documents.experienceDocuments || documents.policeClearance || "",
    };
    caregiver.verificationInfo = verificationInfo || "";
    caregiver.profileCompleted = true;
    caregiver.profileApprovalStatus = "pending";
    caregiver.onboardingStage = ONBOARDING_STAGES.VERIFICATION_PENDING;
    caregiver.verificationSubmittedAt = new Date();

    await caregiver.save();

    await Service.updateMany(
        { caregivers: caregiver._id },
        { $pull: { caregivers: caregiver._id } }
    );
    await Service.updateMany(
        { _id: { $in: servicesOffered } },
        { $addToSet: { caregivers: caregiver._id } }
    );

    const user = await User.findById(userId);
    const admins = await User.find({ role: ROLES.ADMIN });
    for (const admin of admins) {
        await notifySafely(() =>
            createNotification(
                admin._id,
                "general",
                "Caregiver Verification Submitted",
                `${user?.name || "A caregiver"} submitted verification documents. Review required.`,
                `/admin/caregivers/${caregiver._id}/verification`
            )
        );
    }

    await notifySafely(() =>
        createNotification(
            userId,
            "general",
            "Verification Submitted",
            "Your documents were submitted. Please wait for admin approval.",
            "/caregiver/verification"
        )
    );

    return caregiver;
};

export const getOnboardingStatus = async (userId) => {
    const caregiver = await Caregiver.findOne({ userId }).populate(
        "servicesOffered",
        "title slug"
    );
    const user = await User.findById(userId).select("isApproved status role name");
    if (!caregiver) {
        throw new AppError("Caregiver profile not found", 404);
    }
    return { user, caregiver, stage: caregiver.onboardingStage };
};

// Update availability
export const updateAvailability = async (userId, availability) => {
    const caregiver = await Caregiver.findOne({ userId });
    if (!caregiver) {
        throw new AppError("Caregiver profile not found", 404);
    }

    if (caregiver.onboardingStage !== ONBOARDING_STAGES.ACTIVE) {
        throw new AppError("Complete verification before setting availability", 403);
    }

    caregiver.availability = availability;
    await caregiver.save();

    return caregiver;
};

export const getCaregiverDashboardStats = async (userId) => {
    const caregiver = await Caregiver.findOne({ userId });
    if (!caregiver) {
        throw new Error("Caregiver profile not found");
    }

    const bookings = await Booking.find({ caregiverId: caregiver._id });
    const now = new Date();
    const upcoming = bookings.filter(
        (b) =>
            ["pending", "accepted"].includes(b.status) &&
            new Date(b.bookingDate) >= now
    );
    const active = bookings.filter((b) => b.status === "in-progress");
    const completed = bookings.filter((b) => b.status === "completed");
    const monthlyEarnings = completed
        .filter((b) => {
            const d = new Date(b.completedAt || b.bookingDate);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    return {
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b) => b.status === "pending").length,
        activeBookings: active.length,
        upcomingBookings: upcoming.length,
        completedBookings: completed.length,
        monthlyEarnings,
        rating: caregiver.rating,
        totalReviews: caregiver.totalReviews,
    };
};

// Get caregiver profile by userId
export const getCaregiverByUserId = async (userId) => {
    const caregiver = await Caregiver.findOne({ userId })
        .populate("userId", "name email profileImage phone")
        .populate("servicesOffered", "title description price slug");

    if (!caregiver) {
        throw new Error("Caregiver profile not found");
    }

    return caregiver;
};
