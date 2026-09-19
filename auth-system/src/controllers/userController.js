const usersStore = require('../data/users');

// Utility: strip the password hash before sending a user to the client.
function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

// ---------- GET /api/profile ----------
// Protected by the authenticate middleware (req.user is available).
// Looks the user up again in the users array so we always return
// up-to-date data and never anything from the (old) token.
function getProfile(req, res, next) {
  try {
    const user = usersStore.findUserById(req.user.id);

    // The user may have been removed from memory (e.g. server restart
    // while the client still holds an old token).
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile fetched successfully.',
      data: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
};