// frontend/src/pages/Notices.jsx
// Uday Sangle — Premium Political Office Management System
// LOGIC: UNCHANGED. Form moved to modal, notices list shown first.

import { useState, useEffect, useRef } from "react";


import api from "../services/api";
import { UPLOADS_URL } from "../services/api";


export default function Notices() {
  const [data,       setData]       = useState([]);
  const [showModal,  setShowModal]  = useState(false);
  const [title,      setTitle]      = useState("");
  const [content,    setContent]    = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [fTitle,     setFTitle]     = useState(false);
  const [fBody,      setFBody]      = useState(false);
  const [attachments,setAttachments]= useState([]);
  const [dragOver,   setDragOver]   = useState(false);
  const fileInputRef = useRef(null);

  const load = async () => {
    try { const res = await api.get("/notices"); setData(res.data); }
    catch { /* silently ignore */ }
  };

  useEffect(() => {
    let cancelled = false;
    api.get("/notices")
      .then(res => { if (!cancelled) setData(res.data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const openModal  = () => { setShowModal(true); setError(""); };
  const closeModal = () => {
    setShowModal(false);
    setTitle(""); setContent(""); setError("");
    attachments.forEach(a => URL.revokeObjectURL(a.preview));
    setAttachments([]);
  };

  const add = async () => {
    if (!title.trim()) return;
    setLoading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("content", content);
      attachments.forEach(a => fd.append("files", a.file));
      await api.post("/notices", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      closeModal();
      load();
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to post notice.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try { await api.delete(`/notices/${id}`); load(); }
    catch { alert("Failed to delete notice."); }
  };

  // Attachment helpers
  const ALLOWED   = ["image/jpeg","image/png","image/gif","image/webp","video/mp4","video/webm","video/quicktime"];
  const MAX_FILES = 4;

  const addFiles = (files) => {
    const valid = Array.from(files).filter(f => ALLOWED.includes(f.type));
    if (!valid.length) return;
    setAttachments(prev => {
      const slots = MAX_FILES - prev.length;
      return [...prev, ...valid.slice(0, slots).map(file => ({
        file, preview: URL.createObjectURL(file),
        type: file.type.startsWith("video") ? "video" : "image",
      }))];
    });
  };

  const removeAttachment = (idx) => {
    setAttachments(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const onDrop = (e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); };

  const NOTICE_COLORS = [
    { bar:"#FF6B00", bg:"rgba(255,107,0,0.06)",  border:"rgba(255,107,0,0.15)" },
    { bar:"#C8942A", bg:"rgba(200,148,42,0.07)", border:"rgba(200,148,42,0.18)" },
    { bar:"#2563EB", bg:"rgba(37,99,235,0.06)",  border:"rgba(37,99,235,0.15)" },
    { bar:"#10B981", bg:"rgba(16,185,129,0.06)", border:"rgba(16,185,129,0.15)" },
  ];

  return (
    <div className="fade-in">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="fade-in-up" style={{ marginBottom:24, display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div className="page-eyebrow">Notices Board</div>
          <h1 className="page-title">Notice</h1>
          <p className="page-sub">Post and manage public notices for your constituency.</p>
        </div>

        {/* Post Notice Button */}
        <button
          onClick={openModal}
          style={{
            marginTop:8,
            padding:"11px 22px", borderRadius:11,
            background:"linear-gradient(135deg,#FF6B00,#C8942A)",
            color:"#fff", border:"none", fontSize:13.5, fontWeight:600,
            cursor:"pointer", fontFamily:"'Poppins',sans-serif",
            boxShadow:"0 4px 16px rgba(255,107,0,0.30)",
            display:"flex", alignItems:"center", gap:8, transition:"all 0.18s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(255,107,0,0.40)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(255,107,0,0.30)"; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Post Notice
        </button>
      </div>

      {/* ── Notices count bar ───────────────────────────────────────────────── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ fontSize:13, fontWeight:600, color:"#1A2545" }}>All Notices</div>
          <div style={{ background:"rgba(255,107,0,0.10)", border:"1px solid rgba(255,107,0,0.20)", borderRadius:20, padding:"2px 10px", fontSize:12, fontWeight:700, color:"#FF6B00" }}>
            {data.length}
          </div>
        </div>
        <div style={{ fontSize:12, color:"#8A92A6" }}>Most recent first</div>
      </div>

      {/* ── Empty state ─────────────────────────────────────────────────────── */}
      {data.length === 0 && (
        <div className="card" style={{ textAlign:"center", padding:"52px 24px" }}>
          <div style={{ width:56, height:56, borderRadius:16, background:"rgba(255,107,0,0.08)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:26 }}>📢</div>
          <div style={{ fontWeight:600, color:"#1A2545", fontSize:15, marginBottom:6 }}>No notices yet</div>
          <p style={{ color:"#8A92A6", fontSize:13, marginBottom:20 }}>Click "Post Notice" to create the first one.</p>
          <button onClick={openModal} style={{
            padding:"10px 22px", borderRadius:10,
            background:"linear-gradient(135deg,#FF6B00,#C8942A)",
            color:"#fff", border:"none", fontSize:13, fontWeight:600,
            cursor:"pointer", fontFamily:"'Poppins',sans-serif",
            boxShadow:"0 4px 14px rgba(255,107,0,0.28)",
          }}>Post First Notice</button>
        </div>
      )}

      {/* ── Notices list ────────────────────────────────────────────────────── */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {data.map((n, i) => {
          const col = NOTICE_COLORS[i % NOTICE_COLORS.length];
          const mediaFiles = n.media ? n.media.split(",").filter(Boolean) : [];
          return (
            <div key={n.id} className="fade-in-up" style={{
              background:"#fff", borderRadius:14,
              border:`1px solid ${col.border}`,
              borderLeft:`3.5px solid ${col.bar}`,
              padding:"18px 20px",
              display:"flex", alignItems:"flex-start", gap:14,
              boxShadow:"0 2px 10px rgba(13,27,62,0.05)",
              transition:"all 0.2s ease",
              animationDelay:`${i*0.04}s`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateX(3px)"; e.currentTarget.style.boxShadow="0 6px 24px rgba(13,27,62,0.09)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateX(0)"; e.currentTarget.style.boxShadow="0 2px 10px rgba(13,27,62,0.05)"; }}
            >
              <div style={{ width:38, height:38, borderRadius:11, background:col.bg, border:`1px solid ${col.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:col.bar }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14.5, fontWeight:700, color:"#1A2545", marginBottom:4, lineHeight:1.3 }}>{n.title}</div>
                {n.content && <p style={{ fontSize:13, color:"#4A5578", margin:"0 0 8px", lineHeight:1.65 }}>{n.content}</p>}

                {mediaFiles.length > 0 && (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                    {mediaFiles.map((fname, mi) => {
                      const url = `${UPLOADS_URL}/${fname}`;
                      const isVideo = /\.(mp4|webm|mov)$/i.test(fname);
                      return isVideo ? (
                        <video key={mi} src={url} controls style={{ height:90, borderRadius:8, border:"1px solid rgba(200,148,42,0.20)", objectFit:"cover", background:"#000", maxWidth:"100%" }} />
                      ) : (
                        <a key={mi} href={url} target="_blank" rel="noreferrer">
                          <img src={url} alt={`attachment-${mi+1}`} style={{ height:90, width:90, borderRadius:8, objectFit:"cover", border:"1px solid rgba(200,148,42,0.20)", display:"block" }} />
                        </a>
                      );
                    })}
                  </div>
                )}

                <div style={{ fontSize:11, color:"#8A92A6", display:"flex", alignItems:"center", gap:5 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {new Date(n.created_at).toLocaleDateString("en-IN",{ weekday:"short", day:"numeric", month:"long", year:"numeric" })}
                </div>
              </div>

              <button onClick={() => remove(n.id)} style={{
                width:32, height:32, borderRadius:9, flexShrink:0,
                background:"transparent", border:"1px solid rgba(200,148,42,0.15)",
                color:"#8A92A6", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all 0.18s", marginTop:2,
              }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(239,68,68,0.08)"; e.currentTarget.style.borderColor="rgba(239,68,68,0.30)"; e.currentTarget.style.color="#EF4444"; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="rgba(200,148,42,0.15)"; e.currentTarget.style.color="#8A92A6"; }}
                title="Delete notice"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Modal Overlay ───────────────────────────────────────────────────── */}
      {showModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          style={{
            position:"fixed", inset:0, zIndex:1000,
            background:"rgba(13,27,62,0.45)",
            backdropFilter:"blur(4px)",
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:"20px",
            animation:"fadeIn 0.18s ease",
          }}
        >
          <div style={{
            background:"#fff", borderRadius:18, width:"100%", maxWidth:560,
            maxHeight:"90vh", overflowY:"auto",
            boxShadow:"0 24px 64px rgba(13,27,62,0.18)",
            position:"relative", overflow:"hidden",
            animation:"slideUp 0.22s ease",
          }}>
            {/* Top accent */}
            <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#FF6B00,#C8942A,transparent)" }} />

            {/* Modal header */}
            <div style={{ padding:"24px 24px 0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#FF6B00,#C8942A)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 3px 12px rgba(255,107,0,0.28)" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#1A2545" }}>Post a New Notice</div>
                  <div style={{ fontSize:12, color:"#8A92A6" }}>Visible to all staff members</div>
                </div>
              </div>
              {/* Close button */}
              <button onClick={closeModal} style={{
                width:32, height:32, borderRadius:8, border:"1px solid rgba(200,148,42,0.20)",
                background:"#FAFAF8", color:"#8A92A6", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(239,68,68,0.08)"; e.currentTarget.style.color="#EF4444"; e.currentTarget.style.borderColor="rgba(239,68,68,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="#FAFAF8"; e.currentTarget.style.color="#8A92A6"; e.currentTarget.style.borderColor="rgba(200,148,42,0.20)"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding:"20px 24px 24px", display:"flex", flexDirection:"column", gap:14 }}>

              {/* Title */}
              <div>
                <label style={{ fontSize:11, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"#1A2545", display:"block", marginBottom:7 }}>
                  Notice Title <span style={{ color:"#FF6B00" }}>*</span>
                </label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onFocus={() => setFTitle(true)}
                  onBlur={() => setFTitle(false)}
                  onKeyDown={e => e.key==="Enter" && !e.shiftKey && add()}
                  placeholder="e.g. Office closed on 15th August"
                  autoFocus
                  style={{
                    width:"100%", boxSizing:"border-box",
                    padding:"11px 14px", borderRadius:10,
                    border:`1.5px solid ${fTitle ? "#FF6B00" : "rgba(200,148,42,0.20)"}`,
                    background: fTitle ? "#fff" : "#FAFAF8",
                    fontSize:14, color:"#1A2545", outline:"none",
                    fontFamily:"'Poppins',sans-serif", transition:"all 0.18s",
                    boxShadow: fTitle ? "0 0 0 3px rgba(255,107,0,0.08)" : "none",
                  }}
                />
              </div>

              {/* Details */}
              <div>
                <label style={{ fontSize:11, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"#1A2545", display:"block", marginBottom:7 }}>
                  Details <span style={{ color:"#8A92A6", fontWeight:400, textTransform:"none", letterSpacing:0 }}>(optional)</span>
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  onFocus={() => setFBody(true)}
                  onBlur={() => setFBody(false)}
                  placeholder="Add more details about this notice…"
                  rows={3}
                  style={{
                    width:"100%", boxSizing:"border-box",
                    padding:"11px 14px", borderRadius:10,
                    border:`1.5px solid ${fBody ? "#FF6B00" : "rgba(200,148,42,0.20)"}`,
                    background: fBody ? "#fff" : "#FAFAF8",
                    fontSize:14, color:"#1A2545", outline:"none",
                    fontFamily:"'Poppins',sans-serif", resize:"vertical",
                    lineHeight:1.65, transition:"all 0.18s",
                    boxShadow: fBody ? "0 0 0 3px rgba(255,107,0,0.08)" : "none",
                  }}
                />
              </div>

              {/* Attachments */}
              <div>
                <label style={{ fontSize:11, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"#1A2545", display:"block", marginBottom:7 }}>
                  Attachments <span style={{ color:"#8A92A6", fontWeight:400, textTransform:"none", letterSpacing:0 }}>(photos / videos · up to {MAX_FILES})</span>
                </label>

                <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple style={{ display:"none" }}
                  onChange={e => { addFiles(e.target.files); e.target.value = ""; }}
                />

                {attachments.length < MAX_FILES && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    style={{
                      border:`2px dashed ${dragOver ? "#FF6B00" : "rgba(200,148,42,0.30)"}`,
                      borderRadius:12, background: dragOver ? "rgba(255,107,0,0.05)" : "#FAFAF8",
                      padding:"18px 16px", display:"flex", flexDirection:"column",
                      alignItems:"center", justifyContent:"center", gap:7,
                      cursor:"pointer", transition:"all 0.18s",
                      boxShadow: dragOver ? "0 0 0 3px rgba(255,107,0,0.10)" : "none",
                    }}
                  >
                    <div style={{ width:38, height:38, borderRadius:11, background:"rgba(255,107,0,0.09)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:13, fontWeight:600, color:"#1A2545" }}>Click to upload or drag &amp; drop</div>
                      <div style={{ fontSize:11, color:"#8A92A6", marginTop:2 }}>JPG, PNG, GIF, WEBP, MP4, WEBM · Max {MAX_FILES} files</div>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <span style={{ fontSize:11, fontWeight:600, color:"#FF6B00", background:"rgba(255,107,0,0.10)", borderRadius:20, padding:"3px 11px", display:"flex", alignItems:"center", gap:4 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        Photo
                      </span>
                      <span style={{ fontSize:11, fontWeight:600, color:"#2563EB", background:"rgba(37,99,235,0.10)", borderRadius:20, padding:"3px 11px", display:"flex", alignItems:"center", gap:4 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                        Video
                      </span>
                    </div>
                  </div>
                )}

                {attachments.length > 0 && (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(80px,1fr))", gap:8, marginTop:10 }}>
                    {attachments.map((att, idx) => (
                      <div key={idx} style={{ position:"relative", borderRadius:10, overflow:"hidden", border:"1.5px solid rgba(200,148,42,0.20)", background:"#f4f4f0", aspectRatio:"1", boxShadow:"0 2px 8px rgba(13,27,62,0.07)" }}>
                        {att.type === "image"
                          ? <img src={att.preview} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                          : <video src={att.preview} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} muted />
                        }
                        {att.type === "video" && (
                          <div style={{ position:"absolute", bottom:4, left:4, background:"rgba(0,0,0,0.55)", borderRadius:5, padding:"2px 5px", display:"flex", alignItems:"center", gap:2 }}>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            <span style={{ fontSize:8, color:"#fff", fontWeight:600 }}>VIDEO</span>
                          </div>
                        )}
                        <button onClick={() => removeAttachment(idx)}
                          style={{ position:"absolute", top:3, right:3, width:18, height:18, borderRadius:"50%", background:"rgba(0,0,0,0.55)", border:"none", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0 }}
                          onMouseEnter={e => e.currentTarget.style.background="rgba(239,68,68,0.85)"}
                          onMouseLeave={e => e.currentTarget.style.background="rgba(0,0,0,0.55)"}
                        >
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    ))}
                    {attachments.length < MAX_FILES && (
                      <div onClick={() => fileInputRef.current?.click()}
                        style={{ borderRadius:10, border:"1.5px dashed rgba(200,148,42,0.30)", background:"#FAFAF8", aspectRatio:"1", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", gap:3, transition:"all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor="#FF6B00"; e.currentTarget.style.background="rgba(255,107,0,0.05)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(200,148,42,0.30)"; e.currentTarget.style.background="#FAFAF8"; }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8942A" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        <span style={{ fontSize:9, color:"#8A92A6" }}>Add more</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.22)", borderRadius:9, padding:"10px 14px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span style={{ fontSize:13, color:"#B91C1C" }}>{error}</span>
                </div>
              )}

              {/* Footer */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, paddingTop:4 }}>
                <span style={{ fontSize:12, color:"#8A92A6" }}>
                  <span style={{ color:"#FF6B00" }}>*</span> Title is required
                </span>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={closeModal} style={{
                    padding:"10px 20px", borderRadius:10, border:"1.5px solid rgba(200,148,42,0.25)",
                    background:"#FAFAF8", color:"#4A5578", fontSize:13, fontWeight:600,
                    cursor:"pointer", fontFamily:"'Poppins',sans-serif", transition:"all 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background="#f0ede8"}
                    onMouseLeave={e => e.currentTarget.style.background="#FAFAF8"}
                  >Cancel</button>
                  <button onClick={add} disabled={loading || !title.trim()} style={{
                    padding:"10px 24px", borderRadius:10,
                    background: loading || !title.trim() ? "rgba(255,107,0,0.40)" : "linear-gradient(135deg,#FF6B00,#C8942A)",
                    color:"#fff", border:"none", fontSize:13.5, fontWeight:600,
                    cursor: loading || !title.trim() ? "not-allowed" : "pointer",
                    fontFamily:"'Poppins',sans-serif", transition:"all 0.18s",
                    boxShadow: loading || !title.trim() ? "none" : "0 4px 16px rgba(255,107,0,0.30)",
                    display:"flex", alignItems:"center", gap:8,
                  }}
                    onMouseEnter={e => { if (!loading && title.trim()) { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(255,107,0,0.40)"; } }}
                    onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(255,107,0,0.30)"; }}
                  >
                    {loading ? (
                      <><div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />Posting…</>
                    ) : (
                      <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Post Notice</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes fadeIn  { from { opacity:0 }            to { opacity:1 } }
        @keyframes slideUp { from { transform:translateY(20px); opacity:0 } to { transform:translateY(0); opacity:1 } }
      `}</style>
    </div>
  );
}
