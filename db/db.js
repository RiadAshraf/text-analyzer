const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a new pool instance
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

console.log(`Connected to database: ${process.env.DB_NAME || 'your_database'} and db user: ${process.env.DB_USER || 'your_user'}`);

// Export the pool instance for use in other files
module.exports = pool;