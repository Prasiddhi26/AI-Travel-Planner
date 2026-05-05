// Central error handling middleware
// This function is called whenever next(error) is used in any route or controller

const errorHandler = (err, req, res, next) => {
  // Log error details for developers (only in development mode)
  if (process.env.NODE_ENV === "development") {
    console.error("Error Stack:", err.stack);
  }

  // Default status code: if the error already has a status code, use it
  // Otherwise fall back to 500 (Internal Server Error)
  let statusCode = err.statusCode || res.statusCode === 200 ? err.statusCode || 500 : res.statusCode;
  let message = err.message || "Something went wrong. Please try again.";

  // Handle Mongoose bad ObjectId error (e.g. /api/trips/not-a-valid-id)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found. Invalid ID format.";
  }

  // Handle Mongoose duplicate key error (e.g. registering with an existing email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue).join(", ");
    message = `Duplicate value entered for field: ${field}. Please use another value.`;
  }

  // Handle Mongoose validation errors (e.g. missing required fields)
  if (err.name === "ValidationError") {
    statusCode = 400;
    // Extract all validation error messages and join them
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(". ");
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please log in again.";
  }

  // Send a clean JSON error response to the client
  res.status(statusCode).json({
    success: false,
    message,
    // Include stack trace only in development (never expose in production)
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default  errorHandler;