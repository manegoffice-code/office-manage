// backend/server/complaints.js

const pool = require("./db");

// POST /api/complaints — PUBLIC (citizens submit, no login needed)
const addComplaint = async (req, res) => {
  try {
    const {
      full_name,
      mobile,
      area,
      subject,
      details,
<<<<<<< HEAD
      complaint_date,
    } = req.body;

    // ✅ FIX 1: was checking `!date` (undefined) — now correctly checks `!complaint_date`
    if (!full_name || !mobile || !area || !subject || !details || !complaint_date) {
=======
      complaint_date
    } = req.body;

    if (!full_name || !mobile || !area || !subject || !details || !date) {
>>>>>>> 3d0f566a6d5550f072f47006d0b50a06afea0d21
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ error: "Mobile must be exactly 10 digits" });
    }

    const uploadedFiles = (req.files || [])
      .map((f) => f.filename)
      .join(",");

<<<<<<< HEAD
    // ✅ FIX 2: removed duplicate `complaint` column, fixed INSERT column order
    // columns: full_name, mobile, area, subject, details, complaint_date, status, files
    const [result] = await pool.query(
      `INSERT INTO complaints 
      (full_name, mobile, area, subject, details, complaint_date, status, files)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
=======
    const [result] = await pool.query(
      `INSERT INTO complaints 
      (
        full_name,
        mobile,
        area,
        complaint,
        subject,
        details,
        complaint_date,
        status,
        files
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
>>>>>>> 3d0f566a6d5550f072f47006d0b50a06afea0d21
      [
        full_name,
        mobile,
        area,
<<<<<<< HEAD
        subject,
        details,
        complaint_date,
=======
        details,
        subject,
        details,
        complaint_date,,
>>>>>>> 3d0f566a6d5550f072f47006d0b50a06afea0d21
        "Pending",
        uploadedFiles || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      id: result.insertId,
    });

  } catch (err) {
    console.error("❌ Complaint insert error:", err);
<<<<<<< HEAD
    res.status(500).json({ error: err.message });
  }
};

// GET /api/complaints — returns all complaints (used by admin)
=======

    res.status(500).json({
      error: err.message,
    });
  }
};

// GET /api/complaints — returns all complaints (used by admin + public)
>>>>>>> 3d0f566a6d5550f072f47006d0b50a06afea0d21
const getComplaints = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM complaints ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Complaints fetch error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

<<<<<<< HEAD
// GET /api/complaints/public — PUBLIC, returns only Approved complaints
=======
// GET /api/complaints/public — PUBLIC, returns only Approved complaints for homepage
>>>>>>> 3d0f566a6d5550f072f47006d0b50a06afea0d21
const getPublicComplaints = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, full_name, area, subject, status, complaint_date
       FROM complaints
       WHERE status IN ('Approved', 'Done')
       ORDER BY created_at DESC
       LIMIT 20`
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Public complaints fetch error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// PATCH /api/complaints/:id/status — update status (main_admin only)
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["Pending", "Approved", "Done"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    await pool.query(
      "UPDATE complaints SET status = ? WHERE id = ?",
      [status, id]
    );

    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    console.error("❌ Status update error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/complaints/:id/entries — add sub-entry to complaint
const addEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { entry_note, added_by } = req.body;

    if (!entry_note || !entry_note.trim()) {
      return res.status(400).json({ error: "Entry note is required" });
    }

    await pool.query(
      "INSERT INTO complaint_entries (complaint_id, entry_note, added_by) VALUES (?, ?, ?)",
      [id, entry_note, added_by || "Staff"]
    );

    res.status(201).json({ success: true, message: "Entry added" });
  } catch (err) {
    console.error("❌ Entry insert error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/complaints/:id/entries — get all sub-entries for a complaint
const getEntries = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM complaint_entries WHERE complaint_id = ? ORDER BY created_at ASC",
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Entries fetch error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

<<<<<<< HEAD
=======

>>>>>>> 3d0f566a6d5550f072f47006d0b50a06afea0d21
// DELETE /api/complaints/:id
const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM complaint_entries WHERE complaint_id = ?", [id]);
    await pool.query("DELETE FROM complaints WHERE id = ?", [id]);
    res.json({ success: true, message: "Complaint deleted" });
  } catch (err) {
<<<<<<< HEAD
    console.error("❌ Complaint delete error:", err.message);
=======
    console.error("\u274c Complaint delete error:", err.message);
>>>>>>> 3d0f566a6d5550f072f47006d0b50a06afea0d21
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addComplaint,
  getComplaints,
  getPublicComplaints,
  updateStatus,
  deleteComplaint,
  addEntry,
  getEntries,
<<<<<<< HEAD
};
=======
};
>>>>>>> 3d0f566a6d5550f072f47006d0b50a06afea0d21
