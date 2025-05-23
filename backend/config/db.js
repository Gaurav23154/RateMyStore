const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ratemystore',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

// Add error handling for the pool
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Test the connection
pool.connect()
    .then(client => {
        console.log('Successfully connected to PostgreSQL database');
        client.release();
    })
    .catch(err => {
        console.error('Error connecting to PostgreSQL database:', {
            message: err.message,
            code: err.code,
            detail: err.detail
        });
    });

module.exports = { pool }; 