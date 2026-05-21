// frontend/src/pages/Login.jsx
// udaysangle — Premium Political Office Management System
// Redesigned: Ultra-clean, enterprise-grade, saffron + navy + gold aesthetic

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

/* ─── Design tokens ─────────────────────────────────────────── */
const C = {
  navy:       "#0D1B3E",
  navyLight:  "#162347",
  navyGlass:  "rgba(13,27,62,0.92)",
  saffron:    "#FF6B00",
  saffronSoft:"#FF8C38",
  saffronGlow:"rgba(255,107,0,0.18)",
  gold:       "#C8942A",
  goldLight:  "#E8B84B",
  goldGlow:   "rgba(200,148,42,0.15)",
  white:      "#FFFFFF",
  offWhite:   "#F8F6F2",
  cream:      "#FDF9F3",
  border:     "rgba(200,148,42,0.25)",
  borderLight:"rgba(255,255,255,0.10)",
  muted:      "#8A92A6",
  mutedDark:  "#5A6480",
  error:      "#E84444",
  errorBg:    "rgba(232,68,68,0.08)",
  textPrimary:"#1A2545",
  textSecond: "#4A5578",
};

const ROLES = [
  {
    key:   "main_admin",
    label: "Main Admin",
    subtitle: "Full Access",
    desc:  "Complete system control — manage all data, users & configurations",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    gradient: `linear-gradient(135deg, ${C.saffron}, ${C.gold})`,
    accent: C.saffron,
    shadow: "rgba(255,107,0,0.30)",
  },
  {
    key:   "staff_admin",
    label: "Staff Admin",
    subtitle: "Limited Access",
    desc:  "Add & update entries — manage complaints and appointments",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    gradient: `linear-gradient(135deg, #1E3A8A, #2563EB)`,
    accent: "#2563EB",
    shadow: "rgba(37,99,235,0.30)",
  },
];

/* ─── Particle data generated once at module level (outside render) ─ */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  opacity: Math.random() * 0.4 + 0.1,
  delay: Math.random() * 8,
  dur: Math.random() * 6 + 10,
}));

/* ─── Floating particle background ──────────────────────────── */
function Particles() {
  const pts = PARTICLES;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {pts.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          borderRadius: "50%",
          background: C.gold,
          opacity: p.opacity,
          animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
        }} />
      ))}
      <style>{`
        @keyframes float {
          from { transform: translateY(0px) scale(1); }
          to   { transform: translateY(-24px) scale(1.3); opacity: 0.05; }
        }
      `}</style>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function Login() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [username,     setUsername]     = useState("");
  const [password,     setPassword]     = useState("");
  const [showPass,     setShowPass]     = useState(false);
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [fUser,        setFUser]        = useState(false);
  const [fPass,        setFPass]        = useState(false);
  const [mounted,      setMounted]      = useState(false);
  const navigate = useNavigate();

  const chosenRole = ROLES.find(r => r.key === selectedRole);

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);

  const handleLogin = async () => {
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/admin-login", {
        username: username.trim(),
        password: password.trim(),
      });
      if (res.data.success) {
        const user = res.data.user;
        if (user.role !== selectedRole) {
          setError(
            `These credentials belong to a ${user.role === "main_admin" ? "Main Admin" : "Staff Admin"} account. Please select the correct login type.`
          );
          setLoading(false);
          return;
        }
        localStorage.setItem("admin_user", JSON.stringify(user));
        if (user.role === "main_admin") navigate("/admin");
        else navigate("/dashboard");
      }
    } catch (err) {
      const msg = err?.response?.data?.error || "Login failed. Check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "'Poppins', sans-serif",
      background: C.offWhite,
      overflow: "hidden",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255,107,0,0.4); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 10px rgba(255,107,0,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255,107,0,0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .role-card {
          transition: transform 0.22s cubic-bezier(.4,0,.2,1),
                      box-shadow 0.22s cubic-bezier(.4,0,.2,1),
                      border-color 0.22s ease;
        }
        .role-card:hover {
          transform: translateY(-3px) !important;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.08);
        }
        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .back-btn:hover { background: rgba(13,27,62,0.06) !important; }

        /* FIX: .form-card-enter drives the slide-in so the CSS animation
           controls opacity correctly — no conflicting inline opacity. */
        .form-card-enter {
          animation: slideIn 0.45s cubic-bezier(.4,0,.2,1) forwards;
        }
        .form-card-hidden {
          opacity: 0;
        }

        @media (max-width: 900px) {
          .left-panel { display: none !important; }
          .right-panel { border-radius: 0 !important; }
        }
        @media (max-width: 480px) {
          .form-card { padding: 32px 20px !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════
          LEFT PANEL — Brand / Political Identity
      ══════════════════════════════════════════════════════════ */}
      <div className="left-panel" style={{
        width: 480,
        flexShrink: 0,
        background: C.navy,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "52px 52px 44px",
      }}>
        <Particles />

        {/* Decorative arcs */}
        <div style={{
          position: "absolute", bottom: -120, right: -120,
          width: 500, height: 500, borderRadius: "50%",
          border: `1px solid rgba(200,148,42,0.12)`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -180, right: -180,
          width: 700, height: 700, borderRadius: "50%",
          border: `1px solid rgba(200,148,42,0.06)`,
          pointerEvents: "none",
        }} />
        {/* Top saffron bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${C.saffron}, ${C.gold}, transparent)`,
        }} />

        {/* Glow blob */}
        <div style={{
          position: "absolute", top: -60, left: -60,
          width: 320, height: 320, borderRadius: "50%",
          background: C.saffronGlow,
          filter: "blur(80px)", pointerEvents: "none",
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 64 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `linear-gradient(135deg, ${C.saffron}, ${C.gold})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 20px ${C.saffronGlow}`,
              flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.white, letterSpacing: 0.3 }}>Uday Sangle</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.40)", letterSpacing: 1.2, textTransform: "uppercase", marginTop: 1 }}>Maharashtra Office</div>
            </div>
          </div>

          {/* Main heading */}
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 2.5,
            textTransform: "uppercase", color: C.saffron,
            marginBottom: 16,
          }}>
            Secure Portal
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 40, fontWeight: 700,
            color: C.white, lineHeight: 1.18,
            marginBottom: 16,
          }}>
            Political Office<br />
            <span style={{
              background: `linear-gradient(90deg, ${C.goldLight}, ${C.saffron})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Management
            </span>
          </h1>
          <div style={{
            width: 48, height: 3, borderRadius: 2,
            background: `linear-gradient(90deg, ${C.saffron}, ${C.gold})`,
            marginBottom: 24,
          }} />
          <p style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 13.5, lineHeight: 1.85,
            maxWidth: 310,
          }}>
            Manage complaints, appointments, and constituency data for your office — all in one secure, intelligent platform.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 28, marginTop: 48 }}>
            {[
              { value: "100%", label: "Secure" },
              { value: "24/7", label: "Available" },
              { value: "Real-time", label: "Updates" },
            ].map(s => (
              <div key={s.label}>
                <div style={{
                  fontSize: 18, fontWeight: 700,
                  background: `linear-gradient(90deg, ${C.goldLight}, ${C.saffron})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 3,
                }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 0.8 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Feature list */}
          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Complaint tracking & resolution",
              "Appointment scheduling & calendar",
              "Notice & communication board",
              "Constituency analytics & insights",
            ].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%",
                  background: "rgba(255,107,0,0.15)",
                  border: `1px solid rgba(255,107,0,0.35)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke={C.saffron} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2 6 5 9 10 3"/>
                  </svg>
                </div>
                <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.50)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer link */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <Link to="/" style={{
            fontSize: 12, color: "rgba(255,255,255,0.28)",
            textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 6,
            transition: "color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.60)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.28)"}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Public Homepage
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          RIGHT PANEL — Login Form
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        background: `radial-gradient(ellipse at 70% 20%, rgba(255,107,0,0.04), transparent 60%),
                     radial-gradient(ellipse at 20% 80%, rgba(13,27,62,0.05), transparent 60%),
                     ${C.offWhite}`,
        position: "relative",
      }}>
        {/* Top decorative bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${C.saffron}, ${C.gold}, transparent)`,
        }} />

        {/*
          FIX: Instead of conflicting inline opacity + animation, we use
          CSS classes. When not mounted → .form-card-hidden (opacity:0, no animation).
          When mounted → .form-card-enter (slideIn animation handles opacity 0→1).
          This lets the CSS animation own the opacity property without an
          inline style fighting it.
        */}
        <div
          className={`form-card ${mounted ? "form-card-enter" : "form-card-hidden"}`}
          style={{
            width: "100%",
            maxWidth: 420,
            background: C.white,
            borderRadius: 24,
            padding: "48px 44px",
            boxShadow: "0 8px 48px rgba(13,27,62,0.10), 0 1px 0 rgba(255,255,255,0.9) inset",
            border: `1px solid rgba(200,148,42,0.12)`,
          }}
        >

          {/* ── STEP 1: Choose Role ── */}
          {!selectedRole ? (
            <div>
              {/* Header */}
              <div style={{ marginBottom: 36 }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: C.saffronGlow,
                  border: `1px solid rgba(255,107,0,0.25)`,
                  borderRadius: 20, padding: "4px 14px",
                  marginBottom: 18,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.saffron, animation: "pulse-ring 2s infinite" }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.saffron, letterSpacing: 1.2, textTransform: "uppercase" }}>Secure Access</span>
                </div>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 28, fontWeight: 700,
                  color: C.textPrimary,
                  lineHeight: 1.2, marginBottom: 10,
                }}>
                  Sign In to Your<br />Admin Portal
                </h2>
                <p style={{ fontSize: 13, color: C.mutedDark, lineHeight: 1.7 }}>
                  Select your access level to continue to the secure login panel.
                </p>
              </div>

              {/* Role cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                {ROLES.map(role => (
                  <button
                    key={role.key}
                    className="role-card"
                    onClick={() => { setSelectedRole(role.key); setError(""); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 18,
                      padding: "20px 22px", borderRadius: 16,
                      border: `1.5px solid rgba(200,148,42,0.15)`,
                      background: C.cream,
                      cursor: "pointer", textAlign: "left", width: "100%",
                      boxShadow: "0 2px 12px rgba(13,27,62,0.05)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = role.accent;
                      e.currentTarget.style.boxShadow = `0 8px 32px ${role.shadow}`;
                      e.currentTarget.style.background = C.white;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "rgba(200,148,42,0.15)";
                      e.currentTarget.style.boxShadow = "0 2px 12px rgba(13,27,62,0.05)";
                      e.currentTarget.style.background = C.cream;
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: role.gradient,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: C.white, flexShrink: 0,
                      boxShadow: `0 4px 16px ${role.shadow}`,
                    }}>
                      {role.icon}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary }}>{role.label}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 600, letterSpacing: 0.8,
                          textTransform: "uppercase", padding: "2px 8px",
                          borderRadius: 20, color: role.accent,
                          background: role.key === "main_admin" ? C.saffronGlow : "rgba(37,99,235,0.10)",
                          border: `1px solid ${role.accent}30`,
                        }}>{role.subtitle}</span>
                      </div>
                      <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{role.desc}</div>
                    </div>

                    {/* Arrow */}
                    <div style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: "rgba(13,27,62,0.05)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, color: C.mutedDark,
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </div>
                  </button>
                ))}
              </div>

              {/* Credentials hint */}
              <div style={{
                padding: "14px 18px", borderRadius: 12,
                background: "rgba(13,27,62,0.03)",
                border: "1px dashed rgba(200,148,42,0.25)",
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.textPrimary, marginBottom: 6, letterSpacing: 0.5 }}>
                  Default Credentials
                </div>
                <div style={{ fontSize: 12, color: C.mutedDark, lineHeight: 1.9 }}>
                  Main Admin: <code style={{ background: "rgba(255,107,0,0.08)", padding: "1px 6px", borderRadius: 4, color: C.saffron, fontFamily: "monospace" }}>admin</code> / <code style={{ background: "rgba(255,107,0,0.08)", padding: "1px 6px", borderRadius: 4, color: C.saffron, fontFamily: "monospace" }}>admin123</code><br />
                  Staff Admin: <code style={{ background: "rgba(37,99,235,0.08)", padding: "1px 6px", borderRadius: 4, color: "#2563EB", fontFamily: "monospace" }}>staff</code> / <code style={{ background: "rgba(37,99,235,0.08)", padding: "1px 6px", borderRadius: 4, color: "#2563EB", fontFamily: "monospace" }}>staff123</code>
                </div>
              </div>
            </div>

          ) : (
            /* ── STEP 2: Enter Credentials ── */
            <div>
              {/* Back + role badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
                <button
                  className="back-btn"
                  onClick={() => { setSelectedRole(null); setUsername(""); setPassword(""); setError(""); }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 13, color: C.mutedDark,
                    padding: "7px 12px", borderRadius: 9,
                    display: "flex", alignItems: "center", gap: 5,
                    transition: "background 0.2s",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                  </svg>
                  Back
                </button>

                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "5px 14px", borderRadius: 20,
                  background: chosenRole.key === "main_admin" ? C.saffronGlow : "rgba(37,99,235,0.10)",
                  border: `1px solid ${chosenRole.accent}30`,
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: chosenRole.accent }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: chosenRole.accent, letterSpacing: 1.2, textTransform: "uppercase" }}>{chosenRole.label}</span>
                </div>
              </div>

              {/* Heading */}
              <div style={{ marginBottom: 32 }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: chosenRole.key === "main_admin" ? C.saffronGlow : "rgba(37,99,235,0.08)",
                  border: `1px solid ${chosenRole.accent}25`,
                  borderRadius: 20, padding: "4px 14px", marginBottom: 16,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: chosenRole.accent, animation: "pulse-ring 2s infinite" }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: chosenRole.accent, letterSpacing: 1.2, textTransform: "uppercase" }}>Secure Login</span>
                </div>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 26, fontWeight: 700,
                  color: C.textPrimary, lineHeight: 1.25, marginBottom: 8,
                }}>
                  Welcome Back,<br />{chosenRole.label}
                </h2>
                <p style={{ fontSize: 13, color: C.mutedDark }}>Enter your credentials to access the portal.</p>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  background: C.errorBg, border: `1px solid rgba(232,68,68,0.25)`,
                  borderLeft: `3px solid ${C.error}`,
                  borderRadius: 10, padding: "12px 14px",
                  marginBottom: 22, animation: "slideIn 0.2s ease",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.error} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span style={{ fontSize: 13, color: C.error, lineHeight: 1.5 }}>{error}</span>
                </div>
              )}

              {/* Username field */}
              <div style={{ marginBottom: 18 }}>
                <label style={{
                  display: "block", fontSize: 11, fontWeight: 600,
                  color: C.textPrimary, letterSpacing: 1.2,
                  textTransform: "uppercase", marginBottom: 8,
                }}>Username</label>
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                    color: fUser ? chosenRole.accent : C.muted, transition: "color 0.2s",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onFocus={() => setFUser(true)}
                    onBlur={() => setFUser(false)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    autoComplete="new-password"
                    placeholder="Enter your username"
                    style={{
                      width: "100%", padding: "13px 14px 13px 42px",
                      borderRadius: 12, fontFamily: "'Poppins', sans-serif",
                      border: `1.5px solid ${fUser ? chosenRole.accent : "rgba(200,148,42,0.20)"}`,
                      background: fUser ? C.white : C.cream,
                      fontSize: 14, color: C.textPrimary, outline: "none",
                      transition: "all 0.2s",
                      boxShadow: fUser ? `0 0 0 3px ${chosenRole.accent}15` : "none",
                    }}
                  />
                </div>
              </div>

              {/* Password field */}
              <div style={{ marginBottom: 32 }}>
                <label style={{
                  display: "block", fontSize: 11, fontWeight: 600,
                  color: C.textPrimary, letterSpacing: 1.2,
                  textTransform: "uppercase", marginBottom: 8,
                }}>Password</label>
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                    color: fPass ? chosenRole.accent : C.muted, transition: "color 0.2s",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFPass(true)}
                    onBlur={() => setFPass(false)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    style={{
                      width: "100%", padding: "13px 44px 13px 42px",
                      borderRadius: 12, fontFamily: "'Poppins', sans-serif",
                      border: `1.5px solid ${fPass ? chosenRole.accent : "rgba(200,148,42,0.20)"}`,
                      background: fPass ? C.white : C.cream,
                      fontSize: 14, color: C.textPrimary, outline: "none",
                      transition: "all 0.2s",
                      boxShadow: fPass ? `0 0 0 3px ${chosenRole.accent}15` : "none",
                    }}
                  />
                  <button
                    onClick={() => setShowPass(p => !p)}
                    style={{
                      position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      color: C.muted, padding: 0, display: "flex", alignItems: "center",
                    }}
                  >
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                className="login-btn"
                onClick={handleLogin}
                disabled={loading}
                style={{
                  width: "100%", padding: "15px",
                  borderRadius: 14,
                  background: loading
                    ? "rgba(200,148,42,0.5)"
                    : chosenRole.gradient,
                  color: C.white, border: "none",
                  fontSize: 14.5, fontWeight: 600, letterSpacing: 0.4,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.22s cubic-bezier(.4,0,.2,1)",
                  boxShadow: loading ? "none" : `0 6px 28px ${chosenRole.shadow}`,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: C.white, borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }} />
                    Authenticating…
                  </>
                ) : (
                  <>
                    Sign In as {chosenRole.label}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>

              {/* Security note */}
              <div style={{
                marginTop: 24, display: "flex", alignItems: "center",
                justifyContent: "center", gap: 6,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span style={{ fontSize: 11.5, color: C.muted }}>
                  Access restricted to authorized personnel only
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}