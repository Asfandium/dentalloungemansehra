import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppointmentModalProvider } from './context/AppointmentModalContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { Layout } from './components/layout/Layout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages & Layout
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminStaffPage } from './pages/admin/AdminStaffPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AppointmentModalProvider>
          <Routes>
            {/* Standalone Admin Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Healthcare Admin Portal */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="appointments" element={<AdminAppointmentsPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="media" element={<AdminMediaPage />} />
              <Route path="staff" element={<AdminStaffPage />} />
              <Route path="audit-logs" element={<AdminAuditLogsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>

            {/* Public Dental Clinic Routes (Preserved 4 routes) */}
            <Route
              element={
                <Layout>
                  <Outlet />
                </Layout>
              }
            >
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Fallback redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppointmentModalProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
