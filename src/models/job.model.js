const pool = require('./db');

// Get all jobs for a user
async function getJobsByUserId(userId, filters = {}) {
    let query = 'SELECT * FROM jobs WHERE user_id = $1';
    const values = [userId];
    let paramIndex = 2;

    // Add filters to query
    if (filters.status) {
        query += ` AND status = $${paramIndex}`;
        values.push(filters.status);
        paramIndex++;
    }

    // Execute query
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, values);
    return result.rows;
}

// Get a job by id
async function getJobById(jobId, userId){
    const result = await pool.query('SELECT * FROM jobs WHERE id = $1 AND user_id = $2', [jobId, userId]);
    return result.rows[0];
}

// create a new job
async function createJob(jobData, userId){
    const {title, company, location, job_url, status, notes, applied_date} = jobData;
    const result = await pool.query(`INSERT INTO jobs (user_id, title, company, location, job_url, status, notes, applied_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, title, company, location, job_url, status, notes, applied_date`, [userId, title, company, location, job_url, status, notes, applied_date]);
    return result.rows[0];
}

// Update a job
async function updateJob(jobId, userId, jobData) {
    const allowedFields = ['title', 'company', 'location', 'job_url', 'status', 'notes', 'applied_date'];
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    // Build set clause and values array
    for (const field of allowedFields) {
        if (jobData[field] !== undefined) {
            setClause.push(`${field} = $${paramIndex}`);
            values.push(jobData[field]);
            paramIndex++;
        }
    }
    if(setClause.length === 0) return null;

    values.push(jobId, userId);
    const query = `UPDATE jobs SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING id, title, company, location, job_url, status, notes, applied_date`;

    const result = await pool.query(query, values);
    return result.rows[0];
}

// Delete a job
async function deleteJob(jobId, userId) {
    const result = await pool.query('DELETE FROM jobs WHERE id = $1 AND user_id = $2 RETURNING id', [jobId, userId]);
    return result.rows[0];
}

module.exports = {
    getJobsByUserId,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
};
    
