const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const usersStore = require('../data/users');
const { validateRegister, validateLogin } = require('../validators/authValidator');

// Utility: strip the password hash before sending a user to the client.
// Never expose the hash in any response.
function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

// ---------- POST /api/auth/register ----------
async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body || {};

    // 1. Validate input -> 400 on failure
    const validationError = validateRegister({ name, email, password, role });
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    // 3. Normalize email to lowercase (also before the duplicate check)
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Email must not already exist -> 409 Conflict (checked AFTER normalization)
    if (usersStore.findUserByEmail(normalizedEmail)) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered. Please log in instead.',
      });
    }

    // 4. Hash the password with 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Store the user
    const user = usersStore.addUser({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    // 6. Respond WITHOUT the password -> 201 Created
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

    // 1. Both fields are required -> 400
    const validationError = validateLogin({ email, password });
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    // 2. Find the user. Same generic message for "no user" and
    //    "wrong password" so we do not reveal which one was the problem.
    const normalizedEmail = email.trim().toLowerCase();
    const user = usersStore.findUserByEmail(normalizedEmail);

    // bcrypt.compare also returns false when the user does not exist,
    // so this single check covers both failure cases -> 401
    const passwordMatches = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // 3. Sign a JWT containing id, email and role
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 4. Return the token plus basic user info (no password)
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