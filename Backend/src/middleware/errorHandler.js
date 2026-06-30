class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function errorHandler(err, _req, res, _next) {
  console.error('[ERROR]', err.message || err);

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map(e => ({ field: e.path.join('.'), issue: e.message })),
    });
  }

  const status  = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ success: false, message });
}

module.exports = { AppError, errorHandler };