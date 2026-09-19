const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config/env');

// authenticate: makes sure the request carries a valid JWT before it
// is allowed to reach a protected route.
//
// Expected header format: Authorization: Bearer <token>
function authenticate(req, res, next) {
  // 1. Read the Authorization header
  const authHeader = req.headers.authorization;

  // 2. It must start with "Bearer " and contain a token after it
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Missing or malformed Authorization header. Use: Bearer <token>',
    });
  }

  // 3. Extract just the token part (everything after "Bearer ")
  const token = authHeader.split(' ')[1];

  // 4. Verify the token. Anything wrong lands in the catch block.
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verification succeeded: attach the payload to the request so the
    // next middleware/controller can use req.user (id, email, role).
    req.user = decoded;
    next();
  } catch (err) {
    // Distinguish an expired token from any other invalid token
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
}

module.exports = authenticate;