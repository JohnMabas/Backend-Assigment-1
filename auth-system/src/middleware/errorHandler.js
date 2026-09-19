// notFound: catch-all for routes that do not exist.
// Must be registered AFTER all other routes.
function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

// errorHandler: the single place that turns thrown errors into a clean
// JSON response. The stack trace is never leaked to the client.
// Must be registered AFTER all other middleware.
function errorHandler(err, req, res, next) {
  // next is required to keep Express happy (4-arg signature)

  // Log the full error + stack on the server side (helpful while developing)
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = {
  notFound,
  errorHandler,
};