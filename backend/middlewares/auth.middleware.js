import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorResponse } from "../utils/responseHandler.utils.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req?.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return errorResponse(res, 401, "Not authorized, no token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return errorResponse(res, 401, "Invalid token");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 401, "User not found");
    }

    req.user = {
      id: user._id,
      role: user.role,
      isApproved: user.isApproved,
      status: user.status,
    };

    console.log("USER AUTH:", req.user);

    next();
  } catch (error) {
    return errorResponse(res, 401, "Not authorized, token failed");
  }
};
