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
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } }); // 100 MB limit

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

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── AUTH (existing) ──────────────────────────────────────────
app.post("/api/register",    register);
app.post("/api/login",       login);

// ── NEW: Admin role login (no JWT, simple username+password) ──
app.post("/api/admin-login", adminLogin);


// ── COMPLAINTS ───────────────────────────────────────────────
// PUBLIC — anyone can submit a complaint
app.post("/api/complaints",                upload.array("files", 10), addComplaint);
 
// PUBLIC — homepage shows approved/done complaints
app.get("/api/complaints/public",          getPublicComplaints);
 
// ADMIN — view all complaints (no token needed since we removed JWT for admins)
app.get("/api/complaints",                 getComplaints);
 
// ADMIN — update complaint status
app.patch("/api/complaints/:id/status",    updateStatus);
 
// ADMIN — delete a complaint
app.delete("/api/complaints/:id",          deleteComplaint);
 

 
// ADMIN/STAFF — add sub-entry to complaint
app.post("/api/complaints/:id/entries",    addEntry);
 
// ADMIN/STAFF — get entries for a complaint
app.get("/api/complaints/:id/entries",     getEntries);
 

// ── APPOINTMENTS ─────────────────────────────────────────────
// PUBLIC — anyone can book
app.post("/api/appointments",              upload.array("files", 10), addAppointment);

// ADMIN — view all appointments (no JWT since admin-login does not issue tokens)
app.get("/api/appointments", getAppointments);

// ADMIN — update appointment status
app.patch("/api/appointments/:id/status", updateAppointmentStatus);

// ── NOTICES ──────────────────────────────────────────────────
// PUBLIC + ADMIN — get all notices
app.get("/api/notices",           getNotices);

// ADMIN/STAFF — post a new notice  ← upload.array added here
app.post("/api/notices", upload.array("files", 4), addNotice);

// ADMIN/STAFF — delete a notice
app.delete("/api/notices/:id",    deleteNotice);


// ── STATS (dashboard counts) ─────────────────────────────────
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
// ── HEALTH CHECK ─────────────────────────────────────────────
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// ── START ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
