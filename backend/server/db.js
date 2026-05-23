const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "mysql.railway.internal",
  user: "root",
  password: "BlPMYhGFoIAlIjDHZqounlVuZiGLWZBJ",
  database: "mla_office",
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
