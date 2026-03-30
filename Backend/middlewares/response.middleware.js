import { MESSAGES, STATUS_CODES } from "../utils/constants.js";

const sendResponse = ({
    res,
    statusCode = STATUS_CODES.SUCCESS,
    success = true,
    message = MESSAGES.SUCCESS,
    data = null,
    meta = null,
}) => {
    res.status(statusCode).json({
        success,
        message,
        data,
        ...(meta && { meta }),
    });
};

export default sendResponse;