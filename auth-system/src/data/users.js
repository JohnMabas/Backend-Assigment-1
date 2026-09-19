// In-memory user store.
// NOTE: Users disappear as soon as the server restarts.
// This is intentional for this learning project (no database is used).

// Each stored user looks like:
// { id: number, name: string, email: string, password: string (hashed), role: string }
const users = [];

// Simple counter that gives every new user a unique id
let nextId = 1;

// Add a new user to the array and return it (with the assigned id)
function addUser({ name, email, password, role }) {
  const user = { id: nextId++, name, email, password, role };
  users.push(user);
  return user;
}

// Find a user by their email address
function findUserByEmail(email) {
  return users.find((user) => user.email === email);
}

// Find a user by their numeric id
function findUserById(id) {
  return users.find((user) => user.id === id);
}

// Get all users (used, for example, to count registered users)
function getAllUsers() {
  return users;
}

module.exports = {
  addUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
};