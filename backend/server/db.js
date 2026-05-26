// db.js — Railway MySQL pool
// dotenv: loads .env for local dev; on Railway env vars are injected directly
try { require("dotenv").config(); } catch {}

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:     Number(process.env.DB_PORT) || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Railway MySQL Connected Successfully");
    connection.release();
  } catch (err) {
    console.error("❌ Database Connection Failed:", err.message);
    // Don't crash the process — let health check still respond
  }
})();

module.exports = pool;
