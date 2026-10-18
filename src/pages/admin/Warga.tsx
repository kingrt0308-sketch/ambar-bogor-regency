import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import type { AppUser } from '../../types';
import { Search, UserPlus, Loader2 } from 'lucide-react';

export default function AdminWarga() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    nama: '',
    blok: '',
    noRumah: '',
    phone: '',
    role: 'warga' as 'warga' | 'admin',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as AppUser)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.nama?.toLowerCase().includes(q) ||
      u.blok?.toLowerCase().includes(q) ||
      u.noRumah?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: form.email,
        role: form.role,
        nama: form.nama,
        blok: form.blok,
        noRumah: form.noRumah,
        phone: form.phone,
        createdAt: new Date().toISOString(),
        active: true,
      });
      setShowForm(false);
      setForm({ email: '', password: '', nama: '', blok: '', noRumah: '', phone: '', role: 'warga' });
    } catch (err: any) {
      setError(err.message || 'Gagal membuat user');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (uid: string, active: boolean) => {
    await updateDoc(doc(db, 'users', uid), { active: !active });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Data Warga</h1>
          <p className="text-slate-500 text-sm">{users.filter((u) => u.role === 'warga').length} warga terdaftar</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <UserPlus size={16} /> Tambah User
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6 space-y-3">
          <h3 className="font-semibold">Tambah User Baru</h3>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="input-field" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="input-field" placeholder="Password (min 6)" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <input className="input-field" placeholder="Nama" required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
            <input className="input-field" placeholder="No. HP" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className="input-field" placeholder="Blok" required value={form.blok} onChange={(e) => setForm({ ...form, blok: e.target.value })} />
            <input className="input-field" placeholder="No. Rumah" required value={form.noRumah} onChange={(e) => setForm({ ...form, noRumah: e.target.value })} />
            <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })}>
              <option value="warga">Warga</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" size={16} /> : 'Simpan'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Batal</button>
          </div>
        </form>
      )}

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          className="input-field pl-10"
          placeholder="Cari nama, blok, no rumah, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
                <th className="pb-3 pr-3 font-medium">No</th>
                <th className="pb-3 pr-3 font-medium">Email</th>
                <th className="pb-3 pr-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.uid} className="border-b border-slate-50">
                  <td className="py-3 pr-3 font-medium">{u.nama}</td>
                  <td className="py-3 pr-3">{u.blok}</td>
                  <td className="py-3 pr-3">{u.noRumah}</td>
                  <td className="py-3 pr-3 text-slate-500">{u.email}</td>
                  <td className="py-3 pr-3">
                    <span className={`badge ${u.role === 'admin' ? 'badge-info' : 'badge-success'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => toggleActive(u.uid, u.active)}
                      className={`badge ${u.active ? 'badge-success' : 'badge-danger'} cursor-pointer`}
                    >
                      {u.active ? 'Aktif' : 'Nonaktif'}
                    </button>
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
