const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const usersStore = require('../data/users');
const { validateRegister, validateLogin } = require('../validators/authValidator');


function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

// ---------- POST /api/auth/register ----------
async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body || {};

    const validationError = validateRegister({ name, email, password, role });
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (usersStore.findUserByEmail(normalizedEmail)) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered. Please log in instead.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //  Store user
    const user = usersStore.addUser({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
}

// ---------- POST /api/auth/login ----------
async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    const validationError = validateLogin({ email, password });
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = usersStore.findUserByEmail(normalizedEmail);

  
    const passwordMatches = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: sanitizeUser(user),
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
};