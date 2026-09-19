
function validateRegister({ name, email, password, role }) {
  if (typeof name !== 'string' || name.trim() === '') {
    return 'Name is required and must be a non-empty string.';
  }

  if (typeof email !== 'string' || email.trim() === '') {
    return 'Email is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Email format is invalid.';
  }

  if (typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }

  if (role !== 'user' && role !== 'admin') {
    return 'Role must be either "user" or "admin".';
  }

  return null;
}

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