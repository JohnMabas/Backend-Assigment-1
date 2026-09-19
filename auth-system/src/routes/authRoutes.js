const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register - create a new account
router.post('/register', authController.register);

// POST /api/auth/login - exchange credentials for a JWT
router.post('/login', authController.login);

module.exports = router;