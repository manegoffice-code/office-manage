// frontend/src/components/Navbar.jsx  (Sidebar)
// Uday Sangle — Premium Political Office Management System
// LOGIC: UNCHANGED. Only UI redesigned.

import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_LINKS = [
  {
    to: "/dashboard", label: "Dashboard", icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ), roles: ["main_admin","staff_admin"],
  },
  {
    to: "/complaints", label: "Complaints", icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ), roles: ["main_admin","staff_admin"],
  },
  {
    to: "/appointments", label: "Appointments", icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ), roles: ["main_admin","staff_admin"],
  },
  {
    to: "/notices", label: "Notices", icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ), roles: ["main_admin","staff_admin"],
  },
  {
    to: "/admin", label: "Admin Panel", icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ), roles: ["main_admin"],
  },
];

function getUser() {
  try { const u = localStorage.getItem("admin_user"); return u ? JSON.parse(u) : null; }
  catch { return null; }
}

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  const navigate  = useNavigate();
  const user      = getUser();
  const role      = user?.role || "staff_admin";
  const navLinks  = NAV_LINKS.filter(l => l.roles.includes(role));
  const isAdmin   = role === "main_admin";

  const logout = () => {
    localStorage.removeItem("admin_user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.7); }
        }
        .sidebar-link {
          display:flex; align-items:center; gap:11px;
          padding:10px 14px; border-radius:11px; margin-bottom:2px;
          font-size:13.5px; font-weight:400; letter-spacing:0.1px;
          border-left:2px solid transparent;
          transition:all 0.18s cubic-bezier(.4,0,.2,1);
          text-decoration:none; position:relative; overflow:hidden;
          color:rgba(255, 255, 255, 0.79);
        }
        .sidebar-link:hover {
          background:rgba(255,107,0,0.09)!important;
          color:rgb(255, 255, 255)!important;
          border-left-color:rgba(255, 106, 0, 0.51)!important;
        }
        .sidebar-link:hover .s-icon { color:#FF8C38!important; }
        .sidebar-link.active {
          background:rgba(255,107,0,0.14)!important;
          color:#fff!important; font-weight:600!important;
          border-left-color:#FF6B00!important;
        }
        .sidebar-link.active .s-icon { color:#FF6B00!important; }
        .logout-btn {
          width:100%; padding:11px 14px; border-radius:11px;
          background:transparent; border:1px solid rgba(255,255,255,0.08);
          color:rgba(255, 255, 255, 0.78); font-size:13px; font-weight:500;
          cursor:pointer; font-family:'Poppins',sans-serif;
          display:flex; align-items:center; gap:10px;
          transition:all 0.18s ease;
        }
        .logout-btn:hover { background:rgba(220,38,38,0.12); border-color:rgba(220,38,38,0.35); color:#FCA5A5; }
        .sidebar-scroll::-webkit-scrollbar { width:3px; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:3px; }
        @media (max-width:900px) {
          .premium-sidebar { transform:${open ? "translateX(0)" : "translateX(-100%)"}!important; }
        }
      `}</style>

      <aside className="premium-sidebar" style={{
        width:256, minHeight:"100vh",
        position:"fixed", top:0, left:0, zIndex:200,
        display:"flex", flexDirection:"column",
        background:"linear-gradient(180deg,#0D1B3E 0%,#0F1E45 60%,#091530 100%)",
        borderRight:"1px solid rgba(255,255,255,0.07)",
        boxShadow:"6px 0 32px rgba(0,0,0,0.28)",
        transition:"transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        fontFamily:"'Poppins',sans-serif",
      }}>
        {/* Top saffron stripe */}
        <div style={{ height:3, background:"linear-gradient(90deg,#FF6B00,#C8942A,transparent)" }} />

        {/* Brand */}
        <div style={{ padding:"22px 20px 18px", borderBottom:"1px solid rgba(255,255,255,0.07)", position:"relative" }}>
          <div style={{ position:"absolute", top:-20, left:-20, width:120, height:120, borderRadius:"50%", background:"rgba(255,107,0,0.08)", filter:"blur(40px)", pointerEvents:"none" }} />
          <div style={{ display:"flex", alignItems:"center", gap:12, position:"relative", zIndex:1 }}>
            <div style={{
              width:42, height:42, borderRadius:12, flexShrink:0,
              background:"linear-gradient(135deg,#FF6B00,#C8942A)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 4px 16px rgba(255,107,0,0.35)", position:"relative", overflow:"hidden",
            }}>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(255, 255, 255, 0.81),transparent 60%)" }} />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position:"relative", zIndex:1 }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:"#fff", lineHeight:1.25 }}>Uday Sangle</div>
              <div style={{ fontSize:9.5, color:"hsla(0, 0%, 100%, 0.76)", letterSpacing:1.5, textTransform:"uppercase", marginTop:2 }}>Office</div>
            </div>
          </div>
          <div style={{ height:1.5, marginTop:16, background:"linear-gradient(90deg,#FF6B00,#C8942A,transparent)", opacity:0.6 }} />
        </div>

        {/* User Info */}
        <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:11 }}>
            <div style={{
              width:38, height:38, borderRadius:"50%", flexShrink:0,
              background: isAdmin ? "linear-gradient(135deg,#C8942A,#E8B84B)" : "linear-gradient(135deg,#2563EB,#60A5FA)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:14, fontWeight:700, color:"#fff",
              boxShadow: isAdmin ? "0 3px 12px rgba(200,148,42,0.40)" : "0 3px 12px rgba(37,99,235,0.35)",
              border: isAdmin ? "2px solid rgba(200,148,42,0.30)" : "2px solid rgba(37,99,235,0.30)",
            }}>
              {user?.username?.[0]?.toUpperCase() || "A"}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", marginBottom:3 }}>
                {user?.username || "Administrator"}
              </div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background: isAdmin ? "#C8942A" : "#10B981", animation:"pulse-dot 2.5s infinite" }} />
                <span style={{ fontSize:9.5, fontWeight:700, letterSpacing:0.9, textTransform:"uppercase", color: isAdmin ? "#E8B84B" : "#34D399" }}>
                  {isAdmin ? "Main Admin" : "Staff Admin"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-scroll" style={{ flex:1, padding:"14px 12px", overflowY:"auto" }}>
          <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(255, 255, 255, 0.71)", padding:"0 10px 10px" }}>
            Main Navigation
          </div>

          {navLinks.map(({ to, label, icon }) => {
            const active = isActive(to);
            return (
              <Link key={to} to={to} className={`sidebar-link${active ? " active" : ""}`}>
                {active && (
                  <div style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)", width:3, height:"70%", borderRadius:"0 2px 2px 0", background:"#FF6B00", boxShadow:"0 0 8px #FF6B00" }} />
                )}
                <span className="s-icon" style={{ color: active ? "#FF6B00" : "rgba(255, 255, 255, 0.74)", display:"flex", flexShrink:0, transition:"color 0.18s" }}>{icon}</span>
                <span style={{ flex:1 }}>{label}</span>
                {active && <div style={{ width:5, height:5, borderRadius:"50%", background:"#FF6B00", boxShadow:"0 0 6px #FF6B00", flexShrink:0 }} />}
              </Link>
            );
          })}

          <div style={{ height:1, background:"rgba(255,255,255,0.07)", margin:"14px 8px 12px" }} />
          <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(255, 255, 255, 0.36)", padding:"0 10px 10px" }}>
            Public Portal
          </div>
          <Link to="/" className="sidebar-link">
            <span className="s-icon" style={{ color:"rgba(255, 255, 255, 0.79)", display:"flex", flexShrink:0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </span>
            Public Homepage
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft:"auto", opacity:0.25 }}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </Link>
        </nav>

        {/* Logout */}
        <div style={{ padding:"12px 12px 20px", borderTop:"1px solid rgba(255, 255, 255, 0.14)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:20, padding:"10px 14px", borderRadius:11, marginBottom:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)" }}>
            {[{ dot:"#10B981", label:"System Active" },{ dot:"#C8942A", label:"Secured" }].map(({ dot, label }) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:dot, animation:"pulse-dot 2.5s infinite", boxShadow:`0 0 5px ${dot}` }} />
                <span style={{ fontSize:10.5, color:"rgba(255, 255, 255, 0.78)", fontWeight:500 }}>{label}</span>
              </div>
            ))}
          </div>
          <button className="logout-btn" onClick={logout}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}