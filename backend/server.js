// ================================================================
// LETTER TRACKING SYSTEM - Backend Server
// File: backend/letter_server.js
// Add these routes to your existing server.js OR run as standalone
// ================================================================

const express = require("express");
const cors    = require("cors");
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");

// ── File upload setup ────────────────────────────────────────────
const uploadDir = path.join(__dirname, "uploads/letters");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const safe = Date.now() + "_" + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, safe);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|png|jpg|jpeg|gif|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error("Only PDF and images are allowed"));
  },
});

const letterRoutes = require("./server/letters");
const deskRoutes   = require("./server/desks");

// ── If running standalone ───────────────────────────────────────
if (require.main === module) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/uploads/letters", express.static(uploadDir));

  app.use("/api/letters", (req, res, next) => { req.upload = upload; next(); }, letterRoutes);
  app.use("/api/desks",   deskRoutes);

  app.listen(5001, () => console.log("✅ Letter server running on http://localhost:5001"));
}

// ── Export for integration into existing server.js ──────────────
module.exports = { letterRoutes, deskRoutes, upload, uploadDir };