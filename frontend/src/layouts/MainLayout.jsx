// frontend/src/layouts/MainLayout.jsx
// Uday Sangle — Premium Political Office Management System
// LOGIC: UNCHANGED. Only UI redesigned.

import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Navbar";

const PAGE_TITLES = {
  "/dashboard":    { title: "Dashboard",         sub: "Overview of your office activity" },
  "/complaints":   { title: "Complaints",        sub: "Manage and track all complaints" },
  "/appointments": { title: "Appointments",      sub: "Schedule and manage meetings" },
  "/notices":      { title: "Notices",           sub: "Post and manage public notices" },
  "/admin":        { title: "Admin Panel",       sub: "Full system control and management" },
};

function getUser() {
  try { const u = localStorage.getItem("admin_user"); return u ? JSON.parse(u) : null; }
  catch { return null; }
}

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const user     = getUser();
  const page     = PAGE_TITLES[location.pathname] || { title: "Office Portal", sub: "" };

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#F4F2EE",
      fontFamily: "'Poppins', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Design variables ── */
        :root {
          --navy:        #0D1B3E;
          --saffron:     #FF6B00;
          --saffron-mid: #FF8C38;
          --saffron-100: rgba(255,107,0,0.10);
          --gold:        #C8942A;
          --gold-lt:     #E8B84B;
          --white:       #FFFFFF;
          --bg:          #F4F2EE;
          --card:        #FFFFFF;
          --border:      rgba(200,148,42,0.14);
          --text:        #1A2545;
          --text-mid:    #4A5578;
          --muted:       #8A92A6;
          --warn-lt:     rgba(245,158,11,0.08);
          --success-lt:  rgba(16,185,129,0.08);
          --info-lt:     rgba(59,130,246,0.08);
          --r-sm:        8px;
          --r-md:        12px;
          --r-lg:        16px;
          --r-xl:        20px;
          --r-full:      9999px;
          --shadow-sm:   0 1px 8px rgba(13,27,62,0.06);
          --shadow-md:   0 4px 20px rgba(13,27,62,0.09);
          --shadow-lg:   0 8px 40px rgba(13,27,62,0.12);
          --shadow-saff: 0 4px 16px rgba(255,107,0,0.28);
        }

        /* ── Global resets ── */
        a { text-decoration: none; }
        input, select, textarea, button { font-family: 'Poppins', sans-serif; }

        /* ── Animations ── */
        @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
        @keyframes fadeUp    { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin      { to   { transform:rotate(360deg); } }
        @keyframes pulse-dot { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:0.5; transform:scale(0.7); } }

        .fade-in     { animation: fadeIn 0.35s ease both; }
        .fade-in-up  { animation: fadeUp 0.40s ease both; }
        .stagger     { animation-delay: 0.06s; }

        /* ── Cards ── */
        .card {
          background: var(--card);
          border-radius: var(--r-lg);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
          padding: 20px 22px;
          transition: box-shadow 0.2s ease;
        }
        .card:hover { box-shadow: var(--shadow-md); }

        /* ── Badges ── */
        .badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 11px; border-radius: var(--r-full);
          font-size: 11.5px; font-weight: 600; letter-spacing: 0.4px;
        }
        .badge-pending  { background: rgba(245,158,11,0.10); color: #B45309; border: 1px solid rgba(245,158,11,0.25); }
        .badge-approved { background: rgba(16,185,129,0.10); color: #065F46; border: 1px solid rgba(16,185,129,0.25); }
        .badge-done     { background: rgba(59,130,246,0.10); color: #1E40AF; border: 1px solid rgba(59,130,246,0.25); }
        .badge-dot      { width:5px; height:5px; border-radius:50%; display:inline-block; }
        .dot-pending    { background:#F59E0B; }
        .dot-approved   { background:#10B981; }
        .dot-done       { background:#3B82F6; }

        /* ── Form inputs ── */
        .input-f {
          padding: 10px 13px; border-radius: 10px;
          border: 1.5px solid var(--border);
          background: #FAFAF8; font-size: 13.5px;
          color: var(--text); outline: none;
          transition: all 0.18s ease; width: 100%;
        }
        .input-f:focus { border-color: var(--saffron); background: #fff; box-shadow: 0 0 0 3px rgba(255,107,0,0.08); }
        .input-f::placeholder { color: var(--muted); }

        /* ── Buttons ── */
        .btn-saff {
          padding: 10px 20px; border-radius: 10px;
          background: linear-gradient(135deg, var(--saffron), var(--gold));
          color: #fff; border: none; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.18s ease;
          box-shadow: var(--shadow-saff); white-space: nowrap;
        }
        .btn-saff:hover { transform: translateY(-1px); filter: brightness(1.06); }
        .btn-saff:active { transform: translateY(0); }

        /* ── Page header ── */
        .page-eyebrow {
          font-size: 10.5px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: var(--saffron); margin-bottom: 8px;
        }
        .page-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 3vw, 28px); font-weight: 700;
          color: var(--text); line-height: 1.2; margin-bottom: 6px;
        }
        .page-sub { font-size: 13.5px; color: var(--muted); }

        /* ── Responsive ── */
        @media (max-width:900px) {
          .main-content { margin-left: 0 !important; }
        }
        @media (max-width:640px) {
          .hide-sm { display: none !important; }
        }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: "fixed", inset: 0,
          background: "rgba(13,27,62,0.55)",
          zIndex: 199, backdropFilter: "blur(3px)",
        }} />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content" style={{
        marginLeft: 256, flex: 1,
        display: "flex", flexDirection: "column",
        minHeight: "100vh", transition: "margin 0.25s ease",
      }}>
        {/* ── Top Bar ── */}
        <header style={{
          height: 64, padding: "0 28px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          borderBottom: "1px solid rgba(200,148,42,0.12)",
          boxShadow: "0 1px 12px rgba(13,27,62,0.06)",
          position: "sticky", top: 0, zIndex: 100,
          gap: 16,
        }}>
          {/* Left: hamburger + page title */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                display: "none", background: "none", border: "none",
                color: "#8A92A6", cursor: "pointer", padding: 6, borderRadius: 8,
                alignItems: "center", justifyContent: "center",
              }}
              className="mobile-menu-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A2545", lineHeight: 1.2 }}>{page.title}</div>
              {page.sub && <div style={{ fontSize: 11, color: "#8A92A6", marginTop: 1 }}>{page.sub}</div>}
            </div>
          </div>

          {/* Right: search + user */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#F4F2EE", border: "1.5px solid rgba(200,148,42,0.15)",
              borderRadius: 10, padding: "8px 14px", minWidth: 200,
              transition: "all 0.2s",
            }}
              onFocusCapture={e => { e.currentTarget.style.borderColor = "#FF6B00"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,107,0,0.07)"; }}
              onBlurCapture={e => { e.currentTarget.style.borderColor = "rgba(200,148,42,0.15)"; e.currentTarget.style.background = "#F4F2EE"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8A92A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input placeholder="Search…" style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#1A2545", width: "100%" }} />
            </div>

            {/* Notification bell */}
            <button style={{
              width: 38, height: 38, borderRadius: 10,
              background: "#F4F2EE", border: "1.5px solid rgba(200,148,42,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#8A92A6", position: "relative",
              transition: "all 0.18s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,107,0,0.08)"; e.currentTarget.style.borderColor = "rgba(255,107,0,0.25)"; e.currentTarget.style.color = "#FF6B00"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#F4F2EE"; e.currentTarget.style.borderColor = "rgba(200,148,42,0.15)"; e.currentTarget.style.color = "#8A92A6"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <div style={{ position:"absolute", top:7, right:7, width:7, height:7, borderRadius:"50%", background:"#FF6B00", border:"1.5px solid #fff" }} />
            </button>

            {/* User avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: user?.role === "main_admin"
                  ? "linear-gradient(135deg,#C8942A,#E8B84B)"
                  : "linear-gradient(135deg,#2563EB,#60A5FA)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: "#fff",
                boxShadow: "0 2px 8px rgba(13,27,62,0.18)",
                border: "2px solid rgba(255,255,255,0.8)",
              }}>
                {user?.username?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="hide-sm">
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1A2545", lineHeight: 1.2 }}>{user?.username || "Admin"}</div>
                <div style={{ fontSize: 10, color: "#8A92A6" }}>{user?.role === "main_admin" ? "Main Admin" : "Staff Admin"}</div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main style={{ flex: 1, padding: "28px 32px", maxWidth: "100%", overflowX: "hidden" }}>
          <Outlet />
        </main>

        {/* ── Footer ── */}
        <footer style={{
          padding: "14px 32px",
          borderTop: "1px solid rgba(200,148,42,0.10)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 8,
          fontSize: 11, color: "#8A92A6",
          background: "#fff",
        }}>
          <span>© {new Date().getFullYear()} Uday Sangle · Office Management System</span>
          <span style={{ opacity: 0.6 }}>v2.0 · Secure Portal</span>
        </footer>
      </div>

      <style>{`
        @media (max-width:900px) {
          .mobile-menu-btn { display:flex!important; }
        }
      `}</style>
    </div>
  );
}