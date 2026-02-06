const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Register
router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, login, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ login });
        if (existingUser) {
            return res.status(400).json({ error: 'Login already exists' });
        }
        
        // Create new user
        const user = new User({
            firstname,
            lastname,
            login,
            password
        });
        
        await user.save();
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed', message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        
        // Find user
        const user = await User.findOne({ login });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate token
        const token = jwt.sign(
            { userId: user._id, login: user.login },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed', message: error.message });
    }
});

module.exports = router;
