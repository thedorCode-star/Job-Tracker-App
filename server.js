// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Import routes (We'll create these next)
const authRoutes = require('./src/routes/auth.routes')
const jobRoutes = require('./src/routes/job.routes')

// Middleware
app.use(cors());
app.use(express.json()); // allows us to receive JSON in requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Job Tracker API is running' });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Health check at http://localhost:${port}/health`);
});