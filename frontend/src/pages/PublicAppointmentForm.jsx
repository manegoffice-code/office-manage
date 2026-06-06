// frontend/src/pages/PublicAppointmentForm.jsx
// Uday Sangle — Premium Political Office Management System
// LOGIC: UNCHANGED. Only UI redesigned.

import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const C = {
  navy:"#0D1B3E", saffron:"#FF6B00", gold:"#C8942A", goldLight:"#E8B84B",
  white:"#FFFFFF", offWhite:"#F8F6F2", cream:"#FDF9F3",
  border:"rgba(200,148,42,0.20)", muted:"#8A92A6", textPrimary:"#1A2545",
  error:"#DC2626", errorBg:"rgba(220,38,38,0.07)",
  success:"#059669", successBg:"rgba(5,150,105,0.08)",
};

const TIME_SLOTS = [
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","12:00 PM",
  "02:00 PM","02:30 PM","03:00 PM","03:30 PM",
  "04:00 PM","04:30 PM","05:00 PM",
];

const Field = ({ label, error, required=true, children }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
    <label style={{ fontSize:11, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:C.textPrimary, display:"flex", alignItems:"center", gap:4 }}>
      {label} {required && <span style={{ color:C.saffron }}>*</span>}
    </label>
    {children}
    {error && (
      <span style={{ fontSize:12, color:C.error, display:"flex", alignItems:"center", gap:5 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {error}
      </span>
    )}
  </div>
);

export default function PublicAppointmentForm() {
  const EMPTY = { full_name:"", mobile:"", area:"", purpose:"", date:"", time:"" };
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [booked,  setBooked]  = useState(null);
  const [files,   setFiles]   = useState([]);

  const today = new Date().toISOString().split("T")[0];
  const set   = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.full_name.trim())             e.full_name = "Full name is required";
    if (!form.mobile.trim())                e.mobile    = "Mobile number is required";
    else if (!/^\d{10}$/.test(form.mobile)) e.mobile    = "Must be exactly 10 digits";
    if (!form.area.trim())                  e.area      = "Area / location is required";
    if (!form.purpose.trim())               e.purpose   = "Purpose of meeting is required";
    if (!form.date)                         e.date      = "Please select a date";
    if (!form.time)                         e.time      = "Please select a time slot";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setLoading(true);
    try {
      await api.post("/appointments", form);
      setBooked({ name:form.full_name, date:form.date, time:form.time });
      setSuccess(true); setForm(EMPTY);
      window.scrollTo({ top:0, behavior:"smooth" });
      setTimeout(() => setSuccess(false), 8000);
    } catch (err) {
      alert(err?.response?.data?.error || "Booking failed. Please try again.");
    } finally { setLoading(false); }
  };

  const inp = (k, extra={}) => ({
    style:{
      width:"100%", boxSizing:"border-box", padding:"12px 14px", borderRadius:11,
      border:`1.5px solid ${errors[k] ? C.error : focused===k ? C.saffron : C.border}`,
      background: errors[k] ? C.errorBg : focused===k ? "#fff" : C.cream,
      fontSize:14, color:C.textPrimary, outline:"none",
      fontFamily:"'Poppins',sans-serif", transition:"all 0.18s",
      boxShadow: focused===k ? "0 0 0 3px rgba(255,107,0,0.08)" : "none",
      ...extra,
    },
    onFocus:() => setFocused(k),
    onBlur: () => setFocused(""),
  });

  return (
    <div style={{ minHeight:"100vh", background:C.offWhite, fontFamily:"'Poppins',sans-serif", color:C.textPrimary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing:border-box; } a { text-decoration:none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        .pub-nav-link2 { color:rgba(255,255,255,0.55); font-size:13px; font-weight:500; padding:7px 14px; border-radius:8px; transition:all 0.18s; }
        .pub-nav-link2:hover { color:#fff; background:rgba(255,255,255,0.08); }
        @media(max-width:640px) { .pub-nav-links2 { display:none!important; } }
      `}</style>

      {/* Navbar */}
      <header style={{ background:C.navy, position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ height:3, background:"linear-gradient(90deg,#FF6B00,#C8942A,transparent)" }} />
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 28px", height:62, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:"linear-gradient(135deg,#FF6B00,#C8942A)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 3px 12px rgba(255,107,0,0.30)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>Uday Sangle</div>
              <div style={{ fontSize:9.5, color:"rgba(255,255,255,0.35)", letterSpacing:1.5, textTransform:"uppercase" }}>Maharashtra Office</div>
            </div>
          </div>
          <div className="pub-nav-links2" style={{ display:"flex", alignItems:"center", gap:4 }}>
            <Link to="/" className="pub-nav-link2">← Back to Home</Link>
            <Link to="/file-complaint" className="pub-nav-link2">File Complaint</Link>

          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth:840, margin:"0 auto", padding:"52px 24px 80px" }}>

        {/* Heading */}
        <div style={{ marginBottom:36, animation:"fadeUp 0.4s ease both" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(200,148,42,0.10)", border:"1px solid rgba(200,148,42,0.25)", borderRadius:20, padding:"4px 16px", marginBottom:16 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C8942A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span style={{ fontSize:11, fontWeight:700, color:"#C8942A", letterSpacing:1.5, textTransform:"uppercase" }}>Constituency Office</span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,4vw,36px)", color:C.textPrimary, fontWeight:700, marginBottom:10, lineHeight:1.2 }}>
            Book an Appointment
          </h1>
          <p style={{ color:C.muted, fontSize:14, lineHeight:1.75, maxWidth:500 }}>
            Schedule a personal meeting with the MLA. Confirmation within <strong style={{ color:C.textPrimary }}>24 hours</strong> by phone.
          </p>
        </div>

        {/* Success banner */}
        {success && booked && (
          <div style={{ display:"flex", alignItems:"flex-start", gap:14, background:C.successBg, border:"1px solid rgba(5,150,105,0.22)", borderLeft:`4px solid ${C.success}`, borderRadius:14, padding:"18px 22px", marginBottom:28, animation:"fadeUp 0.3s ease both" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:C.success, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <p style={{ fontWeight:700, color:C.success, margin:"0 0 6px", fontSize:15 }}>Appointment booked successfully!</p>
              <p style={{ color:"#047857", margin:"0 0 12px", fontSize:13, lineHeight:1.6 }}>You will receive a confirmation call within 24 hours.</p>
              <div style={{ display:"inline-flex", flexWrap:"wrap", gap:16, background:"#fff", border:"1px solid rgba(5,150,105,0.20)", borderRadius:10, padding:"10px 16px", fontSize:13, color:C.textPrimary }}>
                <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <strong>{booked.name}</strong>
                </span>
                <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <strong>{booked.date}</strong>
                </span>
                <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <strong>{booked.time}</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Form card */}
        <div style={{ background:"#fff", borderRadius:20, border:"1px solid rgba(200,148,42,0.14)", boxShadow:"0 4px 32px rgba(13,27,62,0.08)", overflow:"hidden", animation:"fadeUp 0.45s ease 0.1s both" }}>

          {/* Card header */}
          <div style={{ background:"linear-gradient(135deg,#0D1B3E,#162347)", padding:"20px 28px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#C8942A", boxShadow:"0 0 8px #C8942A" }} />
            <span style={{ fontSize:11.5, fontWeight:700, color:"rgba(255,255,255,0.60)", letterSpacing:1.5, textTransform:"uppercase" }}>
              Appointment Request Form
            </span>
            <div style={{ marginLeft:"auto", fontSize:11, color:"rgba(255,255,255,0.25)" }}>All fields marked * are required</div>
          </div>

          <div style={{ padding:"clamp(22px,4vw,36px)" }}>

            {/* Section: Personal */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22 }}>
              <div style={{ width:3, height:20, background:"#FF6B00", borderRadius:2 }} />
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#FF6B00" }}>Personal Information</span>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"18px 24px", marginBottom:28 }}>
              <Field label="Full Name" error={errors.full_name}>
                <input value={form.full_name} onChange={set("full_name")} placeholder="e.g. Priya Sharma" {...inp("full_name")} />
              </Field>
              <Field label="Mobile Number" error={errors.mobile}>
                <input value={form.mobile} onChange={set("mobile")} placeholder="10-digit number" maxLength={10} {...inp("mobile")} />
              </Field>
              <Field label="Area / Location" error={errors.area}>
                <input value={form.area} onChange={set("area")} placeholder="e.g. Kothrud, Pune" {...inp("area")} />
              </Field>
              <Field label="Purpose of Meeting" error={errors.purpose}>
                <input value={form.purpose} onChange={set("purpose")} placeholder="e.g. Water supply issue" {...inp("purpose")} />
              </Field>
            </div>

            <div style={{ height:1, background:"rgba(200,148,42,0.12)", margin:"0 0 26px" }} />

            {/* Section: Date & Time */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22 }}>
              <div style={{ width:3, height:20, background:"#C8942A", borderRadius:2 }} />
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#C8942A" }}>Select Date &amp; Time</span>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"18px 24px", marginBottom:20 }}>
              <Field label="Preferred Date" error={errors.date}>
                <input type="date" value={form.date} min={today} onChange={set("date")} {...inp("date")} />
              </Field>
              <Field label="Time Slot" error={errors.time}>
                <select value={form.time} onChange={set("time")} onFocus={() => setFocused("time")} onBlur={() => setFocused("")} style={{
                  ...inp("time").style, cursor:"pointer", appearance:"none",
                  backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A92A6' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center", paddingRight:38,
                }}>
                  <option value="">-- Choose a time slot --</option>
                  <optgroup label="Morning">
                    {TIME_SLOTS.filter(t => t.includes("AM")).map(t => <option key={t} value={t}>{t}</option>)}
                  </optgroup>
                  <optgroup label="Afternoon / Evening">
                    {TIME_SLOTS.filter(t => t.includes("PM")).map(t => <option key={t} value={t}>{t}</option>)}
                  </optgroup>
                </select>
              </Field>
            </div>

            {/* Info box */}
            <div style={{ display:"flex", gap:10, alignItems:"flex-start", background:"rgba(200,148,42,0.08)", border:"1px solid rgba(200,148,42,0.22)", borderRadius:11, padding:"13px 16px", marginBottom:26 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8942A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>
              <span style={{ fontSize:13, color:"#7A5C1A", lineHeight:1.65 }}>
                Office hours: <strong>Monday – Saturday, 9:00 AM – 5:00 PM</strong>. Appointments on public holidays will be rescheduled and you will be notified by phone.
              </span>
            </div>

            <div style={{ height:1, background:"rgba(200,148,42,0.12)", margin:"0 0 26px" }} />

            {/* Section: Attachments */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <div style={{ width:3, height:20, background:"#10B981", borderRadius:2 }} />
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#10B981" }}>Attachments</span>
              <span style={{ fontSize:11, color:C.muted, fontWeight:400, textTransform:"none", letterSpacing:0 }}>(optional)</span>
            </div>

            <div style={{ marginBottom:26 }}>
              <label style={{
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                gap:10, padding:"24px 20px", borderRadius:14, cursor:"pointer",
                border:`1.5px dashed rgba(200,148,42,0.30)`,
                background:C.cream, transition:"all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#C8942A"; e.currentTarget.style.background="#fff"; e.currentTarget.style.boxShadow="0 0 0 3px rgba(200,148,42,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(200,148,42,0.30)"; e.currentTarget.style.background=C.cream; e.currentTarget.style.boxShadow="none"; }}
              >
                <div style={{ width:44, height:44, borderRadius:12, background:"rgba(200,148,42,0.10)", border:"1px solid rgba(200,148,42,0.20)", display:"flex", alignItems:"center", justifyContent:"center", color:"#C8942A" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:13.5, fontWeight:600, color:C.textPrimary, marginBottom:3 }}>Click to browse files</div>
                  <div style={{ fontSize:12, color:C.muted }}>Photos, videos, PDFs, Word docs — any file type</div>
                </div>
                <input type="file" multiple accept="*/*" style={{ display:"none" }} onChange={e => setFiles(Array.from(e.target.files))} />
              </label>
              {files.length > 0 && (
                <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:8 }}>
                  {files.map((f, i) => (
                    <span key={i} style={{ fontSize:12, color:C.textPrimary, background:"rgba(200,148,42,0.10)", border:"1px solid rgba(200,148,42,0.22)", borderRadius:7, padding:"4px 10px", display:"flex", alignItems:"center", gap:5 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C8942A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      {f.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div style={{ paddingTop:20, borderTop:"1px solid rgba(200,148,42,0.12)", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
              <button onClick={submit} disabled={loading} style={{
                padding:"13px 36px", borderRadius:11,
                background: loading ? "rgba(255,107,0,0.45)" : "linear-gradient(135deg,#FF6B00,#C8942A)",
                color:"#fff", border:"none", fontSize:14, fontWeight:600,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily:"'Poppins',sans-serif", transition:"all 0.18s",
                boxShadow: loading ? "none" : "0 4px 20px rgba(255,107,0,0.30)",
                display:"flex", alignItems:"center", gap:10,
              }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(255,107,0,0.40)"; } }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(255,107,0,0.30)"; }}
              >
                {loading ? (
                  <><div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />Booking…</>
                ) : (
                  <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Book Appointment</>
                )}
              </button>
              <Link to="/file-complaint" style={{ fontSize:13, color:C.muted, display:"flex", alignItems:"center", gap:5, transition:"color 0.18s" }}
                onMouseEnter={e => e.currentTarget.style.color=C.textPrimary}
                onMouseLeave={e => e.currentTarget.style.color=C.muted}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                File a complaint instead
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background:C.navy, padding:"28px 40px", textAlign:"center", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.25)", letterSpacing:0.5 }}>
          © {new Date().getFullYear()} Uday Sangle · Office · All rights reserved
        </div>
      </footer>
    </div>
  );
}
