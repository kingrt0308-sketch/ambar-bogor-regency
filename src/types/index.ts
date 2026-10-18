export type UserRole = 'admin' | 'warga';

export interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
  nama: string;
  blok: string;
  noRumah: string;
  phone?: string;
  fotoUrl?: string;
  createdAt: string;
  active: boolean;
}

export type PaymentStatus = 'pending' | 'verified' | 'rejected';

export interface Payment {
  id: string;
  userId: string;
  nama: string;
  blok: string;
  noRumah: string;
  bulan: number; // 1-12
  tahun: number;
  jumlah: number;
  status: PaymentStatus;
  buktiUrl?: string;
  catatan?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  kategori: string;
  jumlah: number;
  deskripsi: string;
  tanggal: string;
  createdBy: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  judul: string;
  deskripsi: string;
  tanggal: string;
  lokasi?: string;
  gambarUrl?: string;
  createdAt: string;
  createdBy: string;
}

export interface AppSettings {
  siteName: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  address: string;
  phone?: string;
  email?: string;
  iplAmount: number;
  iplDueDay: number; // tanggal jatuh tempo
  aboutText: string;
}

export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const DEFAULT_SETTINGS: AppSettings = {
  siteName: 'Ambar Bogor Regency',
  logoUrl: '',
  primaryColor: '#0d9488',
  accentColor: '#f59e0b',
  address: 'RT. 03/08, Desa Nagrak, Kecamatan Sukaraja, Kabupaten Bogor, Jawa Barat, Indonesia',
  phone: '',
  email: '',
  iplAmount: 150000,
  iplDueDay: 10,
  aboutText: 'Perumahan Ambar Bogor Regency adalah kawasan hunian yang asri dan nyaman di Kabupaten Bogor. Kami berkomitmen menjaga kebersihan, keamanan, dan kenyamanan bersama seluruh warga.',
};
