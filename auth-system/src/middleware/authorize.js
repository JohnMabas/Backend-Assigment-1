// authorize(...allowedRoles) returns a middleware that only lets
// requests through when the logged-in user's role is one of allowedRoles.
//
// Example: authorize('admin')  -> only admins
// Example: authorize('user', 'admin') -> users AND admins
function authorize(...allowedRoles) {
  return (req, res, next) => {
    // authenticate must run before this, otherwise there is no req.user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in first.',
      });
    }

    // Not allowed -> 403 Forbidden
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: you need role "${allowedRoles.join('" or "')}" to access this resource.`,
      });
    }

    // Allowed -> continue to the route handler
    next();
  };
}

module.exports = authorize;