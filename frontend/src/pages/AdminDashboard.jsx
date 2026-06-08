// frontend/src/pages/AdminDashboard.jsx
// BJP Shinde Group — Premium Political Office Management System
// CHANGE: Full complaint detail panel + Confirm / Mark Done / Delete actions.
// All existing logic (status patch, entries, filters, search) UNCHANGED.

import { useEffect, useState } from "react";
import axios from "axios";

function getUser() {
  try { const u = localStorage.getItem("admin_user"); return u ? JSON.parse(u) : null; }
  catch { return null; }
}

const STATUS_OPTIONS = ["Pending", "Approved", "Done"];

const statusCfg = {
  Pending:  { bg:"rgba(245,158,11,0.10)",  text:"#B45309", dot:"#F59E0B", border:"rgba(245,158,11,0.28)" },
  Approved: { bg:"rgba(16,185,129,0.10)",  text:"#065F46", dot:"#10B981", border:"rgba(16,185,129,0.28)" },
  Done:     { bg:"rgba(59,130,246,0.10)",  text:"#1E40AF", dot:"#3B82F6", border:"rgba(59,130,246,0.28)" },
};

/* ── Sub-entries panel — UNCHANGED ─────────────────────────── */
const EntriesPanel = ({ complaintId, username }) => {
  const [entries, setEntries] = useState([]);
  const [note,    setNote]    = useState("");
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    let cancelled = false;
    axios.get(`http://localhost:5000/api/complaints/${complaintId}/entries`)
      .then(res => { if (!cancelled) setEntries(res.data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [complaintId]);

  const addEntry = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      await axios.post(`http://localhost:5000/api/complaints/${complaintId}/entries`, {
        entry_note: note, added_by: username,
      });
      setNote("");
      const res = await axios.get(`http://localhost:5000/api/complaints/${complaintId}/entries`);
      setEntries(res.data);
    } catch { alert("Failed to add entry."); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ background:"#F8F6F2", borderRadius:12, padding:"16px 18px", border:"1px solid rgba(200,148,42,0.14)", marginTop:16 }}>
      <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#FF6B00", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:14, height:1.5, background:"#FF6B00", borderRadius:1 }} />
        Sub-Entries &amp; Updates
      </div>
      {entries.length === 0 && <p style={{ fontSize:13, color:"#8A92A6", marginBottom:12 }}>No updates added yet.</p>}
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
        {entries.map(e => (
          <div key={e.id} style={{ background:"#fff", borderRadius:9, padding:"10px 14px", border:"1px solid rgba(200,148,42,0.12)", borderLeft:"3px solid #FF6B00" }}>
            <p style={{ fontSize:13, color:"#1A2545", margin:0, lineHeight:1.55 }}>{e.entry_note}</p>
            <p style={{ fontSize:11, color:"#8A92A6", margin:"5px 0 0" }}>
              By {e.added_by} · {new Date(e.created_at).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <input className="input-f" value={note} onChange={e => setNote(e.target.value)} onKeyDown={e => e.key==="Enter" && addEntry()} placeholder="Add an update or note…" style={{ flex:1 }} />
        <button className="btn-saff" onClick={addEntry} disabled={saving} style={{ opacity:saving?0.7:1, cursor:saving?"not-allowed":"pointer" }}>
          {saving ? "…" : "REPLY"}
        </button>
      </div>
    </div>
  );
};

/* ── Detail field row ───────────────────────────────────────── */
const DetailRow = ({ label, value, mono }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
    <span style={{ fontSize:9.5, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#8A92A6" }}>{label}</span>
    <span style={{ fontSize:13.5, color:"#1A2545", fontWeight:500, fontFamily: mono ? "monospace" : "inherit", lineHeight:1.5 }}>{value || "—"}</span>
  </div>
);

/* ── Main Component ─────────────────────────────────────────── */
export default function AdminDashboard() {
  const [complaints,   setComplaints]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [expanded,     setExpanded]     = useState(null);
  const [statusBusy,   setStatusBusy]   = useState({});
  const [deleteBusy,   setDeleteBusy]   = useState({});
  const [filterStatus, setFilterStatus] = useState("All");
  const [search,       setSearch]       = useState("");
  const [confirmDel,   setConfirmDel]   = useState(null); // id awaiting delete confirm

  const user    = getUser();
  const isAdmin = user?.role === "main_admin";

  /* ── Fetch complaints — UNCHANGED ── */
  useEffect(() => {
    let cancelled = false;
    axios.get("http://localhost:5000/api/complaints")
      .then(res => { if (!cancelled) setComplaints(res.data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  /* ── Status change — UNCHANGED ── */
  const changeStatus = async (id, newStatus) => {
    setStatusBusy(prev => ({ ...prev, [id]: true }));
    try {
      await axios.patch(`http://localhost:5000/api/complaints/${id}/status`, { status: newStatus });
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch { alert("Failed to update status."); }
    finally { setStatusBusy(prev => ({ ...prev, [id]: false })); }
  };

  /* ── Delete complaint ── */
  const deleteComplaint = async (id) => {
    setDeleteBusy(prev => ({ ...prev, [id]: true }));
    setConfirmDel(null);
    try {
      await axios.delete(`http://localhost:5000/api/complaints/${id}`);
      setComplaints(prev => prev.filter(c => c.id !== id));
      if (expanded === id) setExpanded(null);
    } catch { alert("Failed to delete complaint."); }
    finally { setDeleteBusy(prev => ({ ...prev, [id]: false })); }
  };

  /* ── Filters — UNCHANGED ── */
  const filtered = complaints
    .filter(c => filterStatus === "All" || c.status === filterStatus)
    .filter(c => !search.trim() ||
      c.subject?.toLowerCase().includes(search.toLowerCase()) ||
      c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.area?.toLowerCase().includes(search.toLowerCase())
    );

  const counts = {
    All:      complaints.length,
    Pending:  complaints.filter(c => c.status === "Pending").length,
    Approved: complaints.filter(c => c.status === "Approved").length,
    Done:     complaints.filter(c => c.status === "Done").length,
  };

  return (
    <div className="fade-in">
      <style>{`
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }

        .action-btn {
          display:inline-flex; align-items:center; gap:7px;
          padding:9px 18px; border-radius:9px; border:none;
          font-size:12.5px; font-weight:700; cursor:pointer;
          font-family:'Poppins',sans-serif; transition:all 0.18s ease;
          letter-spacing:0.2px; white-space:nowrap;
        }
        .action-btn:hover:not(:disabled) { transform:translateY(-1px); }
        .action-btn:disabled { opacity:0.55; cursor:not-allowed; }

        .btn-confirm { background:linear-gradient(135deg,#059669,#10B981); color:#fff; box-shadow:0 3px 12px rgba(5,150,105,0.28); }
        .btn-confirm:hover:not(:disabled) { box-shadow:0 6px 20px rgba(5,150,105,0.40); }

        .btn-done { background:linear-gradient(135deg,#2563EB,#3B82F6); color:#fff; box-shadow:0 3px 12px rgba(37,99,235,0.28); }
        .btn-done:hover:not(:disabled) { box-shadow:0 6px 20px rgba(37,99,235,0.40); }

        .btn-delete { background:rgba(220,38,38,0.08); color:#DC2626; border:1.5px solid rgba(220,38,38,0.28)!important; }
        .btn-delete:hover:not(:disabled) { background:rgba(220,38,38,0.15); border-color:rgba(220,38,38,0.45)!important; }

        .btn-pending { background:rgba(245,158,11,0.10); color:#B45309; border:1.5px solid rgba(245,158,11,0.30)!important; }
        .btn-pending:hover:not(:disabled) { background:rgba(245,158,11,0.18); }

        .detail-grid {
          display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr));
          gap:16px 24px;
        }
        .detail-box {
          background:#F8F6F2; border-radius:11px; padding:13px 15px;
          border:1px solid rgba(200,148,42,0.12);
        }

        /* Delete confirmation modal */
        .del-modal-overlay {
          position:fixed; inset:0; background:rgba(13,27,62,0.55);
          z-index:1000; display:flex; align-items:center; justify-content:center;
          animation:fadeIn 0.15s ease;
          backdrop-filter:blur(3px);
        }
        .del-modal {
          background:#fff; border-radius:20px; padding:32px 28px;
          max-width:400px; width:90%; box-shadow:0 24px 80px rgba(13,27,62,0.22);
          border:1px solid rgba(200,148,42,0.15);
          animation:scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }

        @media (max-width:700px) {
          .stats-4 { grid-template-columns:repeat(2,1fr)!important; }
          .detail-grid { grid-template-columns:1fr 1fr!important; }
          .action-row { flex-direction:column!important; align-items:stretch!important; }
          .action-row .action-btn { justify-content:center; }
        }
        @media (max-width:480px) {
          .detail-grid { grid-template-columns:1fr!important; }
        }
      `}</style>

      {/* ── Delete confirmation modal ── */}
      {confirmDel !== null && (
        <div className="del-modal-overlay" onClick={() => setConfirmDel(null)}>
          <div className="del-modal" onClick={e => e.stopPropagation()}>
            <div style={{ width:52, height:52, borderRadius:16, background:"rgba(220,38,38,0.08)", border:"1px solid rgba(220,38,38,0.20)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", color:"#DC2626" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:"#1A2545", textAlign:"center", marginBottom:10 }}>Delete Complaint?</h3>
            <p style={{ fontSize:13.5, color:"#8A92A6", textAlign:"center", lineHeight:1.65, marginBottom:24 }}>
              This will permanently remove the complaint and all its sub-entries. This action <strong style={{ color:"#1A2545" }}>cannot be undone</strong>.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setConfirmDel(null)} style={{ flex:1, padding:"11px", borderRadius:10, border:"1.5px solid rgba(200,148,42,0.20)", background:"#fff", color:"#4A5578", fontSize:13.5, fontWeight:600, cursor:"pointer", fontFamily:"'Poppins',sans-serif", transition:"all 0.18s" }}
                onMouseEnter={e => e.currentTarget.style.background="#F8F6F2"}
                onMouseLeave={e => e.currentTarget.style.background="#fff"}
              >Cancel</button>
              <button onClick={() => deleteComplaint(confirmDel)} disabled={deleteBusy[confirmDel]} style={{ flex:1, padding:"11px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#DC2626,#EF4444)", color:"#fff", fontSize:13.5, fontWeight:700, cursor:"pointer", fontFamily:"'Poppins',sans-serif", boxShadow:"0 4px 16px rgba(220,38,38,0.30)", transition:"all 0.18s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
                onMouseEnter={e => { if (!deleteBusy[confirmDel]) e.currentTarget.style.transform="translateY(-1px)"; }}
                onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
              >
                {deleteBusy[confirmDel] ? (
                  <><div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} /> Deleting…</>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="fade-in-up" style={{ marginBottom:24 }}>
        <div className="page-eyebrow">{isAdmin ? "Main Admin Panel" : "Staff Panel"}</div>
        <h1 className="page-title">Complaints Management</h1>
        <p className="page-sub">
          {isAdmin
            ? "Full access — view complete details, confirm, mark done, or delete complaints."
            : "View complaint details and add updates or entries."}
        </p>
      </div>

      {/* ── Stats strip ── */}
      <div className="stats-4 fade-in-up stagger" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:22 }}>
        {[
          { label:"Total",    val:counts.All,       gradient:"linear-gradient(135deg,#0D1B3E,#162347)", shadow:"rgba(13,27,62,0.22)" },
          { label:"Pending",  val:counts.Pending,   gradient:"linear-gradient(135deg,#D97706,#F59E0B)", shadow:"rgba(217,119,6,0.22)"  },
          { label:"Approved", val:counts.Approved,  gradient:"linear-gradient(135deg,#059669,#10B981)", shadow:"rgba(5,150,105,0.22)"  },
          { label:"Done",     val:counts.Done,      gradient:"linear-gradient(135deg,#2563EB,#3B82F6)", shadow:"rgba(37,99,235,0.22)"  },
        ].map(({ label, val, gradient, shadow }) => (
          <div key={label} style={{ borderRadius:14, padding:"18px 20px", textAlign:"center", background:gradient, boxShadow:`0 4px 18px ${shadow}`, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-16, right:-16, width:60, height:60, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:700, color:"#fff", lineHeight:1 }}>{val}</div>
            <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.65)", fontWeight:700, letterSpacing:0.8, textTransform:"uppercase", marginTop:5 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Filters + Search ── */}
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", flex:1 }}>
          {/* ✅ FIX: spread STATUS_OPTIONS instead of hardcoding the array */}
          {["All", ...STATUS_OPTIONS].map(s => (
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search complaints…" style={{ background:"transparent", border:"none", outline:"none", fontSize:13, color:"#1A2545", width:"100%", fontFamily:"'Poppins',sans-serif" }} />
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div style={{ textAlign:"center", padding:"52px 24px" }}>
          <div style={{ width:32, height:32, border:"3px solid rgba(255,107,0,0.15)", borderTopColor:"#FF6B00", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }} />
          <p style={{ color:"#8A92A6", fontSize:13 }}>Loading complaints…</p>
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && filtered.length === 0 && (
        <div className="card" style={{ textAlign:"center", padding:"52px 24px" }}>
          <div style={{ width:56, height:56, borderRadius:16, background:"rgba(255,107,0,0.08)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:26 }}>📋</div>
          <div style={{ fontWeight:600, color:"#1A2545", fontSize:15, marginBottom:6 }}>No complaints found</div>
          <p style={{ color:"#8A92A6", fontSize:13 }}>{search ? `No results for "${search}"` : `No complaints with status "${filterStatus}"`}</p>
        </div>
      )}

      {/* ── Complaint Cards ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map((c, idx) => {
          const sc   = statusCfg[c.status] || statusCfg.Pending;
          const open = expanded === c.id;
          const busy = statusBusy[c.id];

          return (
            <div key={c.id} className="card fade-in-up" style={{ overflow:"hidden", padding:0, animationDelay:`${0.04+idx*0.03}s` }}>

              {/* Coloured top bar when open */}
              <div style={{ height:3, background: open ? "linear-gradient(90deg,#FF6B00,#C8942A)" : "transparent", transition:"background 0.25s" }} />

              {/* ── Summary row ── */}
              <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>

                {/* ID badge */}
                <div style={{ width:40, height:40, borderRadius:11, flexShrink:0, background:"rgba(255,107,0,0.08)", border:"1px solid rgba(255,107,0,0.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#FF6B00", fontFamily:"monospace" }}>
                  #{c.id}
                </div>

                {/* Subject + meta */}
                <div style={{ flex:1, minWidth:180 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#1A2545", lineHeight:1.3, marginBottom:3 }}>{c.subject}</div>
                  <div style={{ fontSize:12, color:"#8A92A6", display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                    <span style={{ fontWeight:500, color:"#4A5578" }}>{c.full_name}</span>
                    <span>·</span><span>{c.area}</span>
                    <span>·</span>
                    <span style={{ display:"flex", alignItems:"center", gap:3 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {new Date(c.complaint_date).toLocaleDateString("en-IN",{ day:"numeric", month:"short", year:"numeric" })}
                    </span>
                  </div>
                </div>

                {/* Status badge (always visible) */}
                <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:sc.bg, color:sc.text, border:`1px solid ${sc.border}`, fontSize:11.5, fontWeight:700, padding:"5px 12px", borderRadius:20, flexShrink:0 }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:sc.dot }} />{c.status}
                </span>

                {/* Expand/collapse toggle */}
                <button onClick={() => setExpanded(open ? null : c.id)} style={{
                  padding:"7px 16px", borderRadius:9,
                  border:`1.5px solid ${open ? "#FF6B00" : "rgba(200,148,42,0.20)"}`,
                  background: open ? "rgba(255,107,0,0.08)" : "#fff",
                  color: open ? "#FF6B00" : "#8A92A6",
                  fontSize:12, fontWeight:600, cursor:"pointer", flexShrink:0,
                  transition:"all 0.16s ease", display:"flex", alignItems:"center", gap:6,
                  fontFamily:"'Poppins',sans-serif",
                }}>
                  {open
                    ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>Close</>
                    : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>Details</>
                  }
                </button>
              </div>

              {/* ── Expanded detail panel ── */}
              {open && (
                <div style={{ borderTop:"1px solid rgba(200,148,42,0.12)", animation:"fadeIn 0.22s ease", padding:"20px 20px 24px" }}>

                  {/* ──── Full Detail Grid ──── */}
                  <div style={{ marginBottom:18 }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.6, textTransform:"uppercase", color:"#8A92A6", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:16, height:1.5, background:"#8A92A6", borderRadius:1 }} />
                      Complainant Details
                    </div>
                    <div className="detail-grid">
                      <div className="detail-box"><DetailRow label="Full Name"  value={c.full_name} /></div>
                      <div className="detail-box"><DetailRow label="Mobile"     value={`+91 ${c.mobile}`} mono /></div>
                      <div className="detail-box"><DetailRow label="Area / Ward" value={c.area} /></div>
                      <div className="detail-box"><DetailRow label="Date Filed"  value={new Date(c.complaint_date).toLocaleDateString("en-IN",{ weekday:"short", day:"numeric", month:"long", year:"numeric" })} /></div>
                      <div className="detail-box"><DetailRow label="Submitted On" value={new Date(c.created_at).toLocaleString("en-IN",{ day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })} /></div>
                      <div className="detail-box"><DetailRow label="Current Status" value={c.status} /></div>
                    </div>
                  </div>

                  {/* ──── Subject ──── */}
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.6, textTransform:"uppercase", color:"#8A92A6", marginBottom:8, display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:16, height:1.5, background:"#8A92A6", borderRadius:1 }} />
                      Complaint Subject
                    </div>
                    <div style={{ background:"rgba(255,107,0,0.06)", borderRadius:10, padding:"11px 15px", border:"1px solid rgba(255,107,0,0.14)", fontSize:14, fontWeight:600, color:"#1A2545" }}>
                      {c.subject}
                    </div>
                  </div>

                  {/* ──── Full description ──── */}
                  <div style={{ marginBottom:20 }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.6, textTransform:"uppercase", color:"#8A92A6", marginBottom:8, display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:16, height:1.5, background:"#8A92A6", borderRadius:1 }} />
                      Detailed Description
                    </div>
                    <div style={{ background:"#F8F6F2", borderRadius:11, padding:"15px 18px", border:"1px solid rgba(200,148,42,0.12)", fontSize:13.5, color:"#4A5578", lineHeight:1.80, whiteSpace:"pre-wrap" }}>
                      {c.details}
                    </div>
                  </div>

                  {/* ──── Action buttons (admin only for status changes & delete) ──── */}
                  {isAdmin && (
                    <div className="action-row" style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:20, padding:"16px 18px", background:"rgba(13,27,62,0.03)", borderRadius:13, border:"1px solid rgba(200,148,42,0.12)" }}>

                      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"#8A92A6", marginRight:4, flexShrink:0 }}>Actions:</div>

                      {/* Confirm (→ Approved) */}
                      {c.status === STATUS_OPTIONS[0] && (
                        <button className="action-btn btn-confirm" onClick={() => changeStatus(c.id, STATUS_OPTIONS[1])} disabled={busy}>
                          {busy ? <div style={{ width:13, height:13, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} /> : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                          Confirm Complaint
                        </button>
                      )}

                      {/* Mark Done */}
                      {(c.status === STATUS_OPTIONS[0] || c.status === STATUS_OPTIONS[1]) && (
                        <button className="action-btn btn-done" onClick={() => changeStatus(c.id, STATUS_OPTIONS[2])} disabled={busy}>
                          {busy ? <div style={{ width:13, height:13, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} /> : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          )}
                          Mark as Done
                        </button>
                      )}

                      {/* Revert to Pending */}
                      {c.status !== STATUS_OPTIONS[0] && (
                        <button className="action-btn btn-pending" onClick={() => changeStatus(c.id, STATUS_OPTIONS[0])} disabled={busy}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
                          Revert to Pending
                        </button>
                      )}

                      {/* Spacer */}
                      <div style={{ flex:1 }} />

                      {/* Delete */}
                      <button className="action-btn btn-delete" onClick={() => setConfirmDel(c.id)} disabled={deleteBusy[c.id]}>
                        {deleteBusy[c.id] ? <div style={{ width:13, height:13, border:"2px solid rgba(220,38,38,0.3)", borderTopColor:"#DC2626", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} /> : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                        )}
                        Delete
                      </button>
                    </div>
                  )}

                  {/* Staff sees read-only status */}
                  {!isAdmin && (
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:"rgba(13,27,62,0.03)", borderRadius:11, border:"1px solid rgba(200,148,42,0.12)", marginBottom:18 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A92A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <span style={{ fontSize:12.5, color:"#8A92A6" }}>Status changes and deletion are restricted to Main Admin only.</span>
                    </div>
                  )}

                  {/* ──── Sub-entries (staff can add notes) ──── */}
                  <EntriesPanel complaintId={c.id} username={user?.username || "Staff"} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}