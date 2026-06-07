// src/models/db.js

const { Pool } = require('pg');

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    })
  : new Pool({
      user: process.env.DB_USER || 'job_user',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'job_tracker',
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
    });

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
  } else {
    console.log('✅ Database connected successfully');
    release();
  }
});

module.exports = pool;
