import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const [blok, setBlok] = useState('');
  const [noRumah, setNoRumah] = useState('');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, registerWarga } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        // Redirect will be handled by checking role after login
        navigate('/dashboard');
      } else {
        if (!nama || !blok || !noRumah) {
          setError('Nama, Blok, dan No. Rumah wajib diisi');
          setLoading(false);
          return;
        }
        await registerWarga(email, password, { nama, blok, noRumah, phone });
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg = err?.code || err?.message || 'Terjadi kesalahan';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError('Email atau password salah');
      } else if (msg.includes('email-already-in-use')) {
        setError('Email sudah terdaftar');
      } else if (msg.includes('weak-password')) {
        setError('Password minimal 6 karakter');
      } else {
        setError('Gagal: ' + (err.message || 'Coba lagi'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <div className="w-full card shadow-md">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100">
            {mode === 'login' ? (
              <LogIn className="text-teal-600" size={24} />
            ) : (
              <UserPlus className="text-teal-600" size={24} />
            )}
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            {mode === 'login' ? 'Masuk' : 'Daftar Warga'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {mode === 'login'
              ? 'Login sebagai warga atau admin'
              : 'Buat akun warga baru'}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Nama Lengkap</label>
                <input
                  className="input-field"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama sesuai KTP"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Blok</label>
                  <input
                    className="input-field"
                    value={blok}
                    onChange={(e) => setBlok(e.target.value)}
                    placeholder="A / B / C"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">No. Rumah</label>
                  <input
                    className="input-field"
                    value={noRumah}
                    onChange={(e) => setNoRumah(e.target.value)}
                    placeholder="12"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">No. HP (opsional)</label>
                <input
                  className="input-field"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                className="input-field pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : mode === 'login' ? (
              'Masuk'
            ) : (
              'Daftar'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {mode === 'login' ? (
            <>
              Belum punya akun?{' '}
              <button
                type="button"
                className="font-semibold text-teal-600 hover:underline"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
              >
                Daftar Warga
              </button>
            </>
          ) : (
            <>
              Sudah punya akun?{' '}
              <button
                type="button"
                className="font-semibold text-teal-600 hover:underline"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
              >
                Masuk
              </button>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Admin: gunakan akun yang sudah didaftarkan di Firebase Console / Firestore.
        </p>
      </div>
    </div>
  );
}
