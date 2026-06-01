import Caregiver from "../../modules/caregiver/caregiver.model.js";
import { errorResponse } from "../utils/responseHandler.utils.js";
import {
    ONBOARDING_STAGES,
    isCaregiverBookable,
} from "../utils/caregiverOnboarding.js";

/** Block caregiver API actions until onboarding stage allows it */
export const requireCaregiverStage = (...allowedStages) => {
    return async (req, res, next) => {
        const caregiver = await Caregiver.findOne({ userId: req.user.id });
        if (!caregiver) {
            return errorResponse(res, 403, "Caregiver profile not found");
        }

        req.caregiver = caregiver;

        if (!allowedStages.includes(caregiver.onboardingStage)) {
            return errorResponse(
                res,
                403,
                "This action is not available at your current onboarding stage."
            );
        }

        next();
    };
};

/** Only fully verified caregivers */
export const requirePublishedCaregiver = async (req, res, next) => {
    const caregiver = await Caregiver.findOne({ userId: req.user.id });
    if (!caregiver || !isCaregiverBookable(caregiver)) {
        return errorResponse(
            res,
            403,
            "Complete verification and wait for admin approval before using this feature."
        );
    }
    req.caregiver = caregiver;
    next();
};
