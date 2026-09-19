
const users = [];

let nextId = 1;

function addUser({ name, email, password, role }) {
  const user = { id: nextId++, name, email, password, role };
  users.push(user);
  return user;
}

function findUserByEmail(email) {
  return users.find((user) => user.email === email);
}

function findUserById(id) {
  return users.find((user) => user.id === id);
}

function getAllUsers() {
  return users;
}

module.exports = {
  addUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
};