export const ROLES = {
  USER: "user",
  ADMIN: "admin",
  CAREGIVER: "caregiver",
};

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

export const MESSAGES = {
  USER_CREATED: "User registered successfully!",
  CAREGIVER_CREATED: "Caregiver registered successfully!",
  LOGIN_SUCCESS: "Logged in successfully!",
  LOGOUT_SUCCESS: "Logged out successfully!",
  ALREADY_EXISTS: "Account already exists",
  INVALID_CREDENTIALS: "Invalid email or password!",
  UNAUTHORIZED: "Not authorized!",
  SUCCESS: "Success",
  NOT_FOUND: "not found!",
  SERVER_ERROR: "Internal Server Error!",
  ALL_FIELDS_REQUIRED: "All fields are required",
};

export const TOKEN_EXPIRY = {
  JWT: "7d",
  COOKIE: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export const BOOKING_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const SERVICE_TYPES = {
  NURSING: "nursing",
  ATTENDANT: "attendant",
  PHYSIOTHERAPY: "physiotherapy",
};