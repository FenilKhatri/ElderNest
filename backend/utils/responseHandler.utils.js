export const successResponse = (res, statusCode, message, token = null, data = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        token,
        data,
    });
};

export const errorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};