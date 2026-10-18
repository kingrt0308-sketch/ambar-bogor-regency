import { Link } from 'react-router-dom';
import { MapPin, Shield, Leaf, Users, ArrowRight, Wallet, Calendar } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export default function Home() {
  const { settings } = useSettings();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-teal-100">
              Selamat Datang
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
              {settings.siteName}
            </h1>
            <p className="mt-4 text-lg text-teal-50 leading-relaxed">
              {settings.aboutText}
            </p>
            <div className="mt-6 flex items-start gap-2 text-teal-100">
              <MapPin size={20} className="mt-0.5 shrink-0" />
              <span className="text-sm">{settings.address}</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-teal-700 shadow-lg hover:bg-teal-50 transition"
              >
                Login Warga / Admin
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/ipl"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 transition"
              >
                Info IPL
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Layanan Digital Perumahan
          </h2>
          <p className="mt-2 text-slate-500">Mudah, transparan, dan terintegrasi</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <Wallet className="text-teal-600" size={28} />,
              title: 'Iuran IPL',
              desc: 'Cek status pembayaran IPL per bulan, upload bukti, dan pantau riwayat dengan mudah.',
              to: '/ipl',
            },
            {
              icon: <Calendar className="text-teal-600" size={28} />,
              title: 'Kegiatan',
              desc: 'Informasi agenda dan kegiatan warga perumahan yang transparan dan up-to-date.',
              to: '/kegiatan',
            },
            {
              icon: <Shield className="text-teal-600" size={28} />,
              title: 'Transparansi',
              desc: 'Laporan keuangan, rekap pemasukan & pengeluaran tersedia untuk admin dan warga.',
              to: '/login',
            },
            {
              icon: <Users className="text-teal-600" size={28} />,
              title: 'Data Warga',
              desc: 'Manajemen data penghuni per blok rumah, pencarian cepat status pembayaran.',
              to: '/login',
            },
            {
              icon: <Leaf className="text-teal-600" size={28} />,
              title: 'Lingkungan Asri',
              desc: 'Komitmen menjaga kebersihan dan kenyamanan bersama seluruh warga.',
              to: '/',
            },
            {
              icon: <MapPin className="text-teal-600" size={28} />,
              title: 'Lokasi Strategis',
              desc: settings.address,
              to: '/',
            },
          ].map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="card group hover:shadow-md hover:border-teal-100 transition"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 group-hover:bg-teal-100 transition">
                {f.icon}
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Sudah jadi warga {settings.siteName}?
          </h2>
          <p className="mt-2 text-slate-300">
            Login sekarang untuk cek status IPL dan upload bukti pembayaran.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-400 transition"
          >
            Masuk ke Akun
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
