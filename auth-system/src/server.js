const app = require('./app');

const { PORT } = require('./config/env');

app.listen(PORT, () => {
  console.log(`Auth system server running on http://localhost:${PORT}`);
});