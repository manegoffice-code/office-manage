const tenantFilter = (req, res, next) => {
  req.tenant_id = req.user.tenant_id;
  next();
};

module.exports = { tenantFilter };



//REAL COMPLAINT SYSTEM (TENANT SAFE)
const { pool } = require("./db");

const addComplaint = async (req, res) => {
  await pool.query(
    `INSERT INTO complaints (title, description, status, tenant_id)
     VALUES ($1, $2, $3, $4)`,
    [req.body.title, req.body.description, "pending", req.user.tenant_id]
  );

  res.json({ msg: "Complaint created" });
};

const getComplaints = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM complaints WHERE tenant_id = $1",
    [req.user.tenant_id]
  );

  res.json(result.rows);
};

module.exports = { addComplaint, getComplaints };


//ANALYTICS DASHBOARD API

const { pool } = require("./db");

const getStats = async (req, res) => {
  const complaints = await pool.query(
    "SELECT COUNT(*) FROM complaints WHERE tenant_id = $1",
    [req.user.tenant_id]
  );

  const appointments = await pool.query(
    "SELECT COUNT(*) FROM appointments WHERE tenant_id = $1",
    [req.user.tenant_id]
  );

  res.json({
    complaints: complaints.rows[0].count,
    appointments: appointments.rows[0].count
  });
};

module.exports = { getStats };


//CLOUD FILE STORAGE (READY FOR AWS)

const fs = require("fs");
const path = require("path");

const uploadFile = (req, res) => {
  const file = req.body.file;

  const filePath = path.join(__dirname, "storage", file.name);

  fs.writeFileSync(filePath, file.data);

  res.json({ msg: "File uploaded" });
};

module.exports = { uploadFile };

//FINAL SERVER ARCHITECTURE

const express = require("express");
const cors = require("cors");

const { verifyToken } = require("./auth");
const { tenantFilter } = require("./tenant");

const { addComplaint, getComplaints } = require("./complaints");
const { getStats } = require("./analytics");

const app = express();

app.use(cors());
app.use(express.json());

// PROTECTED + MULTI TENANT
app.use(verifyToken);
app.use(tenantFilter);

// CORE APIS
app.post("/complaints", addComplaint);
app.get("/complaints", getComplaints);
app.get("/stats", getStats);

app.listen(5000, () => console.log("🚀 SaaS Running"));

    