import { MESSAGES, STATUS_CODES } from "../utils/constants";

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || STATUS_CODES.SERVER_ERROR;
    let message = err.message || MESSAGES.SERVER_ERROR;

    // zod error
    if(err.name === "ZodError") {
        statusCode = STATUS_CODES.BAD_REQUEST;
        message = err.issues?.map((e) => e.message).join(", ");
    };

    // mongodb cast error objectid
    if (err.name === "CastError") {
        statusCode = STATUS_CODES.BAD_REQUEST;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // duplicate key error
    if (err.code === 11000) {
        statusCode = STATUS_CODES.BAD_REQUEST;
        const field = Object.keys(err.keyValue).join(", ");
        message = `Duplicate value for field: ${field}`;
    }

    // jwt error
    if(err.name === "JsonWebTokenError") {
        statusCode = STATUS_CODES.UNAUTHORIZED;
        message = "Invalid token";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = STATUS_CODES.UNAUTHORIZED;
        message = "Token expired";
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && {
            error: err,
            stack: err.stack,
        }),
    });
}

export default errorHandler;