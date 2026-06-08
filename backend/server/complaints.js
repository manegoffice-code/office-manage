// backend/server/complaints.js

const pool = require("./db");

// POST /api/complaints
const addComplaint = async (req, res) => {
try {

const {
  full_name,
  mobile,
  area,
  subject,
  details,
  complaint_date
} = req.body;

// Validation
if (
  !full_name ||
  !mobile ||
  !area ||
  !subject ||
  !details ||
  !complaint_date
) {
  return res.status(400).json({
    error: "All fields are required"
  });
}

// Mobile Validation
if (!/^\d{10}$/.test(mobile)) {
  return res.status(400).json({
    error: "Mobile must be exactly 10 digits"
  });
}

// Upload files
const uploadedFiles = (req.files || [])
  .map((f) => f.filename)
  .join(",");

// Date format fix
const formattedDate = new Date(complaint_date)
  .toISOString()
  .split("T")[0];

// Insert Query
const [result] = await pool.query(
  `INSERT INTO complaints (
    full_name,
    mobile,
    area,
    complaint_date,
    subject,
    details,
    images,
    voiceNote,
    status
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    full_name,
    mobile,
    area,
    formattedDate,
    subject,
    details,
    uploadedFiles || null,
    null,
    "Pending"
  ]
);

res.status(201).json({
  success: true,
  message: "Complaint submitted successfully",
  id: result.insertId
});

} catch (err) {

console.error("❌ Complaint insert error:", err.message);

res.status(500).json({
  error: "Server error"
});

}
};

// GET ALL COMPLAINTS
const getComplaints = async (req, res) => {
try {

const [rows] = await pool.query(
  `SELECT * FROM complaints ORDER BY created_at DESC`
);

res.json(rows);

} catch (err) {

console.error("❌ Complaints fetch error:", err.message);

res.status(500).json({
  error: "Server error"
});

}
};

// GET PUBLIC COMPLAINTS
const getPublicComplaints = async (req, res) => {
try {

const [rows] = await pool.query(
  `SELECT
    id,
    full_name,
    area,
    subject,
    status,
    complaint_date
  FROM complaints
  WHERE status IN ('Approved', 'Done')
  ORDER BY created_at DESC
  LIMIT 20`
);

res.json(rows);

} catch (err) {

console.error("❌ Public complaints fetch error:", err.message);

res.status(500).json({
  error: "Server error"
});

}
};

// UPDATE STATUS
const updateStatus = async (req, res) => {
try {

const { id } = req.params;
const { status } = req.body;

const allowed = ["Pending", "Approved", "Done"];

if (!allowed.includes(status)) {
  return res.status(400).json({
    error: "Invalid status"
  });
}

await pool.query(
  "UPDATE complaints SET status = ? WHERE id = ?",
  [status, id]
);

res.json({
  success: true,
  message: "Status updated"
});

} catch (err) {

console.error("❌ Status update error:", err.message);

res.status(500).json({
  error: "Server error"
});

}
};

// ADD ENTRY
const addEntry = async (req, res) => {
try {

const { id } = req.params;
const { entry_note, added_by } = req.body;

if (!entry_note || !entry_note.trim()) {
  return res.status(400).json({
    error: "Entry note is required"
  });
}

await pool.query(
  `INSERT INTO complaint_entries
  (complaint_id, entry_note, added_by)
  VALUES (?, ?, ?)`,
  [id, entry_note, added_by || "Staff"]
);

res.status(201).json({
  success: true,
  message: "Entry added"
});

} catch (err) {

console.error("❌ Entry insert error:", err.message);

res.status(500).json({
  error: "Server error"
});

}
};

// GET ENTRIES
const getEntries = async (req, res) => {
try {

const { id } = req.params;

const [rows] = await pool.query(
  `SELECT *
  FROM complaint_entries
  WHERE complaint_id = ?
  ORDER BY created_at ASC`,
  [id]
);

res.json(rows);

} catch (err) {

console.error("❌ Entries fetch error:", err.message);

res.status(500).json({
  error: "Server error"
});

}
};

// DELETE COMPLAINT
const deleteComplaint = async (req, res) => {
try {

const { id } = req.params;

await pool.query(
  "DELETE FROM complaint_entries WHERE complaint_id = ?",
  [id]
);

await pool.query(
  "DELETE FROM complaints WHERE id = ?",
  [id]
);

res.json({
  success: true,
  message: "Complaint deleted"
});

} catch (err) {

console.error("❌ Complaint delete error:", err.message);

res.status(500).json({
  error: "Server error"
});

}
};

module.exports = {
addComplaint,
getComplaints,
getPublicComplaints,
updateStatus,
deleteComplaint,
addEntry,
getEntries
};