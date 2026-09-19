const express = require('express');

const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const userController = require('../controllers/userController');
const usersStore = require('../data/users');

const router = express.Router();

// GET /api/profile - any logged-in user can see their own profile
router.get('/profile', authenticate, userController.getProfile);

// GET /api/admin/dashboard - admins only (authenticate first, then authorize)
router.get('/admin/dashboard', authenticate, authorize('admin'), (req, res) => {
  const totalUsers = usersStore.getAllUsers().length;

  res.status(200).json({
    success: true,
    message: `Welcome to the admin dashboard, ${req.user.email}!`,
    data: {
      admin: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
      totalUsers,
    },
  });
});

module.exports = router;