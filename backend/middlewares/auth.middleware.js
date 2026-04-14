import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.handler.js";

export const protect = (req, res, next) => {
    try {
        let token = req?.cookies?.token;

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
