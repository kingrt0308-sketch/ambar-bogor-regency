import { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { useSettings } from '../../contexts/SettingsContext';
import { Loader2, Save, CheckCircle } from 'lucide-react';

export default function Pengaturan() {
  const { settings, updateSettings } = useSettings();
  const [form, setForm] = useState(settings);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      let logoUrl = form.logoUrl;
      if (logoFile) {
        const storageRef = ref(storage, `settings/logo-${Date.now()}-${logoFile.name}`);
        await uploadBytes(storageRef, logoFile);
        logoUrl = await getDownloadURL(storageRef);
      }
      await updateSettings({ ...form, logoUrl });
      setSuccess(true);
      setLogoFile(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">Pengaturan</h1>
      <p className="text-slate-500 mb-6">Ubah tampilan, logo, dan konfigurasi aplikasi</p>

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle size={18} /> Pengaturan berhasil disimpan
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Nama Situs</label>
          <input className="input-field" value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Alamat</label>
          <textarea className="input-field" rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Tentang Perumahan</label>
          <textarea className="input-field" rows={3} value={form.aboutText} onChange={(e) => setForm({ ...form, aboutText: e.target.value })} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Warna Utama</label>
            <div className="flex gap-2">
              <input
                type="color"
                className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200"
                value={form.primaryColor}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
              />
              <input className="input-field" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Warna Aksen</label>
            <div className="flex gap-2">
              <input
                type="color"
                className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200"
                value={form.accentColor}
                onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
              />
              <input className="input-field" value={form.accentColor} onChange={(e) => setForm({ ...form, accentColor: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Nominal IPL (Rp)</label>
            <input type="number" className="input-field" value={form.iplAmount} onChange={(e) => setForm({ ...form, iplAmount: Number(e.target.value) })} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Tgl Jatuh Tempo</label>
            <input type="number" min={1} max={28} className="input-field" value={form.iplDueDay} onChange={(e) => setForm({ ...form, iplDueDay: Number(e.target.value) })} />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Logo</label>
          {form.logoUrl && (
            <img src={form.logoUrl} alt="Logo" className="mb-2 h-16 w-16 rounded-xl object-cover border" />
          )}
          <input type="file" accept="image/*" className="input-field" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
        </div>

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={16} /> Simpan Pengaturan</>}
        </button>
      </form>
    </div>
  );
}
