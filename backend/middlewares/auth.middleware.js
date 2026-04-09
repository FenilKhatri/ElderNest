import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/responseHandler.js";

export const protect = (req, res, next) => {
    try {
        let token;

        if (req.cookies?.token) {
            token = req.cookies.token;
        }

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return errorResponse(res, 401, "Not authorized, no token");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        return errorResponse(res, 401, "Not authorized, token failed");
    }
};
