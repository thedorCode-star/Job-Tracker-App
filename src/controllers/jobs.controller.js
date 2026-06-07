const jobModel = require('../models/job.model');

// Get all jobs for a user
async function getJobs(req, res){
    try {
        const { status } = req.query;
        const filters = status ? { status } : {};
        const jobs = await jobModel.getJobsByUserId(req.userId, filters);
        return res.status(200).json({ jobs });
    } catch (error) {
        console.error('❌ Error getting jobs:', error);
        return res.status(500).json({ error: 'Failed to fetch jobs.' });
    }
}

// Get a job by id
async function getJobById(req, res){
    try {
        const jobId = parseInt(req.params.id);
        if(isNaN(jobId)) {
            return res.status(400).json({ error: 'Invalid job ID.' });
        }
        const job = await jobModel.getJobById(jobId, req.userId);
        if(!job) {
            return res.status(404).json({ error: 'Job not found.' });
        }
        return res.status(200).json({ job });
    } catch (error) {
        console.error('❌ Error getting job:', error);
        return res.status(500).json({ error: 'Failed to fetch job.' });
    }
}

// Create a new job
async function createJob(req, res){
    try {
        const { title, company, location, job_url, status, notes, applied_date } = req.body;

        // Validate input
        if(!title || !company) {
            return res.status(400).json({ error: 'Title and company are required.' });
        }

        // Create new job
        const newJob = await jobModel.createJob({ title, company, location, job_url, status: status || 'saved', notes, applied_date }, req.userId);
        return res.status(201).json({ message: 'Job created successfully.', job: newJob });
    } catch (error) {
        console.error('❌ Error creating job:', error);
        return res.status(500).json({ error: 'Failed to create job.' });
    }
}

// Update a job
async function updateJob(req, res){
    try {
        const jobId = parseInt(req.params.id);
        if(isNaN(jobId)) {
            return res.status(400).json({ error: 'Invalid job ID.' });
        }
        const { title, company, location, job_url, status, notes, applied_date } = req.body;
        const updatedJob = await jobModel.updateJob(jobId, req.userId, { title, company, location, job_url, status, notes, applied_date });
        return res.status(200).json({ message: 'Job updated successfully.', job: updatedJob });
    } catch (error) {
        console.error('❌ Error updating job:', error);
        return res.status(500).json({ error: 'Failed to update job.' });
    }
}

// Delete a job
async function deleteJob(req, res){
    try {
        const jobId = parseInt(req.params.id);
        if(isNaN(jobId)) {
            return res.status(400).json({ error: 'Invalid job ID.' });
        }
        const deletedJob = await jobModel.deleteJob(jobId, req.userId);
        return res.status(200).json({ message: 'Job deleted successfully.', job: deletedJob });
    } catch (error) {
        console.error('❌ Error deleting job:', error);
        return res.status(500).json({ error: 'Failed to delete job.' });
    }
}

module.exports = {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
};