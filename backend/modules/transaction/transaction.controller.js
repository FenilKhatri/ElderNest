import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import Transaction from "./transaction.model.js";

// @desc    Get all transactions (Admin)
// @route   GET /api/transactions
// @access  Private/Admin
export const getAllTransactions = asyncHandler(async (req, res) => {
    const { type, status } = req.query;
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const transactions = await Transaction.find(query)
        .populate("userId", "name email")
        .populate({ path: "caregiverId", populate: { path: "userId", select: "name email" } })
        .populate("bookingId", "bookingId serviceId timeSlot")
        .sort({ createdAt: -1 });

    return successResponse(res, 200, "Transactions fetched successfully", { transactions });
});

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private/Admin
export const getTransactionById = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id)
        .populate("userId", "name email phone")
        .populate({ path: "caregiverId", populate: { path: "userId", select: "name email phone" } })
        .populate("bookingId");

    if (!transaction) {
        return errorResponse(res, 404, "Transaction not found");
    }

    return successResponse(res, 200, "Transaction fetched successfully", { transaction });
});

// @desc    Update transaction status (Admin)
// @route   PATCH /api/transactions/:id/status
// @access  Private/Admin
export const updateTransactionStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    
    if (!status) {
        return errorResponse(res, 400, "Status is required");
    }

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
        return errorResponse(res, 404, "Transaction not found");
    }

    transaction.status = status;
    await transaction.save();

    return successResponse(res, 200, "Transaction status updated successfully", { transaction });
});
