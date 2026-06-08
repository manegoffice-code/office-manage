// frontend/src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Homepage   from "./pages/Home";
import Login      from "./pages/Login";
import Dashboard  from "./pages/Dashboard";
import Complaints from "./pages/Complaints";
import Appointments from "./pages/Appointments";
import PublicComplaintForm from "./pages/PublicComplaintForm";
import PublicAppointmentForm from "./pages/PublicAppointmentForm";
import Notices    from "./pages/Notices";
import AdminDashboard from "./pages/AdminDashboard";

// Helper: get logged-in user from localStorage
function getUser() {
  try {
    const u = localStorage.getItem("admin_user");
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}

// Route guard — redirect to login if not logged in
function RequireAuth({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Route guard — only main_admin can access
function RequireMainAdmin({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "main_admin") return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── PUBLIC ROUTES (no login needed) ──────────────── */}
        <Route path="/"        element={<Homepage />} />
        <Route path="/home"    element={<Homepage />} />
        <Route path="/login"   element={<Login />} />

        {/* Public forms — accessible WITHOUT login */}
        <Route path="/file-complaint"   element={<PublicComplaintForm />} />
        <Route path="/book-appointment" element={<PublicAppointmentForm />} />

        {/* ── PROTECTED ROUTES (staff/admin only) ───────────── */}
        <Route element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }>
          <Route path="/dashboard"    element={<Dashboard />} />
          <Route path="/complaints"   element={<Complaints />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/notices"      element={<Notices />} />

          {/* Main admin only */}
          <Route path="/admin" element={
            <RequireMainAdmin>
              <AdminDashboard />
            </RequireMainAdmin>
          } />
        </Route>

        {/* ── FALLBACK ──────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}