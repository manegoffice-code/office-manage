// backend/server/appointments.js
// ⚠ REPLACE the old file completely

const pool = require("./db");

// POST /api/appointments — PUBLIC (no login needed, citizens book directly)
const addAppointment = async (req, res) => {
  try {
    const { full_name, mobile, area, purpose, date, time } = req.body;

    // Server-side validation
    if (!full_name || !mobile || !area || !purpose || !date || !time) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ error: "Mobile must be exactly 10 digits" });
    }

    const uploadedFiles = (req.files || []).map(f => f.filename).join(",");

    const [result] = await pool.query(
      `INSERT INTO appointments
         (full_name, mobile, area, purpose, appointment_date, appointment_time, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [full_name, mobile, area, purpose, date, time]
    );

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      id: result.insertId,
      files: uploadedFiles || null,
    });

  } catch (err) {
    console.error("❌ Appointment insert error:", err.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// GET /api/appointments — protected, admin/mla only
const getAppointments = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM appointments ORDER BY appointment_date ASC, appointment_time ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Appointments fetch error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// PATCH /api/appointments/:id/status — update appointment status (admin only)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ["Pending", "Confirmed", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    await pool.query("UPDATE appointments SET status = ? WHERE id = ?", [status, id]);
    res.json({ success: true, message: "Appointment status updated" });
  } catch (err) {
    console.error("❌ Appointment status update error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addAppointment, getAppointments, updateAppointmentStatus };