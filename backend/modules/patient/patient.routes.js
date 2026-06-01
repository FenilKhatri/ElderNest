import express from "express";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import { ROLES } from "../../common/utils/constants.js";
import * as patientController from "./patient.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", authorizeRoles(ROLES.USER), patientController.createPatient);
router.get("/", authorizeRoles(ROLES.USER), patientController.getMyPatients);
router.get("/:id", authorizeRoles(ROLES.USER), patientController.getPatient);
router.patch("/:id", authorizeRoles(ROLES.USER), patientController.updatePatient);
router.delete("/:id", authorizeRoles(ROLES.USER), patientController.deletePatient);

export default router;
