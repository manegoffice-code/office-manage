// frontend/src/pages/PublicComplaintForm.jsx
// Public Complaint Form — Premium Redesign matching dashboard UI
// LOGIC: UNCHANGED. Only UI redesigned with photo/video upload & location support.

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

/* ─── Design tokens (match index.html :root) ─────────────────────────────── */
const D = {
  navy:       "#0B1730",
  navyMid:    "#0F1E3D",
  navyLight:  "#162347",
  saffron:    "#E8611A",
  saffronMid: "#F0742E",
  saffronLt:  "#FFF4EE",
  gold:       "#C8901A",
  goldLight:  "#FFF8E8",
  bg:         "#F0F4FB",
  card:       "#FFFFFF",
  text:       "#0B1730",
  textMid:    "#354B6E",
  muted:      "#7888A8",
  border:     "#DCE4F0",
  borderMid:  "#C4D0E8",
  success:    "#0D9348",
  successLt:  "#D4F5E2",
  danger:     "#D82020",
  dangerLt:   "#FDDCDC",
  warn:       "#C97008",
  warnLt:     "#FEF0C0",
};

/* ─── Shared input style factory ─────────────────────────────────────────── */
const iStyle = (focused, hasError) => ({
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 15px",
  borderRadius: 10,
  border: `1.5px solid ${hasError ? D.danger : focused ? D.saffron : D.border}`,
  background: hasError ? D.dangerLt : focused ? "#FFFCF9" : "#fff",
  fontSize: 14,
  color: D.text,
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
  boxShadow: focused && !hasError ? `0 0 0 3px rgba(232,97,26,0.12)` : "none",
});

/* ─── Field wrapper ──────────────────────────────────────────────────────── */
const Field = ({ label, error, required = true, children, hint }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <label style={{
      fontSize: 12.5, fontWeight: 600, color: D.textMid,
      letterSpacing: 0.3, display: "flex", alignItems: "center", gap: 4,
    }}>
      {label}
      {required && <span style={{ color: D.saffron, fontSize: 13, lineHeight: 1 }}>*</span>}
    </label>
    {children}
    {hint && !error && (
      <span style={{ fontSize: 11.5, color: D.muted, lineHeight: 1.5 }}>{hint}</span>
    )}
    {error && (
      <span style={{
        fontSize: 12, color: D.danger,
        display: "flex", alignItems: "center", gap: 5,
        background: D.dangerLt, padding: "5px 10px", borderRadius: 7,
        border: `1px solid rgba(216,32,32,0.15)`,
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {error}
      </span>
    )}
  </div>
);

/* ─── Section header ─────────────────────────────────────────────────────── */
const Section = ({ icon, label, step }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "32px 0 22px" }}>
    <div style={{
      width: 34, height: 34, borderRadius: 10,
      background: `linear-gradient(135deg, ${D.saffron}, ${D.saffronMid})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", flexShrink: 0,
      boxShadow: "0 4px 12px rgba(232,97,26,0.30)",
    }}>{icon}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", color: D.muted, marginBottom: 1 }}>Step {step}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: D.text, letterSpacing: 0.2 }}>{label}</div>
    </div>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${D.border}, transparent)` }} />
  </div>
);

/* ─── Media Upload Box ───────────────────────────────────────────────────── */
const UploadCard = ({ type, label, accept, iconSvg, file, preview, onFileChange, onClear, accentColor }) => {
  const ref = useRef();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: D.textMid, letterSpacing: 0.3 }}>{label}</label>
      {!file ? (
        <div
          onClick={() => ref.current.click()}
          style={{
            border: `2px dashed ${D.border}`, borderRadius: 14,
            padding: "28px 16px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            cursor: "pointer", background: "#FAFBFE",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.background = `${accentColor}07`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = D.border; e.currentTarget.style.background = "#FAFBFE"; }}
        >
          <div style={{
            width: 50, height: 50, borderRadius: 14,
            background: `${accentColor}14`, border: `1px solid ${accentColor}28`,
            display: "flex", alignItems: "center", justifyContent: "center", color: accentColor,
          }}>{iconSvg}</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: D.textMid, marginBottom: 4 }}>Click to upload {type === "photo" ? "a photo" : "a video"}</div>
            <div style={{ fontSize: 11.5, color: D.muted }}>{type === "photo" ? "JPG, PNG, WebP · Max 10 MB" : "MP4, MOV, WebM · Max 50 MB"}</div>
          </div>
          <input ref={ref} type="file" accept={accept} style={{ display: "none" }} onChange={onFileChange} />
        </div>
      ) : (
        <div style={{ borderRadius: 14, overflow: "hidden", border: `1.5px solid ${accentColor}40`, background: "#fff", boxShadow: `0 4px 16px ${accentColor}16` }}>
          {type === "photo"
            ? <img src={preview} alt="preview" style={{ width: "100%", maxHeight: 190, objectFit: "cover", display: "block" }} />
            : <video src={preview} controls style={{ width: "100%", maxHeight: 190, background: "#000", display: "block" }} />
          }
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: `${accentColor}07`, borderTop: `1px solid ${accentColor}20` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${accentColor}18`, display: "flex", alignItems: "center", justifyContent: "center", color: accentColor }}>{iconSvg}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: D.text, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
                <div style={{ fontSize: 11, color: D.muted }}>{(file.size / 1024 / 1024).toFixed(1)} MB</div>
              </div>
            </div>
            <button onClick={onClear} style={{ padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: `1px solid ${D.danger}30`, background: D.dangerLt, color: D.danger, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function PublicComplaintForm() {
  const EMPTY = { full_name: "", mobile: "", area: "", location: "", subject: "", details: "", date: "" };

  const [form,         setForm]         = useState(EMPTY);
  const [errors,       setErrors]       = useState({});
  const [focused,      setFocused]      = useState("");
  const [loading,      setLoading]      = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [photoFile,    setPhotoFile]    = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [videoFile,    setVideoFile]    = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const fp  = (k) => ({ onFocus: () => setFocused(k), onBlur: () => setFocused("") });

  const validate = () => {
    const e = {};
    if (!form.full_name.trim())             e.full_name = "Full name is required";
    if (!form.mobile.trim())                e.mobile    = "Mobile number is required";
    else if (!/^\d{10}$/.test(form.mobile)) e.mobile    = "Must be exactly 10 digits";
    if (!form.area.trim())                  e.area      = "Area / ward is required";
    if (!form.subject.trim())               e.subject   = "Complaint subject is required";
    if (!form.details.trim())               e.details   = "Please describe the complaint";
    if (!form.date)                         e.date      = "Date is required";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      await api.post("/complaints", {
        full_name: form.full_name,
        mobile:    form.mobile,
        area:      form.area,
        subject:   form.subject,
        details:   `${form.details}${form.location ? `\n\nExact Location: ${form.location}` : ""}`,
        date:      form.date,
      });
      setSuccess(true);
      setForm(EMPTY);
      setPhotoFile(null); setPhotoPreview(null);
      setVideoFile(null); setVideoPreview(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setSuccess(false), 8000);
    } catch (err) {
      alert(err?.response?.data?.error || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fi  = (k) => ({ style: iStyle(focused === k, !!errors[k]), ...fp(k) });
  const today = new Date().toISOString().split("T")[0];
  const filled = Object.values(form).filter(Boolean).length;
  const progress = Math.round((filled / Object.keys(EMPTY).length) * 100);

  return (
    <div style={{ minHeight: "100vh", background: D.bg, fontFamily: "'DM Sans','Poppins',sans-serif", color: D.text }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .pcf-in { animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        .pcf-btn { padding:13px 36px; border-radius:11px; background:linear-gradient(135deg,${D.saffron},${D.saffronMid}); color:#fff; border:none; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.2s; box-shadow:0 6px 22px rgba(232,97,26,0.32); display:inline-flex; align-items:center; gap:9px; font-family:inherit; letter-spacing:0.3px; }
        .pcf-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 32px rgba(232,97,26,0.42); }
        .pcf-btn:disabled { background:${D.muted}; box-shadow:none; cursor:not-allowed; }
        .pcf-nav-a { color:rgba(240,244,251,0.65); font-size:13.5px; padding:7px 14px; border-radius:9px; transition:all 0.18s; }
        .pcf-nav-a:hover { background:rgba(255,255,255,0.10); color:#fff; }
        @media (max-width:640px) {
          .pcf-g2 { grid-template-columns:1fr !important; }
          .pcf-hnav { display:none !important; }
          .pcf-subrow { flex-direction:column !important; align-items:flex-start !important; }
          .pcf-card-pad { padding:20px 18px 28px !important; }
        }
      `}</style>

      {/* ── Header ── */}
      <header style={{ background: `linear-gradient(135deg,${D.navy},${D.navyMid})`, borderBottom: "1px solid rgba(255,255,255,0.07)", height: 62, display: "flex", alignItems: "center", padding: "0 32px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 20px rgba(11,23,48,0.28)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${D.saffron},${D.saffronMid})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: 16, boxShadow: "0 4px 12px rgba(232,97,26,0.40)", fontFamily: "'Playfair Display',serif" }}>M</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", color: "#fff", fontSize: 15, fontWeight: 700, lineHeight: 1.1 }}>MLA Office</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.40)", letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>Constituency Portal</div>
          </div>
        </div>
        <nav className="pcf-hnav" style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <Link to="/" className="pcf-nav-a">← Back to Home</Link>
          <Link to="/book-appointment" className="pcf-nav-a">Book Appointment</Link>

        </nav>
      </header>

      {/* ── Body ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 20px 80px" }}>

        {/* Heading */}
        <div className="pcf-in" style={{ marginBottom: 34, animationDelay: "0.05s" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: D.saffronLt, color: D.saffron, fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", padding: "5px 13px", borderRadius: 20, border: "1px solid rgba(232,97,26,0.20)", marginBottom: 14 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Constituency Services
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(26px,4vw,36px)", color: D.text, margin: "0 0 10px", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15 }}>File a Complaint</h1>
          <p style={{ color: D.muted, fontSize: 14, lineHeight: 1.7, maxWidth: 560 }}>Submit your complaint below. Our team responds within <strong style={{ color: D.text }}>3 working days</strong>. Attach photos or videos as supporting evidence.</p>
        </div>

        {/* Success banner */}
        {success && (
          <div className="pcf-in" style={{ display: "flex", gap: 16, alignItems: "flex-start", background: D.successLt, border: "1px solid rgba(13,147,72,0.25)", borderLeft: `4px solid ${D.success}`, borderRadius: 14, padding: "18px 22px", marginBottom: 28 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: D.success, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>✓</div>
            <div>
              <p style={{ fontWeight: 700, color: D.success, margin: "0 0 4px", fontSize: 15 }}>Complaint submitted successfully!</p>
              <p style={{ color: "#0A6B38", margin: 0, fontSize: 13 }}>Your complaint has been recorded. Our team will review and respond within 3 working days.</p>
            </div>
          </div>
        )}

        {/* Form card */}
        <div className="pcf-in" style={{ background: "#fff", borderRadius: 20, border: `1px solid ${D.border}`, boxShadow: "0 4px 32px rgba(11,23,48,0.09),0 1px 4px rgba(11,23,48,0.05)", overflow: "hidden", animationDelay: "0.10s" }}>

          {/* Card header bar */}
          <div style={{ background: `linear-gradient(135deg,${D.navy},${D.navyLight})`, padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${D.saffron},${D.gold},transparent)` }} />
            <div style={{ position: "absolute", right: -30, top: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(232,97,26,0.08)", filter: "blur(40px)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 1 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(232,97,26,0.18)", border: "1px solid rgba(232,97,26,0.30)", display: "flex", alignItems: "center", justifyContent: "center", color: D.saffron }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>New Complaint Form</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: 0.5 }}>Fields marked * are mandatory</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, zIndex: 1 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.50)" }}>Completion</div>
              <div style={{ width: 90, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, borderRadius: 3, background: `linear-gradient(90deg,${D.saffron},${D.gold})`, transition: "width 0.4s ease" }} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: D.saffron }}>{progress}%</div>
            </div>
          </div>

          {/* Form body */}
          <div className="pcf-card-pad" style={{ padding: "4px 32px 36px" }}>

            {/* ── Step 1: Personal Info ── */}
            <Section step={1} label="Personal Information" icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            } />

            <div className="pcf-g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px" }}>
              <Field label="Full Name" error={errors.full_name}>
                <input value={form.full_name} onChange={set("full_name")} placeholder="e.g. Rajesh Kumar" {...fi("full_name")} />
              </Field>
              <Field label="Mobile Number" error={errors.mobile} hint="10-digit number">
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 600, color: D.muted, pointerEvents: "none" }}>+91</div>
                  <input value={form.mobile} onChange={set("mobile")} placeholder="9876543210" maxLength={10} style={{ ...iStyle(focused === "mobile", !!errors.mobile), paddingLeft: 44 }} {...fp("mobile")} />
                </div>
              </Field>
              <Field label="Area / Ward" error={errors.area}>
                <input value={form.area} onChange={set("area")} placeholder="e.g. Shivaji Nagar, Ward 5" {...fi("area")} />
              </Field>
              <Field label="Date of Complaint" error={errors.date}>
                <input type="date" value={form.date} max={today} onChange={set("date")} {...fi("date")} />
              </Field>
            </div>

            {/* ── Step 2: Location ── */}
            <Section step={2} label="Exact Location" icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            } />

            <Field label="Exact Location / Landmark" required={false} hint="Street address, landmark, or Google Maps link for precise identification">
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: D.muted, pointerEvents: "none" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <input value={form.location} onChange={set("location")} placeholder="e.g. Near Municipal Office, Main Road, Sector 4" style={{ ...iStyle(focused === "location", false), paddingLeft: 42 }} {...fp("location")} />
              </div>
            </Field>

            {/* ── Step 3: Complaint Details ── */}
            <Section step={3} label="Complaint Details" icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            } />

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Field label="Complaint Subject" error={errors.subject}>
                <input value={form.subject} onChange={set("subject")} placeholder="e.g. Road not repaired since 6 months" {...fi("subject")} />
              </Field>
              <Field label="Complaint Description" error={errors.details}>
                <textarea value={form.details} onChange={set("details")} rows={5} placeholder="Describe the issue in detail — what happened, since when, how it affects residents, any earlier complaints filed…" style={{ ...iStyle(focused === "details", !!errors.details), resize: "vertical", lineHeight: 1.75 }} {...fp("details")} />
              </Field>
            </div>

            {/* ── Step 4: Media Upload ── */}
            <Section step={4} label="Supporting Evidence (Optional)" icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            } />

            <div className="pcf-g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px" }}>
              <UploadCard
                type="photo" label="Upload Photo" accept="image/jpeg,image/png,image/webp"
                iconSvg={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                file={photoFile} preview={photoPreview}
                onFileChange={(e) => { const f = e.target.files[0]; if (f) { setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)); } }}
                onClear={() => { setPhotoFile(null); setPhotoPreview(null); }}
                accentColor={D.saffron}
              />
              <UploadCard
                type="video" label="Upload Video" accept="video/mp4,video/quicktime,video/webm"
                iconSvg={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>}
                file={videoFile} preview={videoPreview}
                onFileChange={(e) => { const f = e.target.files[0]; if (f) { setVideoFile(f); setVideoPreview(URL.createObjectURL(f)); } }}
                onClear={() => { setVideoFile(null); setVideoPreview(null); }}
                accentColor={D.gold}
              />
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: D.warnLt, border: "1px solid rgba(201,112,8,0.20)", borderRadius: 10, padding: "11px 15px", marginTop: 14, fontSize: 12.5, color: "#7A5200", lineHeight: 1.6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>Photo and video evidence helps our team process your complaint faster. Files are reviewed confidentially by authorized staff only.</span>
            </div>

            {/* Submit row */}
            <div className="pcf-subrow" style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${D.border}`, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <button className="pcf-btn" onClick={submit} disabled={loading}>
                {loading ? (
                  <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Submitting…</>
                ) : (
                  <>Submit Complaint <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
                )}
              </button>
              <div style={{ fontSize: 12.5, color: D.muted }}><span style={{ color: D.saffron, fontWeight: 700 }}>*</span> All starred fields are mandatory</div>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="pcf-g2 pcf-in" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 18, animationDelay: "0.15s" }}>
          {[
            { icon: "🕐", title: "Response Time", text: "Our team reviews all complaints within 3 working days.", bg: D.saffronLt, border: "rgba(232,97,26,0.18)", titleColor: D.saffron },
            { icon: "🔒", title: "Confidential & Secure", text: "Your personal information is kept strictly confidential.", bg: D.goldLight, border: "rgba(200,144,26,0.20)", titleColor: D.gold },
          ].map(c => (
            <div key={c.title} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.titleColor, marginBottom: 4 }}>{c.title}</div>
                <div style={{ fontSize: 12.5, color: D.textMid, lineHeight: 1.6 }}>{c.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: D.navy, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "22px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(135deg,${D.saffron},${D.saffronMid})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 12 }}>M</div>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.55)", fontFamily: "'Playfair Display',serif" }}>MLA Office Constituency Portal</span>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", letterSpacing: 0.4 }}>All rights reserved · {new Date().getFullYear()}</div>
      </footer>
    </div>
  );
}
