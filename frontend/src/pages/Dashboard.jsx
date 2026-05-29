// frontend/src/pages/Dashboard.jsx
// Uday Sangle — Premium Political Office Management System
// LOGIC: UNCHANGED. Only UI redesigned.

import { useEffect, useState } from "react";
import api from "../services/api";
import { UPLOADS_URL } from "../services/api";
import { Link } from "react-router-dom";


function getUser() {
  try { const u = localStorage.getItem("admin_user"); return u ? JSON.parse(u) : null; }
  catch { return null; }
}

const statusCfg = {
  Pending:  { bg:"rgba(245,158,11,0.10)",  text:"#B45309", dot:"#F59E0B", border:"rgba(245,158,11,0.22)" },
  Approved: { bg:"rgba(16,185,129,0.10)",  text:"#065F46", dot:"#10B981", border:"rgba(16,185,129,0.22)" },
  Done:     { bg:"rgba(59,130,246,0.10)",  text:"#1E40AF", dot:"#3B82F6", border:"rgba(59,130,246,0.22)" },
};

const apptCfg = {
  Pending:   { bg:"rgba(245,158,11,0.10)",  text:"#B45309", dot:"#F59E0B" },
  Confirmed: { bg:"rgba(16,185,129,0.10)",  text:"#065F46", dot:"#10B981" },
  Cancelled: { bg:"rgba(239,68,68,0.10)",   text:"#B91C1C", dot:"#EF4444" },
};

const PAGE_SIZE = 5;


function isVideo(filename) {
  return /\.(mp4|webm|ogg|mov)$/i.test(filename);
}

/* ── Lightbox ── */
function Lightbox({ file, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position:"fixed", inset:0, zIndex:9999,
        background:"rgba(0,0,0,0.88)", backdropFilter:"blur(6px)",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position:"absolute", top:20, right:24,
          width:40, height:40, borderRadius:"50%",
          background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.22)",
          color:"#fff", fontSize:20, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"background 0.18s",
        }}
        onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.22)"}
        onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.12)"}
      >✕</button>

      <div onClick={e => e.stopPropagation()} style={{ maxWidth:"90vw", maxHeight:"90vh" }}>
        {isVideo(file) ? (
          <video
            src={UPLOADS_URL + "/" + file}
            controls autoPlay
            style={{ maxWidth:"90vw", maxHeight:"88vh", borderRadius:12, boxShadow:"0 24px 80px rgba(0,0,0,0.6)" }}
          />
        ) : (
          <img
            src={UPLOADS_URL + "/" + file}
            alt=""
            style={{ maxWidth:"90vw", maxHeight:"88vh", borderRadius:12, objectFit:"contain", boxShadow:"0 24px 80px rgba(0,0,0,0.6)" }}
          />
        )}
      </div>
    </div>
  );
}

/* ── Notices Board ── */
function NoticesBoard({ notices }) {
  const [page,      setPage]      = useState(0);
  const [lightbox,  setLightbox]  = useState(null); // filename string

  const totalPages = Math.ceil(notices.length / PAGE_SIZE);
  const paged      = notices.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const fmt = raw => {
    const d = raw ? new Date(raw) : null;
    if (!d || isNaN(d)) return null;
    return {
      date: d.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }),
      time: d.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true }),
    };
  };

  return (
    <>
      {lightbox && <Lightbox file={lightbox} onClose={() => setLightbox(null)} />}

      <div className="card fade-in-up" style={{ animationDelay:"0.16s", marginBottom:18 }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:1.8, textTransform:"uppercase", color:"#10B981", marginBottom:4 }}>Recent</div>
            <div style={{ fontSize:16, fontWeight:700, color:"#212e56" }}>Notices Board</div>
          </div>
          <Link to="/notices" style={{ fontSize:12, color:"#10B981", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
            Manage notices
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>

        {/* Empty state */}
        {notices.length === 0 ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 0", gap:12 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C8D0E0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <p style={{ fontSize:13, color:"#8A92A6", margin:0 }}>No notices posted yet.</p>
          </div>
        ) : (
          <>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {paged.map((n, idx) => {
                const globalIdx = page * PAGE_SIZE + idx;
                const dt        = fmt(n.created_at || n.createdAt || n.date);
                const mediaFiles = n.media ? n.media.split(",").map(f => f.trim()).filter(Boolean) : [];
                const accent    = ["#FF6B00","#10B981","#2563EB","#C8942A","#8B5CF6"][globalIdx % 5];

                return (
                  <div key={n.id} style={{
                    borderRadius:14, border:"1px solid rgba(13,27,62,0.08)",
                    background:"#FAFAFA", overflow:"hidden",
                    boxShadow:"0 1px 4px rgba(13,27,62,0.04)",
                    transition:"box-shadow 0.18s, transform 0.18s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow="0 8px 24px rgba(13,27,62,0.10)"; e.currentTarget.style.transform="translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow="0 1px 4px rgba(13,27,62,0.04)"; e.currentTarget.style.transform="translateY(0)"; }}
                  >
                    <div style={{ display:"flex", alignItems:"stretch" }}>
                      {/* Left accent bar */}
                      <div style={{ width:4, flexShrink:0, background:accent }} />

                      {/* Main content */}
                      <div style={{ flex:1, padding:"16px 18px" }}>

                        {/* Row 1: Number + Title + Date */}
                        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:12, flex:1, minWidth:0 }}>
                            {/* Number badge */}
                            <div style={{
                              width:32, height:32, borderRadius:10, flexShrink:0,
                              background:`${accent}18`, border:`1.5px solid ${accent}40`,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              fontSize:13, fontWeight:800, color:accent,
                            }}>
                              {String(globalIdx + 1).padStart(2, "0")}
                            </div>

                            {/* Title */}
                            <div style={{ fontSize:14, fontWeight:700, color:"#1A2545", lineHeight:1.3 }}>
                              {n.title}
                            </div>
                          </div>

                          {/* Date */}
                          {dt && (
                            <div style={{ flexShrink:0, textAlign:"right" }}>
                              <div style={{ fontSize:11.5, fontWeight:600, color:"#1A2545" }}>{dt.date}</div>
                              <div style={{ fontSize:10.5, color:"#8A92A6", marginTop:1 }}>{dt.time}</div>
                            </div>
                          )}
                        </div>

                        {/* Row 2: Description */}
                        {n.content && (
                          <p style={{
                            fontSize:12.5, color:"#6B7A99", lineHeight:1.65, margin:"10px 0 0 44px",
                            display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden",
                          }}>
                            {n.content}
                          </p>
                        )}

                        {/* Row 3: Media thumbnails */}
                        {mediaFiles.length > 0 && (
                          <div style={{ display:"flex", gap:8, marginTop:12, marginLeft:44, flexWrap:"wrap" }}>
                            {mediaFiles.map((file, fi) => (
                              <div
                                key={fi}
                                onClick={() => setLightbox(file)}
                                style={{
                                  width:72, height:58, borderRadius:9, overflow:"hidden",
                                  border:"1.5px solid rgba(13,27,62,0.10)",
                                  cursor:"pointer", flexShrink:0, position:"relative",
                                  background:"#eef0f5",
                                  transition:"transform 0.16s, box-shadow 0.16s",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform="scale(1.06)"; e.currentTarget.style.boxShadow="0 6px 18px rgba(13,27,62,0.18)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="none"; }}
                              >
                                {isVideo(file) ? (
                                  <>
                                    <video src={UPLOADS_URL + "/" + file} style={{ width:"100%", height:"100%", objectFit:"cover" }} muted />
                                    {/* Play overlay */}
                                    <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.30)" }}>
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <img src={UPLOADS_URL + "/" + file} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                                    {/* Zoom overlay */}
                                    <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0)", display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.16s" }}
                                      onMouseEnter={e => e.currentTarget.style.background="rgba(0,0,0,0.28)"}
                                      onMouseLeave={e => e.currentTarget.style.background="rgba(0,0,0,0)"}
                                    >
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity:0.9 }}>
                                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                                      </svg>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:18, paddingTop:14, borderTop:"1px solid rgba(13,27,62,0.07)" }}>
                <span style={{ fontSize:12, color:"#8A92A6" }}>
                  Page <strong style={{ color:"#1A2545" }}>{page + 1}</strong> of <strong style={{ color:"#1A2545" }}>{totalPages}</strong>
                  &nbsp;·&nbsp; {notices.length} notices total
                </span>
                <div style={{ display:"flex", gap:6 }}>
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    style={{
                      display:"flex", alignItems:"center", gap:5,
                      padding:"7px 14px", borderRadius:9, fontSize:12, fontWeight:600,
                      border:"1px solid rgba(13,27,62,0.12)",
                      background: page === 0 ? "#F5F5F7" : "#fff",
                      color: page === 0 ? "#B0B8CC" : "#1A2545",
                      cursor: page === 0 ? "not-allowed" : "pointer",
                      transition:"all 0.16s",
                    }}
                    onMouseEnter={e => { if (page !== 0) { e.currentTarget.style.background="#F0F4FF"; e.currentTarget.style.borderColor="rgba(37,99,235,0.25)"; } }}
                    onMouseLeave={e => { e.currentTarget.style.background = page === 0 ? "#F5F5F7" : "#fff"; e.currentTarget.style.borderColor="rgba(13,27,62,0.12)"; }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => setPage(i)} style={{
                      width:32, height:32, borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer",
                      border: i === page ? "none" : "1px solid rgba(13,27,62,0.12)",
                      background: i === page ? "#10B981" : "#fff",
                      color: i === page ? "#fff" : "#1A2545",
                      transition:"all 0.16s",
                    }}>
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    style={{
                      display:"flex", alignItems:"center", gap:5,
                      padding:"7px 14px", borderRadius:9, fontSize:12, fontWeight:600,
                      border:"1px solid rgba(13,27,62,0.12)",
                      background: page === totalPages - 1 ? "#F5F5F7" : "#fff",
                      color: page === totalPages - 1 ? "#B0B8CC" : "#1A2545",
                      cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
                      transition:"all 0.16s",
                    }}
                    onMouseEnter={e => { if (page !== totalPages - 1) { e.currentTarget.style.background="#F0F4FF"; e.currentTarget.style.borderColor="rgba(37,99,235,0.25)"; } }}
                    onMouseLeave={e => { e.currentTarget.style.background = page === totalPages - 1 ? "#F5F5F7" : "#fff"; e.currentTarget.style.borderColor="rgba(13,27,62,0.12)"; }}
                  >
                    Next
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default function Dashboard() {
  const [notices,      setNotices]      = useState([]);
  const [complaints,   setComplaints]   = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats,        setStats]        = useState({ resolved:null, appointments:null, areas:null });
  const [loading,      setLoading]      = useState(true);
  const user = getUser();

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get("/notices"),
      api.get("/complaints"),
      api.get("/appointments"),
      api.get("/stats"),
    ]).then(([n, c, a, s]) => {
      if (cancelled) return;
      setNotices(n.data);
      setComplaints(c.data.slice(0, 5));
      setAppointments(a.data.slice(0, 5));
      setStats(s.data);
    }).catch(() => {}).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good Morning" : now.getHours() < 17 ? "Good Afternoon" : "Good Evening";

  const statCards = [
    {
      label: "Notices Posted", val: notices.length,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
      color:"#10B981", glow:"rgba(16,185,129,0.10)", gradient:"linear-gradient(135deg,#059669,#10B981)",
      shadow:"rgba(16,185,129,0.20)",
    },
    {
      label: "Total Complaints", val: stats.complaints ?? "—",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
      color:"#FF6B00", glow:"rgba(255,107,0,0.12)", gradient:"linear-gradient(135deg,#FF6B00,#C8942A)",
      shadow:"rgba(255,107,0,0.22)",
    },
    {
      label: "Appointments", val: stats.appointments ?? "—",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
      color:"#C8942A", glow:"rgba(200,148,42,0.12)", gradient:"linear-gradient(135deg,#C8942A,#E8B84B)",
      shadow:"rgba(200,148,42,0.22)",
    },
    {
      label: "Areas Covered", val: stats.areas ?? "—",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
      color:"#2563EB", glow:"rgba(37,99,235,0.10)", gradient:"linear-gradient(135deg,#1E3A8A,#2563EB)",
      shadow:"rgba(37,99,235,0.20)",
    }
  ];

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:300, flexDirection:"column", gap:16 }}>
      <div style={{ width:36, height:36, border:"3px solid rgba(255,107,0,0.15)", borderTopColor:"#FF6B00", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <span style={{ fontSize:13, color:"#8A92A6" }}>Loading dashboard…</span>
    </div>
  );

  return (
    <div className="fade-in">

      {/* ── Welcome Banner ── */}
      <div className="fade-in-up" style={{
        background: "linear-gradient(135deg,#0D1B3E 0%,#162347 60%,#0F1E45 100%)",
        borderRadius: 20, padding: "28px 32px", marginBottom: 24,
        position: "relative", overflow: "hidden",
        border: "1px solid rgba(200,148,42,0.20)",
        boxShadow: "0 8px 40px rgba(23, 47, 109, 0.2)",
      }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:220, height:220, borderRadius:"50%", background:"rgba(255,107,0,0.08)", filter:"blur(60px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-60, left:100, width:280, height:280, borderRadius:"50%", background:"rgba(200,148,42,0.06)", filter:"blur(80px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#FF6B00,#C8942A,transparent)" }} />

        <div style={{ position:"relative", zIndex:2, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,107,0,0.80)", marginBottom:8 }}>
              {greeting}
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(20px,2.5vw,26px)", color:"#fff", fontWeight:700, marginBottom:6, lineHeight:1.2 }}>
              Welcome back, {user?.username || "Admin"}
            </h1>
            <p style={{ fontSize:13.5, color:"rgba(255,255,255,0.45)", maxWidth:480 }}>
              Here's what's happening in your constituency office today.
            </p>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <Link to="/complaints" style={{
              display:"inline-flex", alignItems:"center", gap:7,
              background:"linear-gradient(135deg,#FF6B00,#C8942A)",
              color:"#fff", fontSize:13, fontWeight:600,
              padding:"10px 20px", borderRadius:11,
              boxShadow:"0 4px 16px rgba(255,107,0,0.30)",
              transition:"all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(255,107,0,0.40)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(255,107,0,0.30)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              View Complaints
            </Link>
            <Link to="/appointments" style={{
              display:"inline-flex", alignItems:"center", gap:7,
              background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)",
              color:"rgba(255,255,255,0.80)", fontSize:13, fontWeight:500,
              padding:"10px 20px", borderRadius:11, transition:"all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.13)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.08)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Appointments
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="fade-in-up stagger" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {statCards.map(s => (
          <div key={s.label} style={{
            background:"#fff", borderRadius:16, padding:"20px 20px",
            border:"1px solid rgba(200,148,42,0.12)",
            boxShadow:"0 2px 12px rgba(13,27,62,0.06)",
            transition:"all 0.22s ease",
            display:"flex", alignItems:"center", gap:14,
          }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 12px 32px ${s.shadow}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 12px rgba(13,27,62,0.06)"; }}
          >
            <div style={{ width:48, height:48, borderRadius:14, background:s.gradient, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0, boxShadow:`0 4px 14px ${s.shadow}` }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize:24, fontWeight:700, fontFamily:"'Playfair Display',serif", color:"#1A2545", lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:11.5, color:"#8A92A6", marginTop:4, fontWeight:500 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Notices Board ── */}
      <NoticesBoard notices={notices} />

      {/* ── Two column grid ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:18 }}>

        {/* Recent Complaints */}
        <div className="card fade-in-up" style={{ animationDelay:"0.08s" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
            <div>
              <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:1.8, textTransform:"uppercase", color:"#FF6B00", marginBottom:4 }}>Latest</div>
              <div style={{ fontSize:16, fontWeight:700, color:"#1A2545" }}>Complaints</div>
            </div>
            <Link to="/complaints" style={{ fontSize:12, color:"#FF6B00", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
              View all
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {complaints.length === 0 && <p style={{ fontSize:13, color:"#8A92A6", textAlign:"center", padding:"24px 0" }}>No complaints yet.</p>}
            {complaints.map((c, i) => {
              const s = statusCfg[c.status] || statusCfg.Pending;
              return (
                <div key={c.id} style={{
                  display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
                  borderRadius:11, background:"#F8F6F2",
                  border:`1px solid rgba(200,148,42,0.10)`,
                  transition:"all 0.18s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.borderColor="rgba(255,107,0,0.18)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="#F8F6F2"; e.currentTarget.style.borderColor="rgba(200,148,42,0.10)"; }}
                >
                  <div style={{ width:30, height:30, borderRadius:9, background:"rgba(255,107,0,0.10)", border:"1px solid rgba(255,107,0,0.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#FF6B00", flexShrink:0 }}>
                    {String(i+1).padStart(2,"0")}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#36436a", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.subject}</div>
                    <div style={{ fontSize:11.5, color:"#c7c8ca", marginTop:2 }}>{c.full_name} · {c.area}</div>
                  </div>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:s.bg, color:s.text, border:`1px solid ${s.border}`, fontSize:10.5, fontWeight:600, padding:"3px 9px", borderRadius:20, flexShrink:0 }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", background:s.dot }} />
                    {c.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="card fade-in-up" style={{ animationDelay:"0.12s" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
            <div>
              <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:1.8, textTransform:"uppercase", color:"#C8942A", marginBottom:4 }}>Upcoming</div>
              <div style={{ fontSize:16, fontWeight:700, color:"#1A2545" }}>Appointments</div>
            </div>
            <Link to="/appointments" style={{ fontSize:12, color:"#C8942A", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
              View all
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {appointments.length === 0 && <p style={{ fontSize:13, color:"#8A92A6", textAlign:"center", padding:"24px 0" }}>No appointments yet.</p>}
            {appointments.map((a) => {
              const s = apptCfg[a.status] || apptCfg.Pending;
              return (
                <div key={a.id} style={{
                  display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
                  borderRadius:11, background:"#F8F6F2", border:"1px solid rgba(200,148,42,0.10)",
                  transition:"all 0.18s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.borderColor="rgba(200,148,42,0.25)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="#F8F6F2"; e.currentTarget.style.borderColor="rgba(200,148,42,0.10)"; }}
                >
                  <div style={{ width:36, height:36, borderRadius:10, background:"rgba(200,148,42,0.10)", border:"1px solid rgba(200,148,42,0.18)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#C8942A", lineHeight:1 }}>{new Date(a.date).getDate()}</div>
                    <div style={{ fontSize:8, fontWeight:600, color:"#8A92A6", textTransform:"uppercase", letterSpacing:0.5 }}>{new Date(a.date).toLocaleString("en-IN",{month:"short"})}</div>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#1A2545", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{a.full_name}</div>
                    <div style={{ fontSize:11.5, color:"#8A92A6", marginTop:2 }}>{a.time} · {a.purpose}</div>
                  </div>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:s.bg, color:s.text, fontSize:10.5, fontWeight:600, padding:"3px 9px", borderRadius:20, flexShrink:0 }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", background:s.dot }} />
                    {a.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width:900px) {
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2,1fr)!important; }
          div[style*="grid-template-columns: 1fr 1fr"]  { grid-template-columns: 1fr!important; }
        }
        @media (max-width:600px) {
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns: 1fr 1fr!important; }
        }
      `}</style>
    </div>
  );
}
