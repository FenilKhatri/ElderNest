import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse } from "../../common/utils/responseHandler.utils.js";
import * as complaintService from "./complaint.service.js";

export const submitComplaint = asyncHandler(async (req, res) => {
    const complaint = await complaintService.createComplaint(req.user.id, req.body);
    return successResponse(res, 201, "Complaint submitted", { complaint });
});

export const getMyComplaints = asyncHandler(async (req, res) => {
    const complaints = await complaintService.getMyComplaints(req.user.id);
    return successResponse(res, 200, "Complaints fetched", { complaints });
});

export const getAllComplaints = asyncHandler(async (req, res) => {
    const complaints = await complaintService.getAllComplaints(req.query);
    return successResponse(res, 200, "Complaints fetched", { complaints });
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
    const { status, adminNotes } = req.body;
    const complaint = await complaintService.updateComplaintStatus(
        req.params.id,
        req.user.id,
        status,
        adminNotes
    );
    return successResponse(res, 200, "Complaint updated", { complaint });
});
