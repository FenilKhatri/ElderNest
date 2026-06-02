import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import Payout from "./payout.model.js";
import Transaction from "../transaction/transaction.model.js";
import Caregiver from "../caregiver/caregiver.model.js";

// @desc    Get all payouts (Admin)
// @route   GET /api/payouts
// @access  Private/Admin
export const getAllPayouts = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const payouts = await Payout.find(query)
        .populate({ path: "caregiverId", populate: { path: "userId", select: "name email phone" } })
        .populate("processedBy", "name email")
        .sort({ createdAt: -1 });

    return successResponse(res, 200, "Payouts fetched successfully", { payouts });
});

// @desc    Get caregiver payouts
// @route   GET /api/payouts/my-payouts
// @access  Private/Caregiver
export const getMyPayouts = asyncHandler(async (req, res) => {
    // We assume req.caregiver exists if they are caregiver, or we need to look it up
    // Just find by caregiverId. We need to lookup the Caregiver doc by req.user.id
    const caregiver = await Caregiver.findOne({ userId: req.user.id });
    if (!caregiver) {
        return errorResponse(res, 404, "Caregiver profile not found");
    }

    const payouts = await Payout.find({ caregiverId: caregiver._id })
        .sort({ createdAt: -1 });

    return successResponse(res, 200, "Payouts fetched successfully", { payouts });
});

// @desc    Create a new payout request (Caregiver) or manual entry (Admin)
// @route   POST /api/payouts
// @access  Private
export const createPayout = asyncHandler(async (req, res) => {
    const { caregiverId, amount, notes, periodStart, periodEnd } = req.body;

    // In a real app, logic to verify earnings would go here

    const payout = await Payout.create({
        caregiverId,
        amount,
        notes,
        periodStart,
        periodEnd
    });

    return successResponse(res, 201, "Payout created successfully", { payout });
});

// @desc    Update payout status (Admin)
// @route   PATCH /api/payouts/:id/status
// @access  Private/Admin
export const updatePayoutStatus = asyncHandler(async (req, res) => {
    const { status, referenceId, notes } = req.body;

    const payout = await Payout.findById(req.params.id);
    if (!payout) {
        return errorResponse(res, 404, "Payout not found");
    }

    payout.status = status;
    if (referenceId) payout.referenceId = referenceId;
    if (notes) payout.notes = notes;

    if (status === "completed" && !payout.processedBy) {
        payout.processedBy = req.user.id;
    }

    await payout.save();

    // Create a transaction record when completed
    if (status === "completed") {
        const cg = await Caregiver.findById(payout.caregiverId);

        await Transaction.create({
            transactionId: `po_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            userId: cg ? cg.userId : null,
            caregiverId: payout.caregiverId,
            amount: payout.amount,
            type: "payout",
            status: "completed",
            paymentMethod: payout.payoutMethod,
            metadata: { payoutId: payout._id, referenceId }
        });
    }

    return successResponse(res, 200, "Payout status updated successfully", { payout });
});
