import User from "../user/user.model.js";
import Caregiver from "../caregiver/caregiver.model.js";
import Booking from "../booking/booking.model.js";
import Contact from "../contact/contact.model.js";
import { createNotification } from "../../common/services/notification.service.js";
import { sendEmail } from "../../common/services/email.service.js";

// Get pending caregiver registrations
export const getPendingCaregivers = async () => {
    const caregivers = await User.find({
        role: "caregiver",
        isApproved: false,
        status: "pending",
    }).select("-password");

    return caregivers;
};

// Approve caregiver registration
export const approveCaregiverRegistration = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    if (user.role !== "caregiver") {
        throw new Error("User is not a caregiver");
    }

    user.isApproved = true;
    user.status = "approved";
    await user.save();

    // Create notification
    await createNotification(
        userId,
        "caregiver_approved",
        "Account Approved!",
        "Your caregiver account has been approved. You can now complete your profile.",
        "/caregiver/profile/complete"
    );

    // Send email
    await sendEmail(user.email, "caregiverApproval", { name: user.name });

    return user;
};

// Reject caregiver registration
export const rejectCaregiverRegistration = async (userId, reason) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    if (user.role !== "caregiver") {
        throw new Error("User is not a caregiver");
    }

    user.status = "rejected";
    await user.save();

    // Create notification
    await createNotification(
        userId,
        "caregiver_rejected",
        "Registration Update",
        "Your caregiver registration could not be approved at this time.",
        null
    );

    // Send email
    await sendEmail(user.email, "caregiverRejection", { name: user.name, reason });

    return user;
};

// Get pending caregiver profiles
export const getPendingProfiles = async () => {
    const caregivers = await Caregiver.find({
        profileCompleted: true,
        profileApprovalStatus: "pending",
    }).populate("userId", "name email");

    return caregivers;
};

// Approve caregiver profile
export const approveCaregiverProfile = async (caregiverId) => {
    const caregiver = await Caregiver.findById(caregiverId).populate("userId");
    if (!caregiver) {
        throw new Error("Caregiver not found");
    }

    caregiver.profileApprovalStatus = "approved";
    await caregiver.save();

    // Create notification
    await createNotification(
        caregiver.userId._id,
        "caregiver_approved",
        "Profile Approved!",
        "Your profile is now live and visible to users.",
        "/caregiver/dashboard"
    );

    // Send email
    await sendEmail(caregiver.userId.email, "caregiverProfileApproval", {
        name: caregiver.userId.name,
    });

    return caregiver;
};

// Reject caregiver profile
export const rejectCaregiverProfile = async (caregiverId, feedback) => {
    const caregiver = await Caregiver.findById(caregiverId).populate("userId");
    if (!caregiver) {
        throw new Error("Caregiver not found");
    }

    caregiver.profileApprovalStatus = "changes-required";
    caregiver.adminFeedback = feedback;
    await caregiver.save();

    // Create notification
    await createNotification(
        caregiver.userId._id,
        "general",
        "Profile Changes Required",
        "Admin has requested changes to your profile. Please review and update.",
        "/caregiver/profile/complete"
    );

    return caregiver;
};

// Get all users
export const getAllUsers = async (role = null) => {
    const query = {};
    if (role) {
        query.role = role;
    }

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    return users;
};

// Get dashboard stats
export const getDashboardStats = async () => {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalCaregivers = await User.countDocuments({ role: "caregiver", isApproved: true });
    const pendingCaregivers = await User.countDocuments({
        role: "caregiver",
        isApproved: false,
        status: "pending",
    });
    const pendingProfiles = await Caregiver.countDocuments({
        profileCompleted: true,
        profileApprovalStatus: "pending",
    });
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const completedBookings = await Booking.countDocuments({ status: "completed" });
    const pendingContacts = await Contact.countDocuments({ status: "pending" });

    return {
        totalUsers,
        totalCaregivers,
        pendingCaregivers,
        pendingProfiles,
        totalBookings,
        pendingBookings,
        completedBookings,
        pendingContacts,
    };
};

// Get all contacts
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

// Update contact status
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
