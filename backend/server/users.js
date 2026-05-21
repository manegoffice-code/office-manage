// backend/server/users.js
// Replaces old in-memory version — uses MySQL admin_users table
// Simple username + password, no JWT, role stored in localStorage on frontend

const pool = require("./db");

// Keep old register/login exports so existing routes don't break
const register = (req, res) => {
  res.json({ msg: "Use /api/admin-login for role-based login" });
};

const login = (req, res) => {
  res.json({ msg: "Use /api/admin-login for role-based login" });
};

// NEW: Admin login — checks admin_users table
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM admin_users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = rows[0];

    res.json({
      success: true,
      user: {
        id:       user.id,
        username: user.username,
        role:     user.role,   // 'main_admin' or 'staff_admin'
      },
    });

  } catch (err) {
    console.error("❌ Admin login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { register, login, adminLogin };