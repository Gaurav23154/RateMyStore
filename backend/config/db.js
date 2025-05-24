const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Parse the connection string if it exists
let dbConfig = {};
if (process.env.DATABASE_URL) {
    // If using connection string
    dbConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    };
} else {
    // If using individual parameters
    dbConfig = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
        ssl: {
            rejectUnauthorized: false
        }
    };
}

const pool = new Pool(dbConfig);

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