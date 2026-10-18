import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Payment, AppUser } from '../../types';
import { MONTHS } from '../../types';
import { Search, Loader2, Download } from 'lucide-react';

export default function AdminLaporan() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState<'all' | 'lunas' | 'belum'>('all');

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, 'payments'), (snap) => {
      setPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payment)));
    });
    const unsub2 = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(
        snap.docs
          .map((d) => ({ uid: d.id, ...d.data() } as AppUser))
          .filter((u) => u.role === 'warga' && u.active !== false)
      );
      setLoading(false);
    });
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // Build matrix: each warga -> months paid
  const report = users
    .map((u) => {
      const userPayments = payments.filter(
        (p) => p.userId === u.uid && p.tahun === tahun && p.status === 'verified'
      );
      const paidMonths = new Set(userPayments.map((p) => p.bulan));
      const paidCount = paidMonths.size;
      return {
        user: u,
        paidMonths,
        paidCount,
        unpaidCount: 12 - paidCount,
        isLunas: paidCount === 12,
      };
    })
    .filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.user.nama?.toLowerCase().includes(q) ||
        r.user.blok?.toLowerCase().includes(q) ||
        r.user.noRumah?.toLowerCase().includes(q);
      if (!matchSearch) return false;
      if (statusFilter === 'lunas') return r.isLunas;
      if (statusFilter === 'belum') return !r.isLunas;
      return true;
    })
    .sort((a, b) => a.user.blok.localeCompare(b.user.blok) || a.user.noRumah.localeCompare(b.user.noRumah));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">Laporan Pembayaran IPL</h1>
      <p className="text-slate-500 mb-6">Cari warga yang sudah / belum bayar per bulan & tahun</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="input-field pl-10"
            placeholder="Cari nama atau blok rumah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input-field w-auto" value={tahun} onChange={(e) => setTahun(Number(e.target.value))}>
          {[2024, 2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          className="input-field w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="all">Semua</option>
          <option value="lunas">Sudah Lunas</option>
          <option value="belum">Belum Lunas</option>
        </select>
      </div>

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        <div className="card py-4">
          <p className="text-2xl font-bold text-slate-900">{report.length}</p>
          <p className="text-xs text-slate-500">Warga ditampilkan</p>
        </div>
        <div className="card py-4">
          <p className="text-2xl font-bold text-emerald-600">{report.filter((r) => r.isLunas).length}</p>
          <p className="text-xs text-slate-500">Sudah lunas setahun</p>
        </div>
        <div className="card py-4">
          <p className="text-2xl font-bold text-red-600">{report.filter((r) => !r.isLunas).length}</p>
          <p className="text-xs text-slate-500">Belum lunas</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-teal-600" size={28} /></div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-3 pr-2 font-medium sticky left-0 bg-white">Nama</th>
                <th className="pb-3 pr-2 font-medium">Blok</th>
                {MONTHS.map((m) => (
                  <th key={m} className="pb-3 px-1 font-medium text-center">{m.slice(0, 3)}</th>
                ))}
                <th className="pb-3 pl-2 font-medium text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {report.map((r) => (
                <tr key={r.user.uid} className="border-b border-slate-50">
                  <td className="py-2 pr-2 font-medium sticky left-0 bg-white whitespace-nowrap">{r.user.nama}</td>
                  <td className="py-2 pr-2 whitespace-nowrap">{r.user.blok}/{r.user.noRumah}</td>
                  {MONTHS.map((_, i) => {
                    const paid = r.paidMonths.has(i + 1);
                    return (
                      <td key={i} className="py-2 px-1 text-center">
                        <span
                          className={`inline-block h-5 w-5 rounded-full text-[10px] leading-5 ${
                            paid ? 'bg-emerald-500 text-white' : 'bg-red-100 text-red-500'
                          }`}
                        >
                          {paid ? '✓' : '✗'}
                        </span>
                      </td>
                    );
                  })}
                  <td className="py-2 pl-2 text-center font-medium">
                    {r.paidCount}/12
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {report.length === 0 && <p className="py-8 text-center text-slate-400">Tidak ada data sesuai filter</p>}
        </div>
      )}
    </div>
  );
}
