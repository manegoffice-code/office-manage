// backend/server/notices.js

const pool = require("./db");

// Auto-add media column if it doesn't exist yet (works on all MySQL versions)
(async () => {
  try {
    const [cols] = await pool.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME   = 'notices'
        AND COLUMN_NAME  = 'media'
    `);
    if (cols.length === 0) {
      await pool.query("ALTER TABLE notices ADD COLUMN media TEXT AFTER content");
      console.log("✅ notices.media column added");
    } else {
      console.log("✅ notices.media column already exists");
    }
  } catch (e) {
    console.warn("⚠️  Could not auto-add media column:", e.message);
  }
})();

// GET /api/notices — return all notices
const getNotices = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM notices ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Notices fetch error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/notices — add a new notice (supports file attachments via multer)
const addNotice = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const uploadedFiles = (req.files || []).map(f => f.filename).join(",");

    try {
      const [result] = await pool.query(
        "INSERT INTO notices (title, content, media) VALUES (?, ?, ?)",
        [title.trim(), (content || "").trim(), uploadedFiles || null]
      );
      return res.status(201).json({
        success: true,
        message: "Notice posted successfully",
        id: result.insertId,
      });
    } catch (colErr) {
      // media column still missing — insert without it
      console.warn("⚠️  Falling back to insert without media:", colErr.message);
      const [result] = await pool.query(
        "INSERT INTO notices (title, content) VALUES (?, ?)",
        [title.trim(), (content || "").trim()]
      );
      return res.status(201).json({
        success: true,
        message: "Notice posted successfully",
        id: result.insertId,
      });
    }
  } catch (err) {
    console.error("❌ Notice insert error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/notices/:id — remove a notice
const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM notices WHERE id = ?", [id]);
    res.json({ success: true, message: "Notice deleted" });
  } catch (err) {
    console.error("❌ Notice delete error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getNotices, addNotice, deleteNotice };