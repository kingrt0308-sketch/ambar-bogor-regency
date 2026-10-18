import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { MONTHS } from '../../types';
import { Upload, Loader2, CheckCircle } from 'lucide-react';

export default function UploadBukti() {
  const { profile } = useAuth();
  const { settings } = useSettings();
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [jumlah, setJumlah] = useState(settings.iplAmount || 150000);
  const [catatan, setCatatan] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !file) {
      setError('Pilih file bukti pembayaran');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const storageRef = ref(
        storage,
        `bukti/${profile.uid}/${tahun}-${bulan}-${Date.now()}-${file.name}`
      );
      await uploadBytes(storageRef, file);
      const buktiUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'payments'), {
        userId: profile.uid,
        nama: profile.nama,
        blok: profile.blok,
        noRumah: profile.noRumah,
        bulan,
        tahun,
        jumlah: Number(jumlah),
        status: 'pending',
        buktiUrl,
        catatan: catatan || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setSuccess(true);
      setFile(null);
      setCatatan('');
    } catch (err: any) {
      setError(err.message || 'Gagal mengunggah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">Upload Bukti Pembayaran</h1>
      <p className="text-slate-500 mb-6">Unggah bukti transfer IPL Anda</p>

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle size={18} />
          Bukti berhasil diunggah! Menunggu verifikasi admin.
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Bulan</label>
            <select
              className="input-field"
              value={bulan}
              onChange={(e) => setBulan(Number(e.target.value))}
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Tahun</label>
            <input
              type="number"
              className="input-field"
              value={tahun}
              onChange={(e) => setTahun(Number(e.target.value))}
              min={2020}
              max={2030}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Jumlah (Rp)</label>
          <input
            type="number"
            className="input-field"
            value={jumlah}
            onChange={(e) => setJumlah(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Bukti Transfer</label>
          <input
            type="file"
            accept="image/*,.pdf"
            className="input-field"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
          <p className="mt-1 text-xs text-slate-400">Format: JPG, PNG, atau PDF (max 5MB)</p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Catatan (opsional)</label>
          <textarea
            className="input-field"
            rows={2}
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Misal: Transfer dari BCA a/n ..."
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : <><Upload size={16} /> Kirim Bukti</>}
        </button>
      </form>
    </div>
  );
}
