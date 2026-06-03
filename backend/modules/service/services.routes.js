import express from "express";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import { ROLES } from "../../common/utils/constants.js";
import * as serviceController from "./services.controller.js";
import {
    createServiceValidator,
    updateServiceValidator,
    deleteServiceValidator,
} from "./service.validators.js";

const router = express.Router();

router.get("/", serviceController.getAllServices);
router.get("/:idOrSlug", serviceController.getServiceByIdOrSlug);

router.use(protect, authorizeRoles(ROLES.ADMIN));
router.post("/", createServiceValidator, serviceController.createService);
router.patch("/:id", updateServiceValidator, serviceController.updateService);
router.delete("/:id", deleteServiceValidator, serviceController.deleteService);

export default router;
