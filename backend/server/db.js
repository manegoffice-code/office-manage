// backend/server/db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host:     process.env.MYSQLHOST     || process.env.DB_HOST     || "mysql.railway.internal",
  port:     parseInt(process.env.MYSQLPORT || process.env.DB_PORT || "3306"),
  user:     process.env.MYSQLUSER     || process.env.DB_USER     || "root",
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
  database: process.env.MYSQLDATABASE || process.env.DB_NAME     || "mla_office",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then((connection) => {
    console.log("✅ MySQL Connected Successfully");
    connection.release();
  })
  .catch((err) => {
    console.log("❌ Database Connection Failed:", err.message);
  });

module.exports = pool;
