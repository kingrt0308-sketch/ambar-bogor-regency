import { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { Activity } from '../../types';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function KegiatanAdmin() {
  const { profile } = useAuth();
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    judul: '',
    deskripsi: '',
    tanggal: new Date().toISOString().slice(0, 10),
    lokasi: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'activities'), orderBy('tanggal', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Activity)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let gambarUrl = '';
      if (file) {
        const storageRef = ref(storage, `activities/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        gambarUrl = await getDownloadURL(storageRef);
      }
      await addDoc(collection(db, 'activities'), {
        ...form,
        gambarUrl,
        createdBy: profile?.uid || '',
        createdAt: new Date().toISOString(),
      });
      setShowForm(false);
      setForm({ judul: '', deskripsi: '', tanggal: new Date().toISOString().slice(0, 10), lokasi: '' });
      setFile(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kegiatan ini?')) return;
    await deleteDoc(doc(db, 'activities', id));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Kelola Kegiatan</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Tambah Kegiatan
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-3">
          <input className="input-field" placeholder="Judul kegiatan" required value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} />
          <textarea className="input-field" rows={3} placeholder="Deskripsi" required value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input type="date" className="input-field" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
            <input className="input-field" placeholder="Lokasi (opsional)" value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} />
          </div>
          <input type="file" accept="image/*" className="input-field" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={16} /> : 'Simpan'}</button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Batal</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-teal-600" size={28} /></div>
      ) : items.length === 0 ? (
        <div className="card text-center py-12 text-slate-400">Belum ada kegiatan</div>
      ) : (
        <div className="space-y-4">
          {items.map((a) => (
            <div key={a.id} className="card flex gap-4">
              {a.gambarUrl && <img src={a.gambarUrl} alt="" className="h-20 w-20 rounded-xl object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900">{a.judul}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {format(new Date(a.tanggal), 'd MMMM yyyy', { locale: id })}
                  {a.lokasi && ` • ${a.lokasi}`}
                </p>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{a.deskripsi}</p>
              </div>
              <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:text-red-700 p-1 shrink-0">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
