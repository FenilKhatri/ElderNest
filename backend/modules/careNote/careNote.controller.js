import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse } from "../../common/utils/responseHandler.utils.js";
import * as careNoteService from "./careNote.service.js";

export const createCareNote = asyncHandler(async (req, res) => {
    const note = await careNoteService.createCareNote(req.user.id, req.body);
    return successResponse(res, 201, "Care note created", { careNote: note });
});

export const updateCareNote = asyncHandler(async (req, res) => {
    const note = await careNoteService.updateCareNote(req.params.id, req.user.id, req.body);
    return successResponse(res, 200, "Care note updated", { careNote: note });
});

export const getBookingCareNotes = asyncHandler(async (req, res) => {
    const notes = await careNoteService.getCareNotesByBooking(
        req.params.bookingId,
        req.user.id,
        req.user.role
    );
    return successResponse(res, 200, "Care notes fetched", { careNotes: notes });
});

export const getMyCareNotes = asyncHandler(async (req, res) => {
    const notes = await careNoteService.getCaregiverCareNotes(req.user.id);
    return successResponse(res, 200, "Care notes fetched", { careNotes: notes });
});
