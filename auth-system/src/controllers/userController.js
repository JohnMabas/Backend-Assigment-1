const usersStore = require('../data/users');

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

// ---------- GET /api/profile ----------

function getProfile(req, res, next) {
  try {
    const user = usersStore.findUserById(req.user.id);

   
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