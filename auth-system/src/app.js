const express = require('express');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Auth System API is running. See the README for endpoints.',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;