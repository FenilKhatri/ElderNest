export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error("ERROR:", err);
        if (err.stack) console.error(err.stack);

        const isOperational = err?.isOperational === true;
        // Check for nested Razorpay error descriptions
        let message = err.error?.description || err.message || "Something went wrong. Please try again.";
        let errors = null;
        
        if (err.name === 'ValidationError') {
            message = "Validation failed";
            errors = Object.keys(err.errors).reduce((acc, key) => {
                acc[key] = err.errors[key].message;
                return acc;
            }, {});
        } else if (!isOperational && process.env.NODE_ENV === 'production') {
            // Allow error messages to pass through for standard Error throws in services
            message = err.error?.description || err.message || "Something went wrong. Please try again.";
        }

        return res.status(err?.statusCode || (err.name === 'ValidationError' ? 400 : 500)).json({
            success: false,
            message,
            errors,
            errorName: err.name,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    });
};