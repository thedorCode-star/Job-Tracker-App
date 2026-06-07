const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobs.controller');
const authenticateToken = require('../middleware/auth.middleware');

// All job routes require authentication
router.use(authenticateToken);

// Get all jobs
router.get('/', jobsController.getJobs);

// Get a job by id
router.get('/:id', jobsController.getJobById);

// Create a new job
router.post('/', jobsController.createJob);

// Update a job
router.put('/:id', jobsController.updateJob);

// Delete a job
router.delete('/:id', jobsController.deleteJob);

module.exports = router;