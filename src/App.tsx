import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import IPLInfo from './pages/IPLInfo';
import Kegiatan from './pages/Kegiatan';
import Login from './pages/Login';
import WargaDashboard from './pages/warga/Dashboard';
import StatusIPL from './pages/warga/StatusIPL';
import UploadBukti from './pages/warga/UploadBukti';
import AdminDashboard from './pages/admin/Dashboard';
import AdminWarga from './pages/admin/Warga';
import AdminPembayaran from './pages/admin/Pembayaran';
import AdminLaporan from './pages/admin/Laporan';
import AdminTransaksi from './pages/admin/Transaksi';
import KegiatanAdmin from './pages/admin/KegiatanAdmin';
import Pengaturan from './pages/admin/Pengaturan';
import { useAuth } from './contexts/AuthContext';

function RoleRedirect() {
  const { isAdmin, isWarga, loading } = useAuth();
  if (loading) return null;
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (isWarga) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ipl" element={<IPLInfo />} />
        <Route path="/kegiatan" element={<Kegiatan />} />
        <Route path="/login" element={<Login />} />

        {/* Warga */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="warga">
              <WargaDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/ipl"
          element={
            <ProtectedRoute role="warga">
              <StatusIPL />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/upload"
          element={
            <ProtectedRoute role="warga">
              <UploadBukti />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/warga"
          element={
            <ProtectedRoute role="admin">
              <AdminWarga />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pembayaran"
          element={
            <ProtectedRoute role="admin">
              <AdminPembayaran />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/laporan"
          element={
            <ProtectedRoute role="admin">
              <AdminLaporan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/transaksi"
          element={
            <ProtectedRoute role="admin">
              <AdminTransaksi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/kegiatan"
          element={
            <ProtectedRoute role="admin">
              <KegiatanAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pengaturan"
          element={
            <ProtectedRoute role="admin">
              <Pengaturan />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<RoleRedirect />} />
      </Routes>
    </Layout>
  );
}
