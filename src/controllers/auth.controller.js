const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

// Register a new user
async function register(req, res){
    try {
        const { email, password } = req.body;

        // Validate input
        if(!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }
        if(password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
        }

        // Check if user already exists
        const existingUser = await userModel.findUserByEmail(email);
        if(existingUser) {
            return res.status(409).json({ error: 'User already exists.' });
        }

        // Create new user
        const newUser = await userModel.createUser(email, password);

        // Generate JWT token
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Return success response
        return res.status(201).json({ message: 'User registered successfully.', token ,
            user: {
                id: newUser.id,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error('❌ Error registering user:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

async function login(req, res){
    try {
        const { email, password } = req.body;

        // Validate input
        if(!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Check if user exists
        const user = await userModel.findUserByEmail(email);
        if(!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Verify password
        const isPasswordValid = await userModel.verifyPassword(password, user.password_hash);
        if(!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        // Return success response
        return res.status(200).json({ message: 'Login successful.', token ,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('❌ Error logging in:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

module.exports = {
    register,
    login,
};