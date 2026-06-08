// frontend/src/pages/Complaints.jsx
// Uday Sangle — Premium Political Office Management System
// LOGIC: UNCHANGED. Only UI redesigned.

import { useEffect, useState } from "react";
import axios from "axios";

function getUser() {
  try { const u = localStorage.getItem("admin_user"); return u ? JSON.parse(u) : null; }
  catch { return null; }
}

const STATUS_OPTIONS = ["Pending","Approved","Done"];

const statusCfg = {
  Pending:  { bg:"rgba(245,158,11,0.10)",  text:"#B45309", dot:"#F59E0B", border:"rgba(245,158,11,0.25)" },
  Approved: { bg:"rgba(16,185,129,0.10)",  text:"#065F46", dot:"#10B981", border:"rgba(16,185,129,0.25)" },
  Done:     { bg:"rgba(59,130,246,0.10)",  text:"#1E40AF", dot:"#3B82F6", border:"rgba(59,130,246,0.25)" },
};

export default function Complaints() {
  const [complaints,  setComplaints]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [statusBusy,    setStatusBusy]    = useState({});
  const [filterStatus,  setFilterStatus]  = useState("All");
  const [search,        setSearch]        = useState("");
  const [expanded,      setExpanded]      = useState(null);

  const user    = getUser();
  const isAdmin = user?.role === "main_admin";

  useEffect(() => {
    let cancelled = false;
    axios.get("http://localhost:5000/api/complaints")
      .then(res => { if (!cancelled) setComplaints(res.data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const changeStatus = async (id, newStatus) => {
    setStatusBusy(prev => ({ ...prev, [id]: true }));
    try {
      await axios.patch(`http://localhost:5000/api/complaints/${id}/status`, { status: newStatus });
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch { alert("Failed to update status."); }
    finally { setStatusBusy(prev => ({ ...prev, [id]: false })); }
  };

  const counts = {
    All:      complaints.length,
    Pending:  complaints.filter(c => c.status === "Pending").length,
    Approved: complaints.filter(c => c.status === "Approved").length,
    Done:     complaints.filter(c => c.status === "Done").length,
  };

  const filtered = complaints
    .filter(c => filterStatus === "All" || c.status === filterStatus)
    .filter(c => !search.trim() ||
      c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.area?.toLowerCase().includes(search.toLowerCase()) ||
      c.purpose?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="fade-in-up" style={{ marginBottom: 24 }}>
        <div className="page-eyebrow">Complaints Management</div>
        <h1 className="page-title">Complaints</h1>
        <p className="page-sub">
          {isAdmin ? "Manage and confirm all complaint requests." : "View all submitted complaints."}
        </p>
      </div>

      {/* Stat strip */}
      <div className="fade-in-up stagger" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:22 }}>
        {[
          { label:"Total",     val:counts.All,       gradient:"linear-gradient(135deg,#0D1B3E,#162347)", shadow:"rgba(13,27,62,0.25)" },
          { label:"Pending",   val:counts.Pending,   gradient:"linear-gradient(135deg,#D97706,#F59E0B)", shadow:"rgba(217,119,6,0.25)"  },
          { label:"Approved",  val:counts.Approved,  gradient:"linear-gradient(135deg,#059669,#10B981)", shadow:"rgba(5,150,105,0.25)"  },
          
          { label:"Done",      val:counts.Done,      gradient:"linear-gradient(135deg,#2563EB,#3B82F6)", shadow:"rgba(37,99,235,0.25)"  },
        ].map(({ label, val, gradient, shadow }) => (
          <div key={label} style={{
            borderRadius:14, padding:"18px 20px", textAlign:"center",
            background: gradient,
            boxShadow: `0 4px 20px ${shadow}`,
            position:"relative", overflow:"hidden",
          }}>
            <div style={{ position:"absolute", top:-20, right:-20, width:70, height:70, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:700, color:"#fff", lineHeight:1 }}>{val}</div>
            <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.65)", fontWeight:700, letterSpacing:0.8, textTransform:"uppercase", marginTop:5 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", flex:1 }}>
          {["All","Pending","Approved","Done"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              padding:"7px 16px", borderRadius:9999,
              border:`1.5px solid ${filterStatus===s ? "#FF6B00" : "rgba(200,148,42,0.20)"}`,
              background: filterStatus===s ? "linear-gradient(135deg,#FF6B00,#C8942A)" : "#fff",
              color: filterStatus===s ? "#fff" : "#4A5578",
              fontSize:12.5, fontWeight: filterStatus===s ? 700 : 400,
              cursor:"pointer", transition:"all 0.16s ease",
              boxShadow: filterStatus===s ? "0 3px 12px rgba(255,107,0,0.28)" : "none",
              fontFamily:"'Poppins',sans-serif",
            }}>
              {s} <span style={{ opacity:0.75 }}>({counts[s]})</span>
            </button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:9, background:"#fff", border:"1.5px solid rgba(200,148,42,0.18)", borderRadius:10, padding:"8px 14px", minWidth:200, transition:"all 0.2s" }}
          onFocusCapture={e => { e.currentTarget.style.borderColor="#FF6B00"; e.currentTarget.style.boxShadow="0 0 0 3px rgba(255,107,0,0.08)"; }}
          onBlurCapture={e  => { e.currentTarget.style.borderColor="rgba(200,148,42,0.18)"; e.currentTarget.style.boxShadow="none"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A92A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, area, purpose…" style={{ background:"transparent", border:"none", outline:"none", fontSize:13, color:"#1A2545", width:"100%", fontFamily:"'Poppins',sans-serif" }} />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign:"center", padding:"52px 24px" }}>
          <div style={{ width:32, height:32, border:"3px solid rgba(255,107,0,0.15)", borderTopColor:"#FF6B00", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }} />
          <p style={{ color:"#8A92A6", fontSize:13 }}>Loading complaints…</p>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="card" style={{ textAlign:"center", padding:"52px 24px" }}>
          <div style={{ width:56, height:56, borderRadius:16, background:"rgba(200,148,42,0.10)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:26 }}>📅</div>
          <div style={{ fontWeight:600, color:"#1A2545", fontSize:15, marginBottom:6 }}>No complaints found</div>
          <p style={{ color:"#8A92A6", fontSize:13 }}>{search ? `No results for "${search}"` : `No complaints with status "${filterStatus}"`}</p>
        </div>
      )}

      {/* Complaint cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map((c, idx) => {
          const sc   = statusCfg[c.status] || statusCfg.Pending;
          const open = expanded === c.id;
          const d    = new Date(c.complaint_date);

          return (
            <div key={c.id} className="card fade-in-up" style={{ overflow:"hidden", padding:0, animationDelay:`${0.04+idx*0.03}s` }}>
              <div style={{ height:3, background: open ? "linear-gradient(90deg,#C8942A,#E8B84B)" : "transparent", transition:"background 0.2s" }} />

              <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>

                {/* Date badge */}
                <div style={{
                  width:46, height:46, borderRadius:12, flexShrink:0,
                  background:"linear-gradient(135deg,rgba(200,148,42,0.12),rgba(232,184,75,0.10))",
                  border:"1px solid rgba(200,148,42,0.22)",
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                }}>
                  <div style={{ fontSize:16, fontWeight:800, color:"#C8942A", lineHeight:1 }}>{d.getDate()}</div>
                  <div style={{ fontSize:8.5, fontWeight:700, color:"#8A92A6", textTransform:"uppercase", letterSpacing:0.5 }}>
                    {d.toLocaleString("en-IN",{ month:"short" })}
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex:1, minWidth:180 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#1A2545", marginBottom:3 }}>{c.full_name}</div>
                  <div style={{ fontSize:12, color:"#8A92A6", display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                    <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {c.time}
                    </span>
                    <span>·</span>
                    <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {c.area}
                    </span>
                    <span>·</span>
                    <span>{c.mobile}</span>
                  </div>
                </div>

                {/* Purpose pill */}
                <div className="hide-sm" style={{ fontSize:12, color:"#4A5578", background:"#F8F6F2", border:"1px solid rgba(200,148,42,0.14)", borderRadius:8, padding:"5px 12px", flexShrink:0, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {c.purpose}
                </div>

                {/* Status */}
                {isAdmin ? (
                  <select value={c.status} disabled={statusBusy[c.id]} onChange={e => changeStatus(c.id, e.target.value)} style={{ padding:"6px 10px", borderRadius:9, border:"1.5px solid rgba(200,148,42,0.20)", fontSize:12, fontWeight:600, cursor:"pointer", outline:"none", fontFamily:"'Poppins',sans-serif", flexShrink:0, background:"#fff", color:sc.text }}>
                    {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:sc.bg, color:sc.text, border:`1px solid ${sc.border}`, fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20 }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", background:sc.dot }} />{c.status}
                  </span>
                )}

                {/* Expand */}
                <button onClick={() => setExpanded(open ? null : c.id)} style={{
                  padding:"7px 16px", borderRadius:9,
                  border:`1.5px solid ${open ? "#C8942A" : "rgba(200,148,42,0.20)"}`,
                  background: open ? "rgba(200,148,42,0.08)" : "#fff",
                  color: open ? "#C8942A" : "#8A92A6",
                  fontSize:12, fontWeight:600, cursor:"pointer", flexShrink:0,
                  transition:"all 0.16s ease", display:"flex", alignItems:"center", gap:6,
                  fontFamily:"'Poppins',sans-serif",
                }}>
                  {open ? (
                    <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>Close</>
                  ) : (
                    <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>Details</>
                  )}
                </button>
              </div>

              {/* Expanded */}
              {open && (
                <div style={{ padding:"0 20px 20px", borderTop:"1px solid rgba(200,148,42,0.12)", animation:"fadeIn 0.2s ease" }}>
                  <div style={{ paddingTop:16, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
                    {[
                      { label:"Full Name",  val:c.full_name },
                      { label:"Mobile",     val:c.mobile },
                      { label:"Area",       val:c.area },
                      { label:"Subject",    val:c.subject },
                      { label:"Date Filed", val:d.toLocaleDateString("en-IN",{ weekday:"long", day:"numeric", month:"long", year:"numeric" }) },
                      { label:"Details",    val:c.details },
                    ].map(({ label, val }) => (
                      <div key={label} style={{ background:"#F8F6F2", borderRadius:10, padding:"12px 14px", border:"1px solid rgba(200,148,42,0.10)" }}>
                        <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"#8A92A6", marginBottom:5 }}>{label}</div>
                        <div style={{ fontSize:13.5, fontWeight:600, color:"#1A2545" }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @media (max-width:700px) {
          div[style*="repeat(4,1fr)"] { grid-template-columns: repeat(2,1fr)!important; }
        }
      `}</style>
    </div>
  );
}