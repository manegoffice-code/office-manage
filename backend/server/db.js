// backend/server/db.js
// ⚠ REPLACE the old file — connects to MySQL (not in-memory arrays)

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host:               "localhost",
  port:               3306,
  database:           "mla_office",   // must match your MySQL database name
  user:               "root",          // your MySQL username
  password:           "BlPMYhGFoIAlIjDHZqounlVuZiGLWZBJ",  // ← CHANGE THIS to your MySQL root password
  waitForConnections: true,
  connectionLimit:    10,
});

// Test the connection on startup so you know immediately if credentials are wrong
pool.getConnection()
  .then(conn => {
    console.log("✅ MySQL connected successfully");
    conn.release();
  })
  .catch(err => {
    console.error("❌ MySQL connection failed:", err.message);
    console.error("👉 Check your password/database name in backend/server/db.js");
  });

module.exports = pool;
