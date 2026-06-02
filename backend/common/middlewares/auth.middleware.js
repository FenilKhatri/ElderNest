import jwt from "jsonwebtoken";
import User from "../../modules/user/user.model.js";
import { errorResponse } from "../utils/responseHandler.utils.js";
import { asyncHandler } from "./async.helper.js";

export const protect = asyncHandler(async (req, res, next) => {
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

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return errorResponse(res, 401, "Invalid token structure");
    }
  } catch (error) {
    return errorResponse(res, 401, "Invalid or expired token");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return errorResponse(res, 401, "User not found");
  }

  req.user = {
    id: user._id,
    name: user.name,
    role: user.role,
    isApproved: user.isApproved,
    status: user.status,
  };

  next();
});
