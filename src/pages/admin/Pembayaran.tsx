import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import type { Payment, AppUser } from '../../types';
import { MONTHS } from '../../types';
import { Check, X, Plus, Loader2, ExternalLink } from 'lucide-react';

export default function AdminPembayaran() {
  const { profile } = useAuth();
  const { settings } = useSettings();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('pending');
  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState({
    userId: '',
    bulan: new Date().getMonth() + 1,
    tahun: new Date().getFullYear(),
    jumlah: settings.iplAmount || 150000,
    catatan: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub1 = onSnapshot(
      query(collection(db, 'payments'), orderBy('createdAt', 'desc')),
      (snap) => {
        setPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payment)));
        setLoading(false);
      }
    );
    const unsub2 = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(
        snap.docs
          .map((d) => ({ uid: d.id, ...d.data() } as AppUser))
          .filter((u) => u.role === 'warga')
      );
    });
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const filtered = payments.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const verify = async (id: string, status: 'verified' | 'rejected') => {
    await updateDoc(doc(db, 'payments', id), {
      status,
      verifiedBy: profile?.uid,
      verifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleManual = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find((u) => u.uid === manual.userId);
    if (!user) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'payments'), {
        userId: user.uid,
        nama: user.nama,
        blok: user.blok,
        noRumah: user.noRumah,
        bulan: manual.bulan,
        tahun: manual.tahun,
        jumlah: Number(manual.jumlah),
        status: 'verified',
        catatan: manual.catatan || 'Input manual oleh admin',
        verifiedBy: profile?.uid,
        verifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setShowManual(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Pembayaran IPL</h1>
        <button className="btn-primary" onClick={() => setShowManual(!showManual)}>
          <Plus size={16} /> Input Manual
        </button>
      </div>

      {showManual && (
        <form onSubmit={handleManual} className="card mb-6 space-y-3">
          <h3 className="font-semibold">Input Pembayaran Manual</h3>
          <select
            className="input-field"
            required
            value={manual.userId}
            onChange={(e) => setManual({ ...manual, userId: e.target.value })}
          >
            <option value="">Pilih warga...</option>
            {users.map((u) => (
              <option key={u.uid} value={u.uid}>
                {u.nama} — Blok {u.blok} No.{u.noRumah}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-3 gap-3">
            <select className="input-field" value={manual.bulan} onChange={(e) => setManual({ ...manual, bulan: Number(e.target.value) })}>
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
            <input type="number" className="input-field" value={manual.tahun} onChange={(e) => setManual({ ...manual, tahun: Number(e.target.value) })} />
            <input type="number" className="input-field" value={manual.jumlah} onChange={(e) => setManual({ ...manual, jumlah: Number(e.target.value) })} />
          </div>
          <input className="input-field" placeholder="Catatan" value={manual.catatan} onChange={(e) => setManual({ ...manual, catatan: e.target.value })} />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={16} /> : 'Simpan'}</button>
            <button type="button" className="btn-secondary" onClick={() => setShowManual(false)}>Batal</button>
          </div>
        </form>
      )}

      <div className="flex gap-2 mb-4">
        {(['pending', 'verified', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              filter === f ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {f === 'pending' ? 'Menunggu' : f === 'verified' ? 'Terverifikasi' : 'Semua'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-teal-600" size={28} /></div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-3 pr-3 font-medium">Nama</th>
                <th className="pb-3 pr-3 font-medium">Blok</th>
                <th className="pb-3 pr-3 font-medium">Bulan</th>
                <th className="pb-3 pr-3 font-medium">Jumlah</th>
                <th className="pb-3 pr-3 font-medium">Status</th>
                <th className="pb-3 pr-3 font-medium">Bukti</th>
                <th className="pb-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-slate-50">
                  <td className="py-3 pr-3 font-medium">{p.nama}</td>
                  <td className="py-3 pr-3">{p.blok}/{p.noRumah}</td>
                  <td className="py-3 pr-3">{MONTHS[p.bulan - 1]} {p.tahun}</td>
                  <td className="py-3 pr-3">Rp {p.jumlah.toLocaleString('id-ID')}</td>
                  <td className="py-3 pr-3">
                    <span className={`badge ${p.status === 'verified' ? 'badge-success' : p.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 pr-3">
                    {p.buktiUrl ? (
                      <a href={p.buktiUrl} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline inline-flex items-center gap-1">
                        Lihat <ExternalLink size={12} />
                      </a>
                    ) : '-'}
                  </td>
                  <td className="py-3">
                    {p.status === 'pending' && (
                      <div className="flex gap-1">
                        <button onClick={() => verify(p.id, 'verified')} className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600 hover:bg-emerald-100" title="Verifikasi">
                          <Check size={16} />
                        </button>
                        <button onClick={() => verify(p.id, 'rejected')} className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100" title="Tolak">
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="py-8 text-center text-slate-400">Tidak ada data</p>}
        </div>
      )}
    </div>
  );
}
