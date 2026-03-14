/**
 * STANDARDIZED API RESPONSE UTILITIES
 * Ensures consistent response format across all API endpoints
 */

/**
 * Success Response Format
 */
export const successResponse = (
  data,
  message = "Success",
  statusCode = 200,
  extra = {}
) => {
  return {
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
    ...extra,
  };
};

/**
 * Error Response Format
 */
export const errorResponse = (
  message = "An error occurred",
  statusCode = 500,
  errors = null,
  extra = {}
) => {
  return {
    success: false,
    statusCode,
    message,
    errors,
    timestamp: new Date().toISOString(),
    ...extra,
  };
};

/**
 * Validation Error Response
 */
export const validationError = (errors, message = "Validation failed") => {
  return {
    success: false,
    statusCode: 400,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Authentication Error Response
 */
export const authError = (message = "Unauthorized", statusCode = 401) => {
  return {
    success: false,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Pagination Response
 */
export const paginatedResponse = (
  data,
  page,
  limit,
  total,
  message = "Success"
) => {
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    statusCode: 200,
    message,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    timestamp: new Date().toISOString(),
  };
};

/**
 * Send Response to Client
 */
export const sendResponse = (res, statusCode, data) => {
  res.status(statusCode).json(data);
};

/**
 * Wrap API Handler with Error Handling
 */
export const apiHandler = async (req, res, handler) => {
  try {
    await handler(req, res);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message =
      error.message ||
      "An unexpected error occurred. Please try again later.";

    sendResponse(res, statusCode, errorResponse(message, statusCode));
  }
};

/**
 * Create Custom Error Class
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Common HTTP Errors
 */
export const httpErrors = {
  badRequest: (message = "Bad Request", errors = null) =>
    new ApiError(message, 400, errors),

  unauthorized: (message = "Unauthorized") => new ApiError(message, 401),

  forbidden: (message = "Forbidden") => new ApiError(message, 403),

  notFound: (message = "Resource not found") => new ApiError(message, 404),

  conflict: (message = "Conflict") => new ApiError(message, 409),

  unprocessable: (message = "Unprocessable Entity", errors = null) =>
    new ApiError(message, 422, errors),

  serverError: (message = "Internal Server Error") =>
    new ApiError(message, 500),

  serviceUnavailable: (message = "Service Unavailable") =>
    new ApiError(message, 503),
};

/**
 * Response Middleware for Next.js API Routes
 * Usage:
 * export default withErrorHandler(handler)
 */
export const withErrorHandler = (handler) => {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(
          errorResponse(error.message, error.statusCode, error.errors)
        );
      }

      return res.status(500).json(
        errorResponse("Internal Server Error", 500)
      );
    }
  };
};

/**
 * Format Database Errors
 */
export const formatDbError = (error) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return `${field} already exists`;
  }

  if (error.name === "ValidationError") {
    const errors = Object.entries(error.errors).reduce((acc, [key, val]) => {
      acc[key] = val.message;
      return acc;
    }, {});
    return errors;
  }

  return error.message;
};

/**
 * Parse and Format Mongoose Validation Errors
 */
export const getValidationErrors = (error) => {
  const errors = {};

  if (error.errors) {
    for (const field in error.errors) {
      errors[field] = error.errors[field].message;
    }
  }

  return errors;
};
