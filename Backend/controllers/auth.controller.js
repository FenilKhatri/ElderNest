import sendResponse from "../middlewares/response.middleware.js";
import {
  loginUserService,
  registerUserService,
} from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/constants.js";

// Register Controller
const register = asyncHandler(async (req, res) => {
  const user = await registerUserService(req.body);

  sendResponse({
    res,
    statusCode: STATUS_CODES.CREATED,
    message: MESSAGES.USER_CREATED,
    data: user,
  });
});

// Login Controller
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await loginUserService({
    email,
    password,
  });

  const isProd = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };

  res.cookie("token", token, cookieOptions);

  sendResponse({
    res,
    statusCode: STATUS_CODES.SUCCESS,
    message: MESSAGES.LOGIN_SUCCESS,
    data: { token, user },
  });
});

// Logout controller
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });

  sendResponse({
    res,
    statusCode: STATUS_CODES.SUCCESS,
    message: MESSAGES.LOGOUT_SUCCESS,
  });
});

export { register, login, logout };
