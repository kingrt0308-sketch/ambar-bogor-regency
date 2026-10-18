import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import type { Payment } from '../../types';
import { MONTHS } from '../../types';
import { Wallet, CheckCircle, Clock, XCircle, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WargaDashboard() {
  const { profile } = useAuth();
  const { settings } = useSettings();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    if (!profile?.uid) return;
    const q = query(
      collection(db, 'payments'),
      where('userId', '==', profile.uid),
      orderBy('tahun', 'desc'),
      orderBy('bulan', 'desc')
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payment)));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [profile?.uid]);

  const thisYearPayments = payments.filter((p) => p.tahun === currentYear && p.status === 'verified');
  const paidMonths = new Set(thisYearPayments.map((p) => p.bulan));
  const unpaidCount = 12 - paidMonths.size;

  const statusBadge = (status: string) => {
    if (status === 'verified') return <span className="badge badge-success">Terverifikasi</span>;
    if (status === 'pending') return <span className="badge badge-warning">Menunggu</span>;
    return <span className="badge badge-danger">Ditolak</span>;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Halo, {profile?.nama}!
        </h1>
        <p className="text-slate-500">
          Blok {profile?.blok} No. {profile?.noRumah}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <CheckCircle className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{paidMonths.size}</p>
              <p className="text-xs text-slate-500">Bulan lunas {currentYear}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <Clock className="text-amber-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{unpaidCount}</p>
              <p className="text-xs text-slate-500">Bulan belum bayar</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
              <Wallet className="text-teal-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                Rp {(settings.iplAmount || 150000).toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-slate-500">IPL / bulan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Month grid current year */}
      <div className="card mb-8">
        <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">
          Status IPL {currentYear}
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {MONTHS.map((m, i) => {
            const month = i + 1;
            const paid = paidMonths.has(month);
            const pending = payments.some(
              (p) => p.tahun === currentYear && p.bulan === month && p.status === 'pending'
            );
            return (
              <div
                key={m}
                className={`rounded-xl px-2 py-3 text-center text-xs font-medium ${
                  paid
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : pending
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : month < currentMonth
                    ? 'bg-red-50 text-red-600 border border-red-100'
                    : 'bg-slate-50 text-slate-500 border border-slate-100'
                }`}
              >
                {m.slice(0, 3)}
                <div className="mt-1 text-[10px]">
                  {paid ? 'Lunas' : pending ? 'Proses' : month < currentMonth ? 'Belum' : '-'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/dashboard/upload" className="btn-primary">
          <Upload size={16} /> Upload Bukti Pembayaran
        </Link>
        <Link to="/dashboard/ipl" className="btn-secondary">
          Lihat Riwayat Lengkap
        </Link>
      </div>

      {/* Recent */}
      <div className="card">
        <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">
          Riwayat Terbaru
        </h2>
        {loading ? (
          <p className="text-sm text-slate-400">Memuat...</p>
        ) : payments.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada data pembayaran.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="pb-2 pr-4 font-medium">Bulan</th>
                  <th className="pb-2 pr-4 font-medium">Jumlah</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 6).map((p) => (
                  <tr key={p.id} className="border-b border-slate-50">
                    <td className="py-3 pr-4">
                      {MONTHS[p.bulan - 1]} {p.tahun}
                    </td>
                    <td className="py-3 pr-4">Rp {p.jumlah.toLocaleString('id-ID')}</td>
                    <td className="py-3">{statusBadge(p.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
