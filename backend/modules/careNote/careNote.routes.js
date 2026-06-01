import express from "express";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import { ROLES } from "../../common/utils/constants.js";
import * as careNoteController from "./careNote.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", authorizeRoles(ROLES.CAREGIVER), careNoteController.createCareNote);
router.get("/my", authorizeRoles(ROLES.CAREGIVER), careNoteController.getMyCareNotes);
router.get("/booking/:bookingId", careNoteController.getBookingCareNotes);
router.patch("/:id", authorizeRoles(ROLES.CAREGIVER), careNoteController.updateCareNote);

export default router;
