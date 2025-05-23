const User = require('../models/user');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
    try {
        console.log('Registration request body:', req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ 
                error: 'Validation failed',
                details: errors.array() 
            });
        }

        const { name, email, password, address, role } = req.body;
        console.log('Extracted user data:', { name, email, address, role });
        
        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            console.log('User already exists with email:', email);
            return res.status(400).json({ error: 'User already exists' });
        }

        // Validate role
        if (!['admin', 'store_owner', 'user'].includes(role)) {
            console.log('Invalid role:', role);
            return res.status(400).json({ error: 'Invalid role selected' });
        }

        // Create new user with provided role
        console.log('Attempting to create new user with role:', role);
        const user = await User.create({
            name,
            email,
            password,
            address,
            role
        });

        console.log('User created successfully:', user);
        const token = User.generateToken(user);
        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Registration error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({ 
            error: 'Server error',
            details: error.message 
        });
    }
};

const login = async (req, res) => {
    try {
        console.log('Login attempt with email:', req.body.email);
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            console.log('User not found with email:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Validate password
        console.log('Validating password for user:', user.id);
        const isValidPassword = await User.validatePassword(password, user.password);
        if (!isValidPassword) {
            console.log('Invalid password for user:', user.id);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('Login successful for user:', user.id);
        const token = User.generateToken(user);
        res.json({ 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            }, 
            token 
        });
    } catch (error) {
        console.error('Login error:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({ 
            error: 'Server error',
            details: error.message 
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        // Validate current password
        const isValidPassword = await User.validatePassword(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Update password
        await User.updatePassword(user.id, newPassword);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    register,
    login,
    updatePassword
}; 