// frontend/src/pages/Posts.jsx
// Uday Sangle — Office Management System
// Posts page: main_admin can create & delete posts with visibility control.
// staff_admin can only view posts shared with them or public.

import { useEffect, useState } from "react";
import api from "../services/api";



function getUser() {
  try { const u = localStorage.getItem("admin_user"); return u ? JSON.parse(u) : null; }
  catch { return null; }
}

const visCfg = {
  public: { label: "Public",     bg: "rgba(16,185,129,0.10)",  text: "#065F46", dot: "#10B981", border: "rgba(16,185,129,0.28)",  icon: "🌐" },
  admin:  { label: "Admin Only", bg: "rgba(220,38,38,0.09)",   text: "#B91C1C", dot: "#EF4444", border: "rgba(220,38,38,0.28)",   icon: "🔒" },
  staff:  { label: "Staff",      bg: "rgba(37,99,235,0.09)",   text: "#1E40AF", dot: "#3B82F6", border: "rgba(37,99,235,0.28)",   icon: "👥" },
};

export default function Posts() {
  const user    = getUser();
  const isAdmin = user?.role === "main_admin";

  const [posts,      setPosts]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [delBusy,    setDelBusy]    = useState({});
  const [confirmDel, setConfirmDel] = useState(null);
  const [search,     setSearch]     = useState("");
  const [filterVis,  setFilterVis]  = useState("All");

  // Create form state (admin only)
  const [title,      setTitle]      = useState("");
  const [content,    setContent]    = useState("");
  const [visibility, setVisibility] = useState("public");
  const [saving,     setSaving]     = useState(false);
  const [formErr,    setFormErr]    = useState("");
  const [formOk,     setFormOk]     = useState("");
  const [showForm,   setShowForm]   = useState(false);

  const load = () => {
    setLoading(true);
    api.get(`/posts?role=${user?.role || "public"}`)
      .then(res => setPosts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const createPost = async () => {
    setFormErr(""); setFormOk("");
    if (!title.trim()) { setFormErr("Title is required."); return; }
    setSaving(true);
    try {
      await api.post(`/posts`, {
        title: title.trim(),
        content: content.trim(),
        visibility,
        posted_by: user?.username || "admin",
      });
      setFormOk("Post created successfully!");
      setTitle(""); setContent(""); setVisibility("public");
      setShowForm(false);
      load();
    } catch (err) {
      setFormErr(err.response?.data?.error || "Failed to create post.");
    } finally { setSaving(false); }
  };

  const deletePost = async (id) => {
    setDelBusy(p => ({ ...p, [id]: true }));
    setConfirmDel(null);
    try {
      await api.delete(`/posts/${id}`);
      setPosts(p => p.filter(x => x.id !== id));
    } catch { alert("Failed to delete post."); }
    finally { setDelBusy(p => ({ ...p, [id]: false })); }
  };

  const filtered = posts
    .filter(p => filterVis === "All" || p.visibility === filterVis)
    .filter(p => !search.trim() ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.content?.toLowerCase().includes(search.toLowerCase()) ||
      p.posted_by?.toLowerCase().includes(search.toLowerCase())
    );

  const counts = {
    All:    posts.length,
    public: posts.filter(p => p.visibility === "public").length,
    admin:  posts.filter(p => p.visibility === "admin").length,
    staff:  posts.filter(p => p.visibility === "staff").length,
  };

  return (
    <div className="fade-in">
      <style>{`
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }

        .post-card {
          background:#fff; border-radius:16px;
          border:1px solid rgba(200,148,42,0.14);
          box-shadow:0 2px 12px rgba(13,27,62,0.06);
          padding:0; overflow:hidden;
          transition:box-shadow 0.2s ease, transform 0.2s ease;
        }
        .post-card:hover { box-shadow:0 8px 32px rgba(13,27,62,0.11); transform:translateY(-2px); }

        .vis-btn {
          display:inline-flex; align-items:center; gap:7px;
          padding:9px 18px; border-radius:10px; border:1.5px solid transparent;
          font-size:13px; font-weight:600; cursor:pointer;
          font-family:'Poppins',sans-serif; transition:all 0.18s ease;
        }
        .del-modal-overlay {
          position:fixed; inset:0; background:rgba(13,27,62,0.55);
          z-index:1000; display:flex; align-items:center; justify-content:center;
          animation:fadeIn 0.15s ease; backdrop-filter:blur(3px);
        }
        .del-modal {
          background:#fff; border-radius:20px; padding:32px 28px;
          max-width:400px; width:90%; box-shadow:0 24px 80px rgba(13,27,62,0.22);
          border:1px solid rgba(200,148,42,0.15);
          animation:scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        .form-panel {
          background:#fff; border-radius:16px;
          border:1px solid rgba(255,107,0,0.20);
          box-shadow:0 4px 24px rgba(255,107,0,0.10);
          padding:24px 26px; margin-bottom:22px;
          animation:fadeUp 0.3s ease;
        }
        textarea.input-f { resize:vertical; min-height:90px; line-height:1.65; }
        @media (max-width:700px) {
          .post-meta-row { flex-direction:column !important; align-items:flex-start !important; }
        }
      `}</style>

      {/* ── Delete Confirm Modal ── */}
      {confirmDel !== null && (
        <div className="del-modal-overlay" onClick={() => setConfirmDel(null)}>
          <div className="del-modal" onClick={e => e.stopPropagation()}>
            <div style={{ width:52, height:52, borderRadius:16, background:"rgba(220,38,38,0.08)", border:"1px solid rgba(220,38,38,0.20)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", color:"#DC2626" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:"#1A2545", textAlign:"center", marginBottom:10 }}>Delete Post?</h3>
            <p style={{ fontSize:13.5, color:"#8A92A6", textAlign:"center", lineHeight:1.65, marginBottom:24 }}>
              This will permanently remove the post. This action <strong style={{ color:"#1A2545" }}>cannot be undone</strong>.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setConfirmDel(null)} style={{ flex:1, padding:"11px", borderRadius:10, border:"1.5px solid rgba(200,148,42,0.20)", background:"#fff", color:"#4A5578", fontSize:13.5, fontWeight:600, cursor:"pointer", fontFamily:"'Poppins',sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.background="#F8F6F2"}
                onMouseLeave={e => e.currentTarget.style.background="#fff"}
              >Cancel</button>
              <button onClick={() => deletePost(confirmDel)} disabled={delBusy[confirmDel]} style={{ flex:1, padding:"11px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#DC2626,#EF4444)", color:"#fff", fontSize:13.5, fontWeight:700, cursor:"pointer", fontFamily:"'Poppins',sans-serif", boxShadow:"0 4px 16px rgba(220,38,38,0.30)", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                {delBusy[confirmDel]
                  ? <div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
                  : "Yes, Delete"
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="fade-in-up" style={{ marginBottom:24, display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div className="page-eyebrow">Communications</div>
          <h1 className="page-title">Posts</h1>
          <p className="page-sub">
            {isAdmin
              ? "Create and manage posts. Choose who can see each post — Public, Staff, or Admin only."
              : "View posts and announcements shared with you."}
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => { setShowForm(f => !f); setFormErr(""); setFormOk(""); }} style={{
            display:"inline-flex", alignItems:"center", gap:8,
            padding:"10px 20px", borderRadius:11, border:"none",
            background: showForm ? "rgba(255,107,0,0.10)" : "linear-gradient(135deg,#FF6B00,#C8942A)",
            color: showForm ? "#FF6B00" : "#fff",
            fontSize:13.5, fontWeight:600, cursor:"pointer",
            fontFamily:"'Poppins',sans-serif",
            boxShadow: showForm ? "none" : "0 4px 16px rgba(255,107,0,0.28)",
            borders: showForm ? "1.5px solid rgba(255,107,0,0.28)" : "none",
            transition:"all 0.18s",
          }}>
            {showForm ? (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Cancel</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>New Post</>
            )}
          </button>
        )}
      </div>

      {/* ── Create Form (admin only) ── */}
      {isAdmin && showForm && (
        <div className="form-panel">
          <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:1.8, textTransform:"uppercase", color:"#FF6B00", marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:14, height:1.5, background:"#FF6B00", borderRadius:1 }} />
            Create New Post
          </div>

          {formErr && (
            <div style={{ background:"rgba(220,38,38,0.08)", border:"1px solid rgba(220,38,38,0.25)", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#B91C1C", marginBottom:14 }}>
              {formErr}
            </div>
          )}
          {formOk && (
            <div style={{ background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.25)", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#065F46", marginBottom:14 }}>
              {formOk}
            </div>
          )}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ fontSize:11.5, fontWeight:600, color:"#4A5578", display:"block", marginBottom:6 }}>Post Title *</label>
              <input className="input-f" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Enter post title…" />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ fontSize:11.5, fontWeight:600, color:"#4A5578", display:"block", marginBottom:6 }}>Content</label>
              <textarea className="input-f" value={content} onChange={e => setContent(e.target.value)}
                placeholder="Write the post content here…" />
            </div>
          </div>

          {/* Visibility selector */}
          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:11.5, fontWeight:600, color:"#4A5578", display:"block", marginBottom:10 }}>Visible To *</label>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              {[
                { val:"public", label:"🌐 Public",     desc:"Everyone (including public homepage)" },
                { val:"admin",  label:"🔒 Admin Only", desc:"Only Main Admin can see this" },
                { val:"staff",  label:"👥 Staff",      desc:"Staff admins and Main Admin" },
              ].map(opt => (
                <button key={opt.val} onClick={() => setVisibility(opt.val)} style={{
                  padding:"10px 18px", borderRadius:11, cursor:"pointer",
                  fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:600,
                  border: visibility === opt.val ? `2px solid ${visCfg[opt.val].dot}` : "1.5px solid rgba(200,148,42,0.20)",
                  background: visibility === opt.val ? visCfg[opt.val].bg : "#F8F6F2",
                  color: visibility === opt.val ? visCfg[opt.val].text : "#4A5578",
                  boxShadow: visibility === opt.val ? `0 2px 10px ${visCfg[opt.val].border}` : "none",
                  transition:"all 0.18s",
                }}>
                  {opt.label}
                  <div style={{ fontSize:10.5, fontWeight:400, color: visibility === opt.val ? visCfg[opt.val].text : "#8A92A6", marginTop:2, opacity:0.85 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
            <button onClick={() => { setShowForm(false); setTitle(""); setContent(""); setVisibility("public"); setFormErr(""); }} style={{ padding:"10px 22px", borderRadius:10, border:"1.5px solid rgba(200,148,42,0.20)", background:"#fff", color:"#4A5578", fontSize:13.5, fontWeight:600, cursor:"pointer", fontFamily:"'Poppins',sans-serif" }}>
              Cancel
            </button>
            <button className="btn-saff" onClick={createPost} disabled={saving} style={{ opacity:saving?0.7:1, cursor:saving?"not-allowed":"pointer", display:"inline-flex", alignItems:"center", gap:8 }}>
              {saving
                ? <><div style={{ width:13, height:13, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />Publishing…</>
                : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Publish Post</>
              }
            </button>
          </div>
        </div>
      )}

      {/* ── Filter + Search bar ── */}
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", flex:1 }}>
          {(isAdmin ? ["All","public","admin","staff"] : ["All","public","staff"]).map(v => {
            const cfg = v === "All" ? null : visCfg[v];
            const active = filterVis === v;
            return (
              <button key={v} onClick={() => setFilterVis(v)} style={{
                padding:"7px 16px", borderRadius:9999,
                border:`1.5px solid ${active ? (cfg?.dot || "#FF6B00") : "rgba(200,148,42,0.20)"}`,
                background: active ? (v === "All" ? "linear-gradient(135deg,#FF6B00,#C8942A)" : cfg.bg) : "#fff",
                color: active ? (v === "All" ? "#fff" : cfg.text) : "#4A5578",
                fontSize:12.5, fontWeight: active ? 700 : 400, cursor:"pointer",
                transition:"all 0.16s ease", fontFamily:"'Poppins',sans-serif",
                boxShadow: active && v === "All" ? "0 3px 12px rgba(255,107,0,0.28)" : "none",
              }}>
                {v === "All" ? `All (${counts.All})` : `${cfg.icon} ${cfg.label} (${counts[v]})`}
              </button>
            );
          })}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:9, background:"#fff", border:"1.5px solid rgba(200,148,42,0.18)", borderRadius:10, padding:"8px 14px", minWidth:220 }}
          onFocusCapture={e => { e.currentTarget.style.borderColor="#FF6B00"; e.currentTarget.style.boxShadow="0 0 0 3px rgba(255,107,0,0.08)"; }}
          onBlurCapture={e  => { e.currentTarget.style.borderColor="rgba(200,148,42,0.18)"; e.currentTarget.style.boxShadow="none"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8A92A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts…" style={{ background:"transparent", border:"none", outline:"none", fontSize:13, color:"#1A2545", width:"100%", fontFamily:"'Poppins',sans-serif" }} />
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div style={{ textAlign:"center", padding:"52px 24px" }}>
          <div style={{ width:32, height:32, border:"3px solid rgba(255,107,0,0.15)", borderTopColor:"#FF6B00", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }} />
          <p style={{ color:"#8A92A6", fontSize:13 }}>Loading posts…</p>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && filtered.length === 0 && (
        <div className="card" style={{ textAlign:"center", padding:"56px 24px" }}>
          <div style={{ width:60, height:60, borderRadius:18, background:"rgba(255,107,0,0.08)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:28 }}>📢</div>
          <div style={{ fontWeight:600, color:"#1A2545", fontSize:15, marginBottom:6 }}>No posts found</div>
          <p style={{ color:"#8A92A6", fontSize:13 }}>
            {isAdmin ? "Create the first post using the \"New Post\" button above." : "No posts have been shared with you yet."}
          </p>
        </div>
      )}

      {/* ── Post Cards ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {filtered.map((post, idx) => {
          const vc = visCfg[post.visibility] || visCfg.public;
          return (
            <div key={post.id} className="post-card fade-in-up" style={{ animationDelay:`${0.04+idx*0.03}s` }}>

              {/* Coloured top stripe by visibility */}
              <div style={{ height:3, background:
                post.visibility === "public" ? "linear-gradient(90deg,#10B981,#34D399)" :
                post.visibility === "admin"  ? "linear-gradient(90deg,#DC2626,#EF4444)" :
                                               "linear-gradient(90deg,#2563EB,#60A5FA)"
              }} />

              <div style={{ padding:"18px 22px" }}>
                {/* Header row */}
                <div className="post-meta-row" style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:12, flexWrap:"wrap" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:16, fontWeight:700, color:"#1A2545", lineHeight:1.35, marginBottom:6 }}>{post.title}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                      {/* Visibility badge */}
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:vc.bg, color:vc.text, border:`1px solid ${vc.border}`, fontSize:11.5, fontWeight:700, padding:"4px 11px", borderRadius:20 }}>
                        <span style={{ width:5, height:5, borderRadius:"50%", background:vc.dot }} />
                        {vc.icon} {vc.label}
                      </span>
                      {/* Posted by */}
                      <span style={{ fontSize:12, color:"#8A92A6", display:"flex", alignItems:"center", gap:4 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        {post.posted_by}
                      </span>
                      {/* Date */}
                      <span style={{ fontSize:12, color:"#8A92A6", display:"flex", alignItems:"center", gap:4 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {new Date(post.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                      </span>
                    </div>
                  </div>

                  {/* Delete button (admin only) */}
                  {isAdmin && (
                    <button onClick={() => setConfirmDel(post.id)} disabled={delBusy[post.id]} style={{
                      display:"inline-flex", alignItems:"center", gap:6,
                      padding:"7px 14px", borderRadius:9, border:"1.5px solid rgba(220,38,38,0.25)",
                      background:"rgba(220,38,38,0.06)", color:"#DC2626",
                      fontSize:12, fontWeight:600, cursor:"pointer",
                      fontFamily:"'Poppins',sans-serif", transition:"all 0.16s", flexShrink:0,
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background="rgba(220,38,38,0.14)"; e.currentTarget.style.borderColor="rgba(220,38,38,0.45)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="rgba(220,38,38,0.06)"; e.currentTarget.style.borderColor="rgba(220,38,38,0.25)"; }}
                    >
                      {delBusy[post.id]
                        ? <div style={{ width:12, height:12, border:"2px solid rgba(220,38,38,0.3)", borderTopColor:"#DC2626", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
                        : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                      }
                      Delete
                    </button>
                  )}
                </div>

                {/* Content */}
                {post.content && (
                  <div style={{ fontSize:13.5, color:"#4A5578", lineHeight:1.75, background:"#F8F6F2", borderRadius:11, padding:"14px 16px", border:"1px solid rgba(200,148,42,0.10)", whiteSpace:"pre-wrap" }}>
                    {post.content}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
