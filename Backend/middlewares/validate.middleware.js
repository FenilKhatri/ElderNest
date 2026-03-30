export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if(!result.success) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: result.error.errors[0].message,
        });
    }

    req.body = result.data;
    next();
};