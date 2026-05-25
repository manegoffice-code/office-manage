// backend/server.js

const express = require("express");
const cors    = require("cors");
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");

// ── File upload setup (multer) ───────────────────────────────
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const safe = Date.now() + "_" + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, safe);
  },
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50 MB

const { register, login, adminLogin }           = require("./server/users");
const {
  addComplaint,
  getComplaints,
  getPublicComplaints,
  updateStatus,
  deleteComplaint,
  addEntry,
  getEntries,
}                                               = require("./server/complaints");
const { addAppointment, getAppointments, updateAppointmentStatus } = require("./server/appointments");
const { getNotices, addNotice, deleteNotice }   = require("./server/notices");
const { verifyToken }                           = require("./server/auth");
const { allowRoles }                            = require("./server/roles");

const app = express();

// ── CORS — allow Vercel frontend + localhost dev ─────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,          // e.g. https://your-app.vercel.app
  "http://localhost:5173",           // Vite dev server
  "http://localhost:3000",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, Railway health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── AUTH ─────────────────────────────────────────────────────
app.post("/api/register",    register);
app.post("/api/login",       login);
app.post("/api/admin-login", adminLogin);

// ── COMPLAINTS ───────────────────────────────────────────────
app.post("/api/complaints",             upload.array("files", 10), addComplaint);
app.get("/api/complaints/public",       getPublicComplaints);
app.get("/api/complaints",              getComplaints);
app.patch("/api/complaints/:id/status", updateStatus);
app.delete("/api/complaints/:id",       deleteComplaint);
app.post("/api/complaints/:id/entries", addEntry);
app.get("/api/complaints/:id/entries",  getEntries);

// ── APPOINTMENTS ─────────────────────────────────────────────
app.post("/api/appointments",              upload.array("files", 10), addAppointment);
app.get("/api/appointments",               getAppointments);
app.patch("/api/appointments/:id/status",  updateAppointmentStatus);

// ── NOTICES ──────────────────────────────────────────────────
app.get("/api/notices",        getNotices);
app.post("/api/notices",       upload.array("files", 4), addNotice);
app.delete("/api/notices/:id", deleteNotice);

// ── STATS ────────────────────────────────────────────────────
app.get("/api/stats", async (req, res) => {
  const pool = require("./server/db");
  try {
    const [[{complaints}]]   = await pool.query("SELECT COUNT(*) AS complaints FROM complaints");
    const [[{appointments}]] = await pool.query("SELECT COUNT(*) AS appointments FROM appointments");
    const [[{resolved}]]     = await pool.query("SELECT COUNT(*) AS resolved FROM complaints WHERE status IN ('Approved', 'Done')");
    const [[{areas}]]        = await pool.query("SELECT COUNT(DISTINCT area) AS areas FROM complaints");
    res.json({ complaints, appointments, resolved, areas });
  } catch (err) {
    console.error("❌ Stats error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ── Health check (Railway pings this) ────────────────────────
app.get("/health", (req, res) => res.json({ status: "ok" }));

// ── START ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
