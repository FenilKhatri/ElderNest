import User from "../user/user.model.js";
import Caregiver from "../caregiver/caregiver.model.js";
import Booking from "../booking/booking.model.js";
import Contact from "../contact/contact.model.js";
import Service from "../service/service.model.js";
import Patient from "../patient/patient.model.js";
import Complaint from "../complaint/complaint.model.js";
import Notification from "../notification/notification.model.js";
import Message from "../message/message.model.js";
import Review from "../review/review.model.js";
import CareNote from "../careNote/careNote.model.js";
import { createNotification } from "../../common/services/notification.service.js";

import { ONBOARDING_STAGES } from "../../common/utils/caregiverOnboarding.js";
import mongoose from "mongoose";
import { deleteFromCloudinary } from "../../config/cloudinary.js";

export const getPendingCaregivers = async () => {
    const caregivers = await User.find({
        role: "caregiver",
        isApproved: false,
        status: "pending",
    }).select("-password");

    return caregivers;
};

export const approveCaregiverRegistration = async (userId) => {
    const [user, caregiver] = await Promise.all([
        User.findById(userId),
        Caregiver.findOne({ userId })
    ]);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.role !== "caregiver") {
        throw new Error("User is not a caregiver");
    }

    user.isApproved = true;
    user.status = "approved";

    const promises = [user.save()];

    if (caregiver) {
        caregiver.onboardingStage = ONBOARDING_STAGES.ACCOUNT_APPROVED;
        promises.push(caregiver.save());
    }

    await Promise.all(promises);

    createNotification(
        userId,
        "caregiver_approved",
        "Account Approved!",
        "Your account has been approved. Please complete document verification.",
        "/caregiver/verification"
    ).catch(console.error);

    return user;
};

export const rejectCaregiverRegistration = async (userId, reason) => {
    const [user, caregiver] = await Promise.all([
        User.findById(userId),
        Caregiver.findOne({ userId })
    ]);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.role !== "caregiver") {
        throw new Error("User is not a caregiver");
    }

    user.status = "rejected";
    user.isApproved = false;

    const promises = [user.save()];

    if (caregiver) {
        caregiver.onboardingStage = ONBOARDING_STAGES.REJECTED;
        caregiver.adminFeedback = reason;
        promises.push(caregiver.save());
    }

    await Promise.all(promises);

    createNotification(
        userId,
        "caregiver_rejected",
        "Registration Rejected",
        reason || "Your caregiver registration was not approved.",
        "/caregiver/rejected"
    ).catch(console.error);

    return user;
};

export const getPendingProfiles = async () => {
    const caregivers = await Caregiver.find({
        onboardingStage: ONBOARDING_STAGES.VERIFICATION_PENDING,
    })
        .populate("userId", "name email phone")
        .populate("servicesOffered", "title");

    return caregivers;
};

export const getCaregiverVerificationDetail = async (caregiverId) => {
    const caregiver = await Caregiver.findById(caregiverId)
        .populate("userId", "name email phone profileImage")
        .populate("servicesOffered", "title description price slug");

    if (!caregiver) {
        throw new Error("Caregiver not found");
    }

    return caregiver;
};

export const reviewCaregiverVerification = async (caregiverId, action, feedback = "") => {
    const caregiver = await Caregiver.findById(caregiverId).populate("userId");
    if (!caregiver) {
        throw new Error("Caregiver not found");
    }

    const userId = caregiver.userId._id;

    if (action === "approve") {
        caregiver.onboardingStage = ONBOARDING_STAGES.ACTIVE;
        caregiver.profileApprovalStatus = "approved";
        caregiver.isPublished = true;
        caregiver.adminFeedback = "";
        await caregiver.save();

        createNotification(
            userId,
            "caregiver_approved",
            "Verification Approved",
            "Your verification was approved. You are now a verified caregiver.",
            "/caregiver/dashboard"
        ).catch(console.error);
    } else if (action === "reject") {
        caregiver.onboardingStage = ONBOARDING_STAGES.REJECTED;
        caregiver.profileApprovalStatus = "rejected";
        caregiver.isPublished = false;
        caregiver.adminFeedback = feedback;
        await caregiver.save();

        createNotification(
            userId,
            "caregiver_rejected",
            "Verification Rejected",
            feedback || "Your verification was rejected.",
            "/caregiver/rejected"
        ).catch(console.error);
    } else if (action === "changes") {
        caregiver.onboardingStage = ONBOARDING_STAGES.VERIFICATION_CHANGES;
        caregiver.profileApprovalStatus = "changes-required";
        caregiver.isPublished = false;
        caregiver.adminFeedback = feedback;
        await caregiver.save();

        createNotification(
            userId,
            "profile_update_required",
            "Additional Information Required",
            feedback || "Please update your verification documents and resubmit.",
            "/caregiver/verification"
        ).catch(console.error);
    } else {
        throw new Error("Invalid review action");
    }

    return caregiver;
};

export const approveCaregiverProfile = async (caregiverId) => {
    const caregiver = await Caregiver.findById(caregiverId).populate("userId");
    if (!caregiver) {
        throw new Error("Caregiver not found");
    }

    caregiver.profileApprovalStatus = "approved";
    await caregiver.save();

    createNotification(
        caregiver.userId._id,
        "caregiver_approved",
        "Profile Approved!",
        "Your profile is now live and visible to users.",
        "/caregiver/dashboard"
    ).catch(console.error);

    return caregiver;
};

export const rejectCaregiverProfile = async (caregiverId, feedback) => {
    const caregiver = await Caregiver.findById(caregiverId).populate("userId");
    if (!caregiver) {
        throw new Error("Caregiver not found");
    }

    caregiver.profileApprovalStatus = "changes-required";
    caregiver.adminFeedback = feedback;
    await caregiver.save();

    createNotification(
        caregiver.userId._id,
        "general",
        "Profile Changes Required",
        "Admin has requested changes to your profile. Please review and update.",
        "/caregiver/profile/complete"
    ).catch(console.error);

    return caregiver;
};

export const getAllUsers = async (role = null) => {
    const query = {};
    if (role) {
        query.role = role;
    }

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    return users;
};

export const getDashboardStats = async (timeframe) => {
    let dateFilter = {};
    const now = new Date();
    
    if (timeframe === "last7") {
        const d = new Date(); d.setDate(now.getDate() - 7);
        dateFilter = { createdAt: { $gte: d } };
    } else if (timeframe === "last30") {
        const d = new Date(); d.setDate(now.getDate() - 30);
        dateFilter = { createdAt: { $gte: d } };
    } else if (timeframe === "thisYear") {
        const d = new Date(now.getFullYear(), 0, 1);
        dateFilter = { createdAt: { $gte: d } };
    }

    const totalUsers = await User.countDocuments({ role: "user", ...dateFilter });
    const totalCaregivers = await User.countDocuments({ role: "caregiver", isApproved: true, ...dateFilter });
    const pendingCaregivers = await User.countDocuments({ role: "caregiver", isApproved: false, status: "pending" });
    const pendingProfiles = await Caregiver.countDocuments({ profileCompleted: true, profileApprovalStatus: "pending" });
    
    const totalBookings = await Booking.countDocuments(dateFilter);
    const pendingBookings = await Booking.countDocuments({ status: "pending", ...dateFilter });
    const completedBookings = await Booking.countDocuments({ status: "completed", ...dateFilter });
    const pendingContacts = await Contact.countDocuments({ status: "pending", ...dateFilter });

    // Bar Chart Data (Monthly Bookings)
    let monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - 5);
    monthsAgo.setDate(1);

    const monthlyTrendsData = await Booking.aggregate([
        { $match: { createdAt: { $gte: monthsAgo } } },
        {
            $group: {
                _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                bookings: { $sum: 1 },
            },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const barData = monthlyTrendsData.map(m => ({
        name: monthNames[m._id.month - 1],
        bookings: m.bookings
    }));

    // Pie Chart Data (Service Popularity)
    const servicePopularityData = await Booking.aggregate([
        { $match: dateFilter },
        { $lookup: { from: "services", localField: "serviceId", foreignField: "_id", as: "service" } },
        { $unwind: { path: "$service", preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: "$service.title",
                value: { $sum: 1 }
            }
        },
        { $sort: { value: -1 } },
        { $limit: 3 }
    ]);

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
    const pieData = servicePopularityData.map((s, idx) => ({
        name: s._id || "Other",
        value: s.value,
        color: colors[idx % colors.length]
    }));

    return {
        totalUsers,
        totalCaregivers,
        pendingCaregivers,
        pendingProfiles,
        totalBookings,
        pendingBookings,
        completedBookings,
        pendingContacts,
        barData,
        pieData
    };
};

export const getAllContacts = async (status = null) => {
    const query = {};
    if (status) {
        query.status = status;
    }

    const contacts = await Contact.find(query)
        .populate("resolvedBy", "name email")
        .sort({ createdAt: -1 });

    return contacts;
};

export const updateContactStatus = async (contactId, status, adminId, adminNotes = null) => {
    const contact = await Contact.findById(contactId);
    if (!contact) {
        throw new Error("Contact not found");
    }

    contact.status = status;
    if (adminNotes) {
        contact.adminNotes = adminNotes;
    }

    if (status === "resolved" || status === "closed") {
        contact.resolvedBy = adminId;
        contact.resolvedAt = new Date();
    }

    await contact.save();
    return contact;
};

export const suspendCaregiver = async (userId, suspend = true) => {
    const user = await User.findById(userId);
    if (!user || user.role !== "caregiver") {
        throw new Error("Caregiver not found");
    }

    const caregiver = await Caregiver.findOne({ userId });
    if (!caregiver) {
        throw new Error("Caregiver profile not found");
    }

    caregiver.isActive = !suspend;
    if (suspend) {
        user.status = "rejected";
    } else {
        user.status = "approved";
        user.isApproved = true;
    }
    await caregiver.save();
    await user.save();

    await createNotification(
        userId,
        "general",
        suspend ? "Account Suspended" : "Account Reactivated",
        suspend
            ? "Your caregiver account has been suspended. Contact support for details."
            : "Your caregiver account has been reactivated.",
        "/caregiver/dashboard"
    );

    return { user, caregiver };
};

export const getAnalytics = async () => {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalPatients = await Patient.countDocuments({ isActive: true });
    const totalCaregivers = await User.countDocuments({ role: "caregiver", isApproved: true });
    const totalServices = await Service.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.find({ status: "completed" }).select("totalAmount bookingDate");
    const revenue = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyBookings = await Booking.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
            $group: {
                _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                count: { $sum: 1 },
                revenue: { $sum: "$totalAmount" },
            },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const pendingComplaints = await Complaint.countDocuments({ status: "pending" });

    return {
        totalUsers,
        totalPatients,
        totalCaregivers,
        totalServices,
        totalBookings,
        revenue,
        pendingComplaints,
        monthlyTrends: monthlyBookings.map((m) => ({
            month: `${m._id.year}-${String(m._id.month).padStart(2, "0")}`,
            bookings: m.count,
            revenue: m.revenue,
        })),
    };
};

export const deleteUser = async (userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await User.findById(userId).session(session);
        if (!user) {
            throw new Error("User not found");
        }

        if (user.profileImage && user.profileImage.includes("cloudinary.com")) {
            await deleteFromCloudinary(user.profileImage);
        }

        if (user.role === "caregiver") {
            const caregiver = await Caregiver.findOne({ userId }).session(session);
            if (caregiver) {
                const docs = caregiver.documents || {};
                if (docs.idProof && docs.idProof.includes("cloudinary.com")) await deleteFromCloudinary(docs.idProof);
                if (docs.backgroundCheck && docs.backgroundCheck.includes("cloudinary.com")) await deleteFromCloudinary(docs.backgroundCheck);
                if (docs.certifications) {
                    for (const cert of docs.certifications) {
                        if (cert && cert.includes("cloudinary.com")) await deleteFromCloudinary(cert);
                    }
                }

                await Booking.deleteMany({ caregiverId: caregiver._id }).session(session);
                await Review.deleteMany({ caregiverId: caregiver._id }).session(session);
                await CareNote.deleteMany({ caregiverId: caregiver._id }).session(session);
                
                await Caregiver.findByIdAndDelete(caregiver._id).session(session);
            }
        } else {
            await Booking.deleteMany({ userId }).session(session);
            await Patient.deleteMany({ userId }).session(session);
            await Review.deleteMany({ userId }).session(session);
        }

        await Notification.deleteMany({ userId }).session(session);
        await Complaint.deleteMany({ userId }).session(session);
        await Message.deleteMany({
            $or: [{ senderId: userId }, { receiverId: userId }]
        }).session(session);

        await User.findByIdAndDelete(userId).session(session);

        await session.commitTransaction();
        return true;

    } catch (error) {
        await session.abortTransaction();
        console.error("Cascade Delete Error:", error);
        throw error;
    } finally {
        session.endSession();
    }
};
