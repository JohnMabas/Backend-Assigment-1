// validateRegister: returns the FIRST validation error message for the
// registration payload, or null if everything is fine.
//
// Rules:
//   - name  : non-empty string
//   - email : looks like a valid email
//   - password : at least 6 characters
//   - role  : exactly "user" or "admin"
function validateRegister({ name, email, password, role }) {
  // --- name ---
  if (typeof name !== 'string' || name.trim() === '') {
    return 'Name is required and must be a non-empty string.';
  }

  // --- email ---
  if (typeof email !== 'string' || email.trim() === '') {
    return 'Email is required.';
  }
  // Simple but practical regex for a valid email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Email format is invalid.';
  }

  // --- password ---
  if (typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }

  // --- role ---
  if (role !== 'user' && role !== 'admin') {
    return 'Role must be either "user" or "admin".';
  }

  // Everything passed
  return null;
}

// validateLogin: returns the FIRST validation error message for the
// login payload, or null if everything is fine.
function validateLogin({ email, password }) {
  if (!email || email.trim() === '') {
    return 'Email is required.';
  }
  if (!password || password.trim() === '') {
    return 'Password is required.';
  }
  return null;
}

module.exports = {
  validateRegister,
  validateLogin,
};