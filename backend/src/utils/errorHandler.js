export const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({ success: false, message });
};
