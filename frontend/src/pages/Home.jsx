// frontend/src/pages/Home.jsx
// udaysangle — Political Office Management System
// Application Home Page — App-style landing, not a public website

import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";


/* ─── Design Tokens ─────────────────────────────────────────── */
const C = {
  navy:        "#0D1B3E",
  navyMid:     "#162347",
  navyLight:   "#1E3060",
  saffron:     "#FF6B00",
  saffronSoft: "#FF8C38",
  saffronGlow: "rgba(255,107,0,0.12)",
  gold:        "#C8942A",
  goldLight:   "#E8B84B",
  goldGlow:    "rgba(200,148,42,0.10)",
  white:       "#FFFFFF",
  offWhite:    "#F4F6FB",
  surface:     "#FFFFFF",
  border:      "rgba(200,148,42,0.14)",
  muted:       "#8A92A6",
  textPrimary: "#1A2545",
  textSecond:  "#4A5578",
};

const statusConfig = {
  Pending:  { bg: "rgba(245,158,11,0.10)", text: "#B45309", dot: "#F59E0B", border: "rgba(245,158,11,0.25)" },
  Approved: { bg: "rgba(16,185,129,0.10)", text: "#065F46", dot: "#10B981", border: "rgba(16,185,129,0.25)" },
  Done:     { bg: "rgba(59,130,246,0.10)", text: "#1E40AF", dot: "#3B82F6", border: "rgba(59,130,246,0.25)" },
};

/* ─── Spinner ───────────────────────────────────────────────── */
function Spinner() {
  return (
    <div style={{ display:"flex", justifyContent:"center", padding:"48px 0" }}>
      <div style={{
        width:32, height:32,
        border:`3px solid rgba(255,107,0,0.15)`,
        borderTopColor: C.saffron,
        borderRadius:"50%",
        animation:"spin 0.8s linear infinite",
      }} />
    </div>
  );
}

/* ─── Icon helpers ──────────────────────────────────────────── */
const IconComplaint = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="12" y1="18" x2="12" y2="12"/>
    <line x1="9" y1="15" x2="15" y2="15"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconLogin = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconPin = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconUser = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconClock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

/* ─── Main Component ─────────────────────────────────────────── */
export default function Homepage() {
  const [complaints, setComplaints] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [stats,      setStats]      = useState({ resolved: null, appointments: null, areas: null });

  useEffect(() => {
    let cancelled = false;
    api.get("/complaints/public")
      .then(res => { if (!cancelled) setComplaints(res.data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    api.get("/stats")
      .then(res => { if (!cancelled) setStats(res.data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
  };
  const [timeOfDay, setTimeOfDay] = useState(getGreeting);
  useEffect(() => {
    const timer = setInterval(() => setTimeOfDay(getGreeting()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: C.offWhite,
      fontFamily: "'Poppins', sans-serif",
      color: C.textPrimary,
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .action-card {
          transition: transform 0.2s cubic-bezier(.4,0,.2,1), box-shadow 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(13,27,62,0.12) !important;
        }
        .action-card-primary:hover {
          box-shadow: 0 16px 40px rgba(255,107,0,0.28) !important;
        }
        .action-card-gold:hover {
          box-shadow: 0 16px 40px rgba(200,148,42,0.28) !important;
        }
        .action-card-blue:hover {
          box-shadow: 0 16px 40px rgba(37,99,235,0.22) !important;
        }

        .complaint-row {
          transition: background 0.15s, border-color 0.15s;
        }
        .complaint-row:hover {
          background: rgba(200,148,42,0.04) !important;
          border-color: rgba(200,148,42,0.22) !important;
        }

        .stat-pill {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .stat-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(13,27,62,0.10) !important;
        }

        @media (max-width: 768px) {
          .grid-3 { grid-template-columns: 1fr !important; }          .grid-4 { grid-template-columns: 1fr 1fr !important; }
          .hero-inner { flex-direction: column !important; gap: 8px !important; }
        }
        @media (max-width: 480px) {
          .grid-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ══ APP HEADER ══════════════════════════════════════════════ */}
      <header style={{
        background: C.navy,
        padding: "0 32px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        height: 60,
        borderBottom: "1px solid rgba(200,148,42,0.12)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:34, height:34, borderRadius:9,
            background:`linear-gradient(135deg, ${C.saffron}, ${C.gold})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 3px 12px rgba(255,107,0,0.30)`,
            flexShrink:0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <span style={{ fontSize:16, fontWeight:700, color:C.white, letterSpacing:0.3 }}>
            Uday Sangle
          </span>

        </div>

        {/* Right side */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        </div>
      </header>

      {/* ══ HERO WELCOME PANEL ══════════════════════════════════════ */}
      <section style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyLight} 100%)`,
        padding: "52px 32px 56px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background texture */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          <div style={{
            position:"absolute", inset:0,
            backgroundImage:`
              linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
            `,
            backgroundSize:"48px 48px",
          }} />
          <div style={{
            position:"absolute", top:-100, right:-60,
            width:480, height:480, borderRadius:"50%",
            background:"rgba(255,107,0,0.06)", filter:"blur(90px)",
          }} />
          <div style={{
            position:"absolute", bottom:-80, left:-60,
            width:400, height:400, borderRadius:"50%",
            background:"rgba(200,148,42,0.05)", filter:"blur(80px)",
          }} />
        </div>

        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:2 }}>
          <div className="hero-inner" style={{
            display:"flex", alignItems:"flex-end",
            justifyContent:"space-between", gap:32,
            flexWrap:"wrap",
          }}>
            <div style={{ animation:"fadeUp 0.4s ease 0.1s both" }}>
              <h1 style={{
                fontFamily:"'Playfair Display', serif",
                fontSize:"clamp(28px, 4vw, 48px)",
                color: C.white, lineHeight:1.15, marginBottom:12,
              }}>
                {timeOfDay},<br />
                <span style={{
                  background:`linear-gradient(90deg, ${C.goldLight}, ${C.saffron}, ${C.goldLight})`,
                  backgroundSize:"200% auto",
                  WebkitBackgroundClip:"text",
                  WebkitTextFillColor:"transparent",
                  animation:"shimmer 3s linear infinite",
                }}>
                  Welcome to the Office
                </span>
              </h1>
              <p style={{
                color:"rgba(255,255,255,0.45)",
                fontSize:14, lineHeight:1.8,
                maxWidth:460,
              }}>
                Manage complaints, appointments, and office operations for the constituency — all from one place.
              </p>
            </div>

            {/* Stats row */}
            <div style={{
              display:"flex", gap:14, flexWrap:"wrap",
              animation:"fadeUp 0.4s ease 0.18s both",
            }}>
              {[
                { label:"Resolved", val: stats.resolved ?? "—", color:C.saffron, glow:C.saffronGlow },
                { label:"Appointments", val: stats.appointments ?? "—", color:C.gold, glow:C.goldGlow },
                { label:"Areas", val: stats.areas ?? "—", color:"#2563EB", glow:"rgba(37,99,235,0.12)" },
              ].map(s => (
                <div key={s.label} className="stat-pill" style={{
                  background:"rgba(255,255,255,0.06)",
                  border:"1px solid rgba(255,255,255,0.09)",
                  borderRadius:14, padding:"14px 20px",
                  backdropFilter:"blur(12px)",
                  boxShadow:"0 4px 16px rgba(13,27,62,0.12)",
                  minWidth:90, textAlign:"center",
                }}>
                  <div style={{
                    fontSize:22, fontWeight:700,
                    color: C.white,
                    fontFamily:"'Playfair Display', serif",
                    lineHeight:1,
                  }}>
                    {s.val !== null && s.val !== "—"
                      ? `${Number(s.val).toLocaleString("en-IN")}+`
                      : "—"
                    }
                  </div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.38)", fontWeight:500, marginTop:5 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ QUICK ACTION CARDS ══════════════════════════════════════ */}
      <section style={{ padding:"40px 32px", maxWidth:1100, margin:"0 auto" }}>

        <div style={{ marginBottom:24, animation:"fadeUp 0.4s ease 0.22s both" }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>
            Quick Access
          </p>
          <h2 style={{
            fontFamily:"'Playfair Display', serif",
            fontSize:"clamp(20px, 2.5vw, 26px)",
            color: C.textPrimary, fontWeight:700,
          }}>
            What would you like to do?
          </h2>
        </div>

        <div className="grid-3" style={{
          display:"grid",
          gridTemplateColumns:"repeat(2, 1fr)",
          gap:18,
          animation:"fadeUp 0.4s ease 0.28s both",
        }}>

          {/* Card 1 — File Complaint */}
          <Link to="/file-complaint" className="action-card action-card-primary" style={{
            display:"block",
            background: C.surface,
            borderRadius:18,
            border:`1px solid rgba(255,107,0,0.15)`,
            padding:"28px 26px",
            boxShadow:"0 4px 20px rgba(255,107,0,0.08)",
            position:"relative", overflow:"hidden",
          }}>
            <div style={{
              position:"absolute", top:0, left:0, right:0, height:3,
              background:`linear-gradient(90deg, ${C.saffron}, ${C.gold})`,
            }} />

            <div style={{
              width:52, height:52, borderRadius:14,
              background:"rgba(255,107,0,0.10)",
              border:"1px solid rgba(255,107,0,0.18)",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:C.saffron, marginBottom:18,
              boxShadow:"0 4px 14px rgba(255,107,0,0.15)",
            }}>
              <IconComplaint />
            </div>

            <div style={{
              display:"inline-flex", alignItems:"center",
              background:"rgba(255,107,0,0.08)",
              border:"1px solid rgba(255,107,0,0.18)",
              borderRadius:20, padding:"2px 10px",
              marginBottom:12,
            }}>
              <span style={{ fontSize:10, fontWeight:700, color:C.saffron, letterSpacing:0.8 }}>For Citizens</span>
            </div>

            <h3 style={{ fontSize:17, fontWeight:700, color:C.textPrimary, marginBottom:8 }}>
              File a Complaint
            </h3>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:20 }}>
              Submit a grievance directly to the MLA office. Every issue is tracked and addressed.
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:5, color:C.saffron, fontSize:13, fontWeight:600 }}>
              Get Started <IconArrow />
            </div>
          </Link>

          {/* Card 2 — Book Appointment */}
          <Link to="/book-appointment" className="action-card action-card-gold" style={{
            display:"block",
            background: C.surface,
            borderRadius:18,
            border:`1px solid rgba(200,148,42,0.15)`,
            padding:"28px 26px",
            boxShadow:"0 4px 20px rgba(200,148,42,0.08)",
            position:"relative", overflow:"hidden",
          }}>
            <div style={{
              position:"absolute", top:0, left:0, right:0, height:3,
              background:`linear-gradient(90deg, ${C.gold}, ${C.goldLight})`,
            }} />

            <div style={{
              width:52, height:52, borderRadius:14,
              background:"rgba(200,148,42,0.10)",
              border:"1px solid rgba(200,148,42,0.18)",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:C.gold, marginBottom:18,
              boxShadow:"0 4px 14px rgba(200,148,42,0.15)",
            }}>
              <IconCalendar />
            </div>

            <div style={{
              display:"inline-flex", alignItems:"center",
              background:"rgba(200,148,42,0.08)",
              border:"1px solid rgba(200,148,42,0.18)",
              borderRadius:20, padding:"2px 10px",
              marginBottom:12,
            }}>
              <span style={{ fontSize:10, fontWeight:700, color:C.gold, letterSpacing:0.8 }}>Schedule</span>
            </div>

            <h3 style={{ fontSize:17, fontWeight:700, color:C.textPrimary, marginBottom:8 }}>
              Book Appointment
            </h3>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:20 }}>
              Schedule a personal meeting with the MLA or office staff for direct attention.
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:5, color:C.gold, fontSize:13, fontWeight:600 }}>
              Schedule Now <IconArrow />
            </div>
          </Link>



        </div>
      </section>

      {/* ══ DIVIDER ════════════════════════════════════════════════ */}
      <div style={{ maxWidth:1100, margin:"0 auto 0", padding:"0 32px" }}>
        <div style={{ height:1, background:`linear-gradient(90deg, transparent, rgba(200,148,42,0.18), transparent)` }} />
      </div>

      {/* ══ PUBLIC COMPLAINT BOARD ══════════════════════════════════ */}
      <section id="complaints" style={{ padding:"40px 32px 60px", maxWidth:1100, margin:"0 auto" }}>

        {/* Section title */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexWrap:"wrap", gap:12, marginBottom:24,
          animation:"fadeUp 0.4s ease 0.32s both",
        }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:C.saffron, animation:"pulse-dot 2s infinite" }} />
              <span style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:1.5, textTransform:"uppercase" }}>
                Live Updates
              </span>
            </div>
            <h2 style={{
              fontFamily:"'Playfair Display', serif",
              fontSize:"clamp(20px, 2.5vw, 26px)",
              color: C.textPrimary, fontWeight:700,
            }}>
              Public Transparency Board
            </h2>
          </div>
          <Link to="/file-complaint" style={{
            display:"inline-flex", alignItems:"center", gap:7,
            background:`linear-gradient(135deg, ${C.saffron}, ${C.gold})`,
            color:"#fff", fontWeight:600, fontSize:13,
            padding:"9px 20px", borderRadius:10,
            boxShadow:"0 4px 14px rgba(255,107,0,0.28)",
            transition:"all 0.18s",
          }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 7px 20px rgba(255,107,0,0.38)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 14px rgba(255,107,0,0.28)"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            File Complaint
          </Link>
        </div>

        {/* Complaint list */}
        <div style={{ background:C.surface, borderRadius:18, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 2px 16px rgba(13,27,62,0.06)", animation:"fadeUp 0.4s ease 0.38s both" }}>

          {/* Table header */}
          <div style={{
            display:"grid",
            gridTemplateColumns:"44px 1fr 110px 90px 110px",
            gap:0,
            padding:"12px 24px",
            background:"rgba(13,27,62,0.03)",
            borderBottom:`1px solid ${C.border}`,
          }}>
            {["#", "Subject & Citizen", "Area", "Date", "Status"].map((h, i) => (
              <div key={h} style={{
                fontSize:10.5, fontWeight:700, color:C.muted,
                letterSpacing:1, textTransform:"uppercase",
                textAlign: i > 1 ? "center" : "left",
              }}>{h}</div>
            ))}
          </div>

          {/* Loading */}
          {loading && <Spinner />}

          {/* Empty */}
          {!loading && complaints.length === 0 && (
            <div style={{
              textAlign:"center", padding:"56px 24px",
            }}>
              <div style={{
                width:64, height:64, borderRadius:18,
                background:C.saffronGlow,
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 16px", fontSize:28,
              }}>📋</div>
              <div style={{ fontSize:15, fontWeight:600, color:C.textPrimary, marginBottom:6 }}>No public complaints yet</div>
              <p style={{ fontSize:13, color:C.muted }}>Approved and resolved complaints will appear here.</p>
            </div>
          )}

          {/* Rows */}
          {complaints.map((c, i) => {
            const s = statusConfig[c.status] || statusConfig.Pending;
            return (
              <div key={c.id} className="complaint-row" style={{
                display:"grid",
                gridTemplateColumns:"44px 1fr 110px 90px 110px",
                gap:0,
                padding:"14px 24px",
                borderBottom: i < complaints.length - 1 ? `1px solid rgba(200,148,42,0.08)` : "none",
                alignItems:"center",
                animation:`fadeUp 0.3s ease ${0.38 + i * 0.04}s both`,
              }}>
                {/* # */}
                <div style={{
                  width:28, height:28, borderRadius:8,
                  background:C.saffronGlow,
                  border:`1px solid rgba(255,107,0,0.14)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:11, fontWeight:700, color:C.saffron,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Subject & name */}
                <div style={{ paddingRight:16 }}>
                  <div style={{ fontSize:13.5, fontWeight:600, color:C.textPrimary, marginBottom:3 }}>
                    {c.subject}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11.5, color:C.muted, display:"flex", alignItems:"center", gap:4 }}>
                      <IconUser /> {c.full_name}
                    </span>
                  </div>
                </div>

                {/* Area */}
                <div style={{ textAlign:"center" }}>
                  <span style={{ fontSize:11.5, color:C.muted, display:"inline-flex", alignItems:"center", gap:4 }}>
                    <IconPin /> {c.area}
                  </span>
                </div>

                {/* Date */}
                <div style={{ textAlign:"center", fontSize:11.5, color:C.muted, display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                  <IconClock />
                  {new Date(c.complaint_date).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}
                </div>

                {/* Status */}
                <div style={{ display:"flex", justifyContent:"center" }}>
                  <span style={{
                    display:"inline-flex", alignItems:"center", gap:5,
                    background:s.bg, color:s.text,
                    border:`1px solid ${s.border}`,
                    fontSize:11, fontWeight:600,
                    padding:"4px 10px", borderRadius:20,
                    letterSpacing:0.3,
                  }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", background:s.dot, display:"inline-block" }} />
                    {c.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize:12, color:C.muted, marginTop:14, textAlign:"center" }}>
          Only approved and resolved complaints are shown publicly for transparency.
        </p>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer style={{
        background: C.navy,
        borderTop: "1px solid rgba(200,148,42,0.10)",
        padding: "24px 32px",
      }}>
        <div style={{
          maxWidth:1100, margin:"0 auto",
          display:"flex", alignItems:"center",
          justifyContent:"space-between",
          flexWrap:"wrap", gap:16,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:30, height:30, borderRadius:8,
              background:`linear-gradient(135deg, ${C.saffron}, ${C.gold})`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:C.white, lineHeight:1.3 }}>Uday Sangle</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.30)" }}>Developed by Way2smart Systems Pvt. Ltd.</div>
            </div>
          </div>

          <div style={{ display:"flex", gap:4 }}>
            {[
              { to:"/file-complaint", label:"File Complaint" },
              { to:"/book-appointment", label:"Book Appointment" },
              { to:"/login", label:"Staff Portal" },
            ].map(l => (
              <Link key={l.to} to={l.to} style={{
                fontSize:12, color:"rgba(255,255,255,0.32)",
                padding:"5px 10px", borderRadius:6, transition:"color 0.18s",
              }}
                onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,0.65)"}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.32)"}
              >{l.label}</Link>
            ))}
          </div>

          <div style={{ fontSize:11, color:"rgba(255,255,255,0.20)", letterSpacing:0.4 }}>
            © {new Date().getFullYear()} Uday Sangle · All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
