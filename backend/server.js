require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

// Middleware
app.use(cors({
  // Reflect the request origin to avoid mismatches (helps local dev on different ports)
  origin: true,
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Login App API is running.' });
});

// POST /login — Validate credentials
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate request body
  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required.',
    });
  }

  // Check credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.status(200).json({
      message: 'Login successful.',
      username,
    });
  }

  // Invalid credentials
  return res.status(401).json({
    message: 'Invalid username or password. Please try again.',
  });
});

// Start server with EADDRINUSE handling (retries on next ports)
function startServer(port, retries = 5) {
  const server = app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      if (retries > 0) {
        const nextPort = Number(port) + 1;
        console.warn(`Port ${port} in use, trying ${nextPort}...`);
        // Give a short delay before retrying
        setTimeout(() => startServer(nextPort, retries - 1), 200);
      } else {
        console.error(`Port ${port} in use and no retries left. Exiting.`);
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

startServer(PORT, 10);
