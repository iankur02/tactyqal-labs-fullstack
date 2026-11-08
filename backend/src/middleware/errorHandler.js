const env = require('../config/env');

// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.isOperational ? err.message : 'Internal server error';

  // Multer upload errors
  if (err.name === 'MulterError') {
    statusCode = 400;
    err.isOperational = true;
    if (err.code === 'LIMIT_FILE_SIZE') message = 'File is too large (max 5MB)';
    else if (err.code === 'LIMIT_UNEXPECTED_FILE') message = 'Unexpected file field';
    else if (err.code === 'LIMIT_FILE_COUNT') message = 'Too many files';
    else message = err.message;
  }

  // Mongoose errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for ${field}`;
  }

  // Only log problems that indicate the server misbehaved:
  //   * 5xx responses (something actually broke)
  //   * non-operational errors (bugs — always worth knowing about)
  // Expected 4xx responses (401, 403, 404, 422, 409, 400) are normal
  // control flow. Logging them spams tests and local dev consoles.
  const isServerError = statusCode >= 500;
  const isProgrammingError = !err.isOperational;
  if (env.NODE_ENV !== 'production' && (isServerError || isProgrammingError)) {
    console.error('[Error]', err);
  }

  // Never leak stack traces into responses. If you need to debug, the
  // server-side console.error above (for 5xx) is the source of truth.
  res.status(statusCode).json({
    success: false,
    message,
  });
};