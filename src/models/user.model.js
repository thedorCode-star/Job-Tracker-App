// src/models/user.model.js

const pool = require('./db');
const bcrypt = require('bcrypt');

// Create a new user
async function createUser(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email', [email, hashedPassword]);
    return result.rows[0];
}

// Find a user by email
async function findUserByEmail(email) {
    const result = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
    return result.rows[0];
}

// Verify password
async function verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
    createUser,
    findUserByEmail,
    verifyPassword,
};