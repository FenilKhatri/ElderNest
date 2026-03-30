import { MESSAGES, STATUS_CODES } from "../utils/constants.js";

export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    // All fields verifications
    const allEmpty = Object.values(req.body).every(
        (value) => value === "" || value === undefined || value === null
    );
    if (allEmpty) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: MESSAGES.ALL_FIELDS_REQUIRED,
        });
    }

    if(!result.success) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: result.error?.issues?.[0].message || "Validation Error",
        });
    }

    req.body = result.data;
    next();
};