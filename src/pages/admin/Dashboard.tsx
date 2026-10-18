import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useSettings } from '../../contexts/SettingsContext';
import { Users, Wallet, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { settings } = useSettings();
  const [stats, setStats] = useState({
    warga: 0,
    pending: 0,
    verifiedThisMonth: 0,
    income: 0,
    expense: 0,
  });

  useEffect(() => {
    const unsubs: (() => void)[] = [];

    unsubs.push(
      onSnapshot(collection(db, 'users'), (snap) => {
        setStats((s) => ({
          ...s,
          warga: snap.docs.filter((d) => d.data().role === 'warga').length,
        }));
      })
    );

    unsubs.push(
      onSnapshot(
        query(collection(db, 'payments'), where('status', '==', 'pending')),
        (snap) => setStats((s) => ({ ...s, pending: snap.size }))
      )
    );

    const now = new Date();
    unsubs.push(
      onSnapshot(collection(db, 'payments'), (snap) => {
        let count = 0;
        snap.docs.forEach((d) => {
          const p = d.data();
          if (
            p.status === 'verified' &&
            p.bulan === now.getMonth() + 1 &&
            p.tahun === now.getFullYear()
          ) {
            count++;
          }
        });
        setStats((s) => ({ ...s, verifiedThisMonth: count }));
      })
    );

    unsubs.push(
      onSnapshot(collection(db, 'transactions'), (snap) => {
        let income = 0;
        let expense = 0;
        snap.docs.forEach((d) => {
          const t = d.data();
          if (t.type === 'income') income += t.jumlah || 0;
          else expense += t.jumlah || 0;
        });
        setStats((s) => ({ ...s, income, expense }));
      })
    );

    return () => unsubs.forEach((u) => u());
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">Dashboard Admin</h1>
      <p className="text-slate-500 mb-8">{settings.siteName}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50">
              <Users className="text-sky-600" size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.warga}</p>
              <p className="text-xs text-slate-500">Total Warga</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
              <Clock className="text-amber-600" size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-slate-500">Menunggu Verifikasi</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <Wallet className="text-emerald-600" size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.verifiedThisMonth}</p>
              <p className="text-xs text-slate-500">Lunas bulan ini</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
              <TrendingUp className="text-teal-600" size={22} />
            </div>
            <div>
              <p className="text-lg font-bold">
                Rp {(stats.income - stats.expense).toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-slate-500">Saldo (non-IPL)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { to: '/admin/pembayaran', title: 'Verifikasi Pembayaran', desc: 'Cek & verifikasi bukti IPL warga' },
          { to: '/admin/warga', title: 'Data Warga', desc: 'Kelola data penghuni per blok' },
          { to: '/admin/laporan', title: 'Laporan IPL', desc: 'Cari status bayar by blok / nama' },
          { to: '/admin/transaksi', title: 'Transaksi', desc: 'Input pemasukan & pengeluaran' },
          { to: '/admin/kegiatan', title: 'Kegiatan', desc: 'Tambah / edit agenda warga' },
          { to: '/admin/pengaturan', title: 'Pengaturan', desc: 'Logo, warna, nominal IPL' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="card hover:shadow-md hover:border-teal-100 transition group"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-teal-700">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
