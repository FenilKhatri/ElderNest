import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import { MESSAGES, STATUS_CODES } from "../utils/constants.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) token = req.headers.authorization.split(" ")[1];
  if (!token && req.cookies?.token) token = req.cookies.token;
  if (!token) return next(new AppError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError(`User ${MESSAGES.NOT_FOUND}`, STATUS_CODES.NOT_FOUND));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
