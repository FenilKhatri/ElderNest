import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import Transaction from "./transaction.model.js";

// @desc    Get all transactions (Admin)
// @route   GET /api/transactions
export const getAllTransactions = asyncHandler(async (req, res) => {
    const { type, status, page = 1, limit = 50 } = req.query;
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedLimit = parseInt(limit, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    const [transactions, total] = await Promise.all([
        Transaction.find(query)
            .populate("userId", "name email")
            .populate({ path: "caregiverId", populate: { path: "userId", select: "name email" } })
            .populate("bookingId", "bookingId serviceId timeSlot")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parsedLimit),
        Transaction.countDocuments(query)
    ]);

    const hasMore = total > skip + transactions.length;

    return successResponse(res, 200, "Transactions fetched successfully", { 
        transactions,
        pagination: { total, page: parsedPage, limit: parsedLimit, hasMore }
    });
});

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
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
