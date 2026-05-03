export const successResponse = (res, statusCode, message, data = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const errorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};