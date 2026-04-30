export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error("ERROR:", err);

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Something went wrong!",
        });
    });
};