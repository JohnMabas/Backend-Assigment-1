// Load environment variables from the .env file into process.env
require('dotenv').config();

// Grab the port, defaulting to 3000 if it is not set
const PORT = process.env.PORT || 3000;

// Grab the JWT secret used to sign tokens
const JWT_SECRET = process.env.JWT_SECRET;

// Grab how long tokens stay valid, defaulting to 1 hour if not set
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// The JWT secret is critical for signing/verifying tokens.
// If it is missing, the whole app should refuse to start.
if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is missing.');
  console.error('Create a .env file based on .env.example and set a JWT_SECRET value.');
  process.exit(1);
}

module.exports = {
  PORT,
  JWT_SECRET,
  JWT_EXPIRES_IN,
};