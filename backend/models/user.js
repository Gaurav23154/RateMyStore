const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

class User {
    static async create({ name, email, password, address, role }) {
        try {
            console.log('Creating user with data:', { name, email, address, role });
            const hashedPassword = await bcrypt.hash(password, 10);
            const query = `
                INSERT INTO users (name, email, password, address, role)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, name, email, address, role
            `;
            const values = [name, email, hashedPassword, address, role];
            console.log('Executing query with values:', values);
            const result = await pool.query(query, values);
            console.log('User created successfully:', result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT id, name, email, address, role FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async updatePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const query = 'UPDATE users SET password = $1 WHERE id = $2 RETURNING id';
        const result = await pool.query(query, [hashedPassword, id]);
        return result.rows[0];
    }

    static async validatePassword(password, hashedPassword) {
        try {
            console.log('Comparing passwords...');
            const isValid = await bcrypt.compare(password, hashedPassword);
            console.log('Password validation result:', isValid);
            return isValid;
        } catch (error) {
            console.error('Error validating password:', error);
            throw error;
        }
    }

    static generateToken(user) {
        try {
            console.log('Generating token for user:', user.id);
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            console.log('Token generated successfully');
            return token;
        } catch (error) {
            console.error('Error generating token:', error);
            throw error;
        }
    }
}

module.exports = User; 