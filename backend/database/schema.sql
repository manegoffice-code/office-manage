-- ============================================================
-- Run this ENTIRE block in Railway MySQL or MySQL Workbench
-- ============================================================

CREATE DATABASE IF NOT EXISTS mla_office;
USE mla_office;

-- Users (legacy, kept for compatibility)
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

-- ✅ FIX: Added `files` column that was missing from original schema
CREATE TABLE IF NOT EXISTS complaints (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  full_name       VARCHAR(100)  NOT NULL,
  mobile          VARCHAR(10)   NOT NULL,
  area            VARCHAR(200)  NOT NULL,
  subject         TEXT          NOT NULL,
  details         TEXT          NOT NULL,
  complaint_date  DATE          NOT NULL,
  status          VARCHAR(50)   DEFAULT 'Pending',
  files           TEXT          NULL,
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
  media      TEXT,
  tenant_id  INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('main_admin', 'staff_admin') NOT NULL DEFAULT 'staff_admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaint_entries (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  entry_note   TEXT NOT NULL,
  added_by     VARCHAR(100),
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

-- Seed default admin accounts
INSERT IGNORE INTO admin_users (username, password, role) VALUES
  ('admin', 'admin@123', 'main_admin'),
  ('staff', 'staff@123', 'staff_admin');

-- ✅ Safe migration: add `files` column if upgrading existing DB
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS files TEXT NULL;
