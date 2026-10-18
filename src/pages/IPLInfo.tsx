import { Wallet, Calendar, CreditCard, CheckCircle } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { Link } from 'react-router-dom';
import { MONTHS } from '../types';

export default function IPLInfo() {
  const { settings } = useSettings();
  const amount = settings.iplAmount || 150000;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="text-center mb-10">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100">
          <Wallet className="text-teal-600" size={28} />
        </div>
        <h1 className="font-display text-3xl font-bold text-slate-900">Iuran Pemeliharaan Lingkungan</h1>
        <p className="mt-2 text-slate-500">Informasi lengkap mengenai IPL Perumahan</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 mb-10">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="text-teal-600" size={22} />
            <h3 className="font-semibold text-slate-900">Nominal IPL</h3>
          </div>
          <p className="text-3xl font-bold text-teal-600">
            Rp {amount.toLocaleString('id-ID')}
          </p>
          <p className="mt-1 text-sm text-slate-500">per bulan / unit rumah</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="text-teal-600" size={22} />
            <h3 className="font-semibold text-slate-900">Jatuh Tempo</h3>
          </div>
          <p className="text-3xl font-bold text-teal-600">
            Tanggal {settings.iplDueDay || 10}
          </p>
          <p className="mt-1 text-sm text-slate-500">setiap bulan</p>
        </div>
      </div>

      <div className="card mb-8">
        <h3 className="font-display text-lg font-semibold text-slate-900 mb-4">
          Manfaat IPL
        </h3>
        <ul className="space-y-3">
          {[
            'Pemeliharaan fasilitas umum (taman, jalan, pagar, gerbang)',
            'Biaya kebersihan dan pengangkutan sampah',
            'Keamanan lingkungan (satpam / pos jaga)',
            'Penerangan jalan dan area bersama',
            'Kegiatan sosial dan event warga',
            'Perbaikan infrastruktur minor',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
              <CheckCircle className="text-teal-500 shrink-0 mt-0.5" size={18} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="card mb-8">
        <h3 className="font-display text-lg font-semibold text-slate-900 mb-3">
          Cara Pembayaran
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
          <li>Login ke akun warga Anda</li>
          <li>Buka menu <strong>Upload Bukti</strong></li>
          <li>Pilih bulan & tahun yang ingin dibayar</li>
          <li>Upload foto / screenshot bukti transfer</li>
          <li>Tunggu verifikasi dari admin (biasanya 1x24 jam)</li>
        </ol>
        <p className="mt-4 text-sm text-slate-500">
          Atau bayar langsung ke pengurus dan minta dicatat di sistem.
        </p>
      </div>

      <div className="text-center">
        <Link to="/login" className="btn-primary">
          Login untuk Cek Status IPL
        </Link>
      </div>
    </div>
  );
}
