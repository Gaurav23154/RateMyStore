const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

async function setupDatabase() {
    try {
        // Create database if it doesn't exist
        await pool.query('CREATE DATABASE ratemystore');
        console.log('Database created successfully');
    } catch (error) {
        if (error.code === '42P04') {
            console.log('Database already exists');
        } else {
            console.error('Error creating database:', error);
            process.exit(1);
        }
    }

    // Connect to the new database
    pool.end();
    const dbPool = new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: 'ratemystore',
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    });

    try {
        // Read and execute the initialization script
        const initScript = fs.readFileSync(path.join(__dirname, 'db', 'init.sql'), 'utf8');
        await dbPool.query(initScript);
        console.log('Database tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
        process.exit(1);
    } finally {
        await dbPool.end();
    }
}

setupDatabase(); 