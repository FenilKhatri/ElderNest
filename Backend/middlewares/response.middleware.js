import errorHandler from "./error.middleware";

export const sendResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const asyncHandler = (fn) => async (req, res) => {
    try {
        return await fn(req, res);
    } catch (error) {
        errorHandler(res, 500, "Internal Server Error!");
    };
};