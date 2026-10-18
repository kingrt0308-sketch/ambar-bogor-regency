import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Wallet,
  Calendar,
  FileText,
  LogIn,
  LogOut,
  Menu,
  X,
  Settings,
  LayoutDashboard,
  Users,
  Receipt,
  Upload,
  BarChart3,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles?: ('admin' | 'warga' | 'public')[];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, logout, isAdmin, isWarga, user } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const publicNav: NavItem[] = [
    { to: '/', label: 'Beranda', icon: <Home size={18} />, roles: ['public'] },
    { to: '/ipl', label: 'IPL', icon: <Wallet size={18} />, roles: ['public'] },
    { to: '/kegiatan', label: 'Kegiatan', icon: <Calendar size={18} />, roles: ['public'] },
  ];

  const wargaNav: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/dashboard/ipl', label: 'Status IPL', icon: <Wallet size={18} /> },
    { to: '/dashboard/upload', label: 'Upload Bukti', icon: <Upload size={18} /> },
  ];

  const adminNav: NavItem[] = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/admin/warga', label: 'Data Warga', icon: <Users size={18} /> },
    { to: '/admin/pembayaran', label: 'Pembayaran IPL', icon: <Receipt size={18} /> },
    { to: '/admin/transaksi', label: 'Pemasukan/Pengeluaran', icon: <Wallet size={18} /> },
    { to: '/admin/laporan', label: 'Laporan', icon: <BarChart3 size={18} /> },
    { to: '/admin/kegiatan', label: 'Kegiatan', icon: <Calendar size={18} /> },
    { to: '/admin/pengaturan', label: 'Pengaturan', icon: <Settings size={18} /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const NavLink = ({ item }: { item: NavItem }) => (
    <Link
      to={item.to}
      onClick={() => setMobileOpen(false)}
      className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
        isActive(item.to)
          ? 'bg-teal-600 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {item.icon}
      {item.label}
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-10 w-10 rounded-xl object-cover" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-lg">
                A
              </div>
            )}
            <div className="hidden sm:block">
              <div className="font-display text-base font-bold text-slate-900 leading-tight">
                {settings.siteName}
              </div>
              <div className="text-xs text-slate-500">Sistem Manajemen Perumahan</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {publicNav.map((item) => (
              <NavLink key={item.to} item={item} />
            ))}
            {!user && (
              <Link
                to="/login"
                className="ml-2 flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition"
              >
                <LogIn size={16} />
                Login
              </Link>
            )}
            {user && (
              <div className="ml-3 flex items-center gap-3">
                <span className="text-sm text-slate-600 hidden lg:inline">
                  Halo, <strong>{profile?.nama || 'User'}</strong>
                  {isAdmin && <span className="ml-1 badge badge-info">Admin</span>}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <LogOut size={16} />
                  Keluar
                </button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {publicNav.map((item) => (
              <NavLink key={item.to} item={item} />
            ))}
            {isWarga && wargaNav.map((item) => <NavLink key={item.to} item={item} />)}
            {isAdmin && adminNav.map((item) => <NavLink key={item.to} item={item} />)}
            {!user && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white"
              >
                <LogIn size={18} /> Login
              </Link>
            )}
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} /> Keluar
              </button>
            )}
          </div>
        )}
      </header>

      {/* Sidebar for logged-in users on desktop */}
      <div className="flex flex-1">
        {(isAdmin || isWarga) && (
          <aside className="hidden md:flex w-60 flex-col border-r border-slate-200 bg-white p-4 sticky top-16 h-[calc(100vh-4rem)]">
            <div className="mb-4 px-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {isAdmin ? 'Menu Admin' : 'Menu Warga'}
              </p>
            </div>
            <nav className="flex flex-col gap-1">
              {(isAdmin ? adminNav : wargaNav).map((item) => (
                <NavLink key={item.to} item={item} />
              ))}
            </nav>
          </aside>
        )}

        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <p className="font-display font-semibold text-slate-800">{settings.siteName}</p>
          <p className="mt-1 text-sm text-slate-500">{settings.address}</p>
          <p className="mt-3 text-xs text-slate-400">
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
