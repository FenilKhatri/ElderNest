export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error("ERROR:", err);

        // Only expose message for known operational errors (AppError)
        const isOperational = err?.isOperational === true;

        return res.status(err?.statusCode || 500).json({
            success: false,
            message: isOperational
                ? err.message
                : "Something went wrong. Please try again.",
        });
    });
};