// backend/server/auth.js
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "ULTRA_SECRET_KEY";

const generateToken = (user) => {
  return jwt.sign(
    {
      id:        user.id,
      role:      user.role,
      tenant_id: user.tenant_id,
    },
    SECRET,
    { expiresIn: "1d" }
  );
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Unauthorized" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = { generateToken, verifyToken };
