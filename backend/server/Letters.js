
// backend/server/letters.js

const pool = require("./db");

// Get all letters
const getLetters = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM letters ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ getLetters error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Add a new letter
const addLetter = async (req, res) => {
  const { title, content, recipient } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO letters (title, content, recipient, created_at) VALUES (?, ?, ?, NOW())",
      [title, content, recipient || null]
    );
    res.status(201).json({ id: result.insertId, message: "Letter added successfully" });
  } catch (err) {
    console.error("❌ addLetter error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a letter
const deleteLetter = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM letters WHERE id = ?", [id]);
    res.json({ message: "Letter deleted successfully" });
  } catch (err) {
    console.error("❌ deleteLetter error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getLetters, addLetter, deleteLetter };
