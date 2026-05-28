require("dotenv").config();

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Railway MySQL Connected Successfully");
    connection.release();
  } catch (err) {
    console.error("❌ Database Connection Failed:", err.message);
  }
})();

module.exports = pool;
