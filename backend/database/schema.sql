-- ============================================================
<<<<<<< HEAD
-- Run this ENTIRE block in MySQL Workbench
=======
 HEAD
-- Run this ENTIRE block in Railway MySQL or MySQL Workbench
=======
-- Run this ENTIRE block in MySQL Workbench
>>>>>>> 3d0f566a6d5550f072f47006d0b50a06afea0d21
>>>>>>> 4e07937c357e004173dd628fbba3257e2aafaa50
-- ============================================================

CREATE DATABASE IF NOT EXISTS mla_office;
USE mla_office;

<<<<<<< HEAD
-- EXISTING TABLES (unchanged) ----------------------------------

=======
 HEAD
-- Users (legacy, kept for compatibility)
=======
-- EXISTING TABLES (unchanged) ----------------------------------

>>>>>>> 3d0f566a6d5550f072f47006d0b50a06afea0d21
>>>>>>> 4e07937c357e004173dd628fbba3257e2aafaa50
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100),
  email      VARCHAR(100) UNIQUE,
  password   TEXT,
  role       VARCHAR(20),
  tenant_id  INT
);

CREATE TABLE IF NOT EXISTS tenants (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(100),
  state VARCHAR(100)
);

<<<<<<< HEAD
=======
 HEAD
-- ✅ FIX: Added `files` column that was missing from original schema
=======
>>>>>>> 3d0f566a6d5550f072f47006d0b50a06afea0d21
>>>>>>> 4e07937c357e004173dd628fbba3257e2aafaa50
CREATE TABLE IF NOT EXISTS complaints (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  full_name       VARCHAR(100)  NOT NULL,
  mobile          VARCHAR(10)   NOT NULL,
  area            VARCHAR(200)  NOT NULL,
  subject         TEXT          NOT NULL,
  details         TEXT          NOT NULL,
  complaint_date  DATE          NOT NULL,
  status          VARCHAR(50)   DEFAULT 'Pending',
<<<<<<< HEAD
=======
 HEAD
  files           TEXT          NULL,
=======
>>>>>>> 3d0f566a6d5550f072f47006d0b50a06afea0d21
>>>>>>> 4e07937c357e004173dd628fbba3257e2aafaa50
  created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  full_name         VARCHAR(100)  NOT NULL,
  mobile            VARCHAR(10)   NOT NULL,
  area              VARCHAR(200)  NOT NULL,
  purpose           TEXT          NOT NULL,
  appointment_date  DATE          NOT NULL,
  appointment_time  VARCHAR(20)   NOT NULL,
  status            VARCHAR(50)   DEFAULT 'Pending',
  created_at        DATETIME      DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notices (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  title      TEXT,
  content    TEXT,
<<<<<<< HEAD
  media      TEXT,         -- ← new: comma-separated uploaded filenames
=======
 HEAD
  media      TEXT,
=======
  media      TEXT,         -- ← new: comma-separated uploaded filenames
>>>>>>> 3d0f566a6d5550f072f47006d0b50a06afea0d21
>>>>>>> 4e07937c357e004173dd628fbba3257e2aafaa50
  tenant_id  INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

<<<<<<< HEAD
-- NEW TABLES ---------------------------------------------------

-- Admin users for role-based login (no JWT, simple username/password)
=======
 HEAD
=======
-- NEW TABLES ---------------------------------------------------

-- Admin users for role-based login (no JWT, simple username/password)
>>>>>>> 3d0f566a6d5550f072f47006d0b50a06afea0d21
>>>>>>> 4e07937c357e004173dd628fbba3257e2aafaa50
CREATE TABLE IF NOT EXISTS admin_users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('main_admin', 'staff_admin') NOT NULL DEFAULT 'staff_admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

<<<<<<< HEAD
-- Sub-complaint entries linked to a parent complaint
=======
 HEAD
=======
-- Sub-complaint entries linked to a parent complaint
>>>>>>> 3d0f566a6d5550f072f47006d0b50a06afea0d21
>>>>>>> 4e07937c357e004173dd628fbba3257e2aafaa50
CREATE TABLE IF NOT EXISTS complaint_entries (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  entry_note   TEXT NOT NULL,
  added_by     VARCHAR(100),
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

<<<<<<< HEAD
=======
 HEAD
-- Seed default admin accounts
INSERT IGNORE INTO admin_users (username, password, role) VALUES
  ('admin', 'admin@123', 'main_admin'),
  ('staff', 'staff@123', 'staff_admin');

-- ✅ Safe migration: add `files` column if upgrading existing DB
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS files TEXT NULL;
=======
>>>>>>> 4e07937c357e004173dd628fbba3257e2aafaa50
-- Seed default admin accounts (plain text passwords for simplicity)
-- main_admin: username=admin, password=admin@123
-- staff_admin: username=staff, password=staff@123
INSERT IGNORE INTO admin_users (username, password, role) VALUES
  ('admin', 'admin@123', 'main_admin'),
  ('staff', 'staff@123', 'staff_admin');
<<<<<<< HEAD
=======
>>>>>>> 3d0f566a6d5550f072f47006d0b50a06afea0d21
>>>>>>> 4e07937c357e004173dd628fbba3257e2aafaa50
