const express = require('express');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Parse incoming JSON request bodies (e.g. { name, email, ... })
app.use(express.json());

// A tiny hint so /, /api etc. do not feel dead
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Auth System API is running. See the README for endpoints.',
  });
});

// Mount the route groups
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

// 404 for any unknown route, then the central error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;