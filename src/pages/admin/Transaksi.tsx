import { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { Transaction } from '../../types';
import { Plus, Trash2, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function AdminTransaksi() {
  const { profile } = useAuth();
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: 'expense' as 'income' | 'expense',
    kategori: '',
    jumlah: 0,
    deskripsi: '',
    tanggal: new Date().toISOString().slice(0, 10),
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('tanggal', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const totalIncome = items.filter((i) => i.type === 'income').reduce((s, i) => s + i.jumlah, 0);
  const totalExpense = items.filter((i) => i.type === 'expense').reduce((s, i) => s + i.jumlah, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, 'transactions'), {
        ...form,
        jumlah: Number(form.jumlah),
        createdBy: profile?.uid || '',
        createdAt: new Date().toISOString(),
      });
      setShowForm(false);
      setForm({ type: 'expense', kategori: '', jumlah: 0, deskripsi: '', tanggal: new Date().toISOString().slice(0, 10) });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus transaksi ini?')) return;
    await deleteDoc(doc(db, 'transactions', id));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Pemasukan & Pengeluaran</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Tambah Transaksi
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="card">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <TrendingUp size={18} /> <span className="text-sm font-medium">Pemasukan</span>
          </div>
          <p className="text-xl font-bold">Rp {totalIncome.toLocaleString('id-ID')}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <TrendingDown size={18} /> <span className="text-sm font-medium">Pengeluaran</span>
          </div>
          <p className="text-xl font-bold">Rp {totalExpense.toLocaleString('id-ID')}</p>
        </div>
        <div className="card">
          <div className="text-sm font-medium text-slate-500 mb-1">Saldo</div>
          <p className={`text-xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-teal-600' : 'text-red-600'}`}>
            Rp {(totalIncome - totalExpense).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-3">
          <h3 className="font-semibold">Transaksi Baru (selain IPL)</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
            <input className="input-field" placeholder="Kategori (mis: Donasi, Perbaikan)" required value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} />
            <input type="number" className="input-field" placeholder="Jumlah" required value={form.jumlah || ''} onChange={(e) => setForm({ ...form, jumlah: Number(e.target.value) })} />
            <input type="date" className="input-field" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
          </div>
          <textarea className="input-field" rows={2} placeholder="Deskripsi" value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={16} /> : 'Simpan'}</button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Batal</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-teal-600" size={28} /></div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-3 pr-3 font-medium">Tanggal</th>
                <th className="pb-3 pr-3 font-medium">Tipe</th>
                <th className="pb-3 pr-3 font-medium">Kategori</th>
                <th className="pb-3 pr-3 font-medium">Jumlah</th>
                <th className="pb-3 pr-3 font-medium">Deskripsi</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id} className="border-b border-slate-50">
                  <td className="py-3 pr-3 whitespace-nowrap">
                    {format(new Date(t.tanggal), 'd MMM yyyy', { locale: id })}
                  </td>
                  <td className="py-3 pr-3">
                    <span className={`badge ${t.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                      {t.type === 'income' ? 'Masuk' : 'Keluar'}
                    </span>
                  </td>
                  <td className="py-3 pr-3">{t.kategori}</td>
                  <td className="py-3 pr-3 font-medium">Rp {t.jumlah.toLocaleString('id-ID')}</td>
                  <td className="py-3 pr-3 text-slate-500 max-w-[200px] truncate">{t.deskripsi}</td>
                  <td className="py-3">
                    <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="py-8 text-center text-slate-400">Belum ada transaksi</p>}
        </div>
      )}
    </div>
  );
}
