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
    
}
    
