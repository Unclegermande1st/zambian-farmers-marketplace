// server.js

const app = require('./app'); // This will use firebaseAdmin via the auth routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Visit: http://localhost:${PORT}`);
});

