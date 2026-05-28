export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error("ERROR:", err);

        const isOperational = err?.isOperational === true;
        let message = err.message || "Something went wrong. Please try again.";
        let errors = null;
        
        // Handle Mongoose Validation Error
        if (err.name === 'ValidationError') {
            message = "Validation failed";
            errors = Object.keys(err.errors).reduce((acc, key) => {
                acc[key] = err.errors[key].message;
                return acc;
            }, {});
        } else if (!isOperational && process.env.NODE_ENV === 'production') {
            message = "Something went wrong. Please try again.";
        }

        return res.status(err?.statusCode || (err.name === 'ValidationError' ? 400 : 500)).json({
            success: false,
            message,
            errors,
            error: process.env.NODE_ENV !== 'production' ? err : undefined
        });
    });
};