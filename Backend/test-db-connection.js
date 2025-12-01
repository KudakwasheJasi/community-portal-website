const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database!');
    const res = await client.query('SELECT current_database(), version()');
    console.log('Database Info:', res.rows[0]);
    client.release();
  } catch (err) {
    console.error('Database connection error:', err.message);
  } finally {
    await pool.end();
    process.exit();
  }
}

testConnection();
