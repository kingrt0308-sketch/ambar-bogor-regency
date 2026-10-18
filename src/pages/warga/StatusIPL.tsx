import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { Payment } from '../../types';
import { MONTHS } from '../../types';
import { Loader2 } from 'lucide-react';

export default function StatusIPL() {
  const { profile } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

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

  const years = Array.from(new Set(payments.map((p) => p.tahun))).sort((a, b) => b - a);
  if (!years.includes(yearFilter) && years.length) setYearFilter(years[0]);
  if (!years.includes(new Date().getFullYear())) years.unshift(new Date().getFullYear());

  const filtered = payments.filter((p) => p.tahun === yearFilter);
  const paidMap = new Map(filtered.filter((p) => p.status === 'verified').map((p) => [p.bulan, p]));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">Status Pembayaran IPL</h1>
      <p className="text-slate-500 mb-6">
        Blok {profile?.blok} No. {profile?.noRumah} — {profile?.nama}
      </p>

      <div className="mb-6">
        <label className="text-sm font-medium text-slate-700 mr-2">Tahun:</label>
        <select
          className="input-field w-auto"
          value={yearFilter}
          onChange={(e) => setYearFilter(Number(e.target.value))}
        >
          {[...new Set([new Date().getFullYear(), ...years])].sort((a, b) => b - a).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-teal-600" size={32} />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-3 pr-4 font-medium">Bulan</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Jumlah</th>
                <th className="pb-3 font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS.map((m, i) => {
                const month = i + 1;
                const p = filtered.find((x) => x.bulan === month);
                const verified = paidMap.get(month);
                return (
                  <tr key={m} className="border-b border-slate-50">
                    <td className="py-3 pr-4 font-medium">{m}</td>
                    <td className="py-3 pr-4">
                      {verified ? (
                        <span className="badge badge-success">Lunas</span>
                      ) : p?.status === 'pending' ? (
                        <span className="badge badge-warning">Menunggu Verifikasi</span>
                      ) : p?.status === 'rejected' ? (
                        <span className="badge badge-danger">Ditolak</span>
                      ) : (
                        <span className="badge badge-danger">Belum Bayar</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {p ? `Rp ${p.jumlah.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="py-3 text-slate-500">
                      {p?.createdAt
                        ? new Date(p.createdAt).toLocaleDateString('id-ID')
                        : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
