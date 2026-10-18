# Ambar Bogor Regency — Sistem Manajemen Perumahan

Aplikasi web elegan & responsif untuk mengelola **Iuran Pemeliharaan Lingkungan (IPL)**, kegiatan warga, laporan keuangan, dan data penghuni **Perumahan Ambar Bogor Regency**.

**Alamat:** RT. 03/08, Desa Nagrak, Kecamatan Sukaraja, Kabupaten Bogor, Jawa Barat, Indonesia

## Fitur

### Publik
- Beranda informatif dengan alamat & deskripsi perumahan
- Info IPL (nominal, jatuh tempo, cara bayar)
- Daftar kegiatan warga

### Login Warga
- Dashboard status IPL (grid 12 bulan)
- Riwayat pembayaran per tahun
- Upload bukti pembayaran (gambar/PDF) → status *pending* sampai diverifikasi admin

### Login Admin
- Dashboard ringkasan (jumlah warga, pending verifikasi, lunas bulan ini, saldo)
- Kelola data warga (tambah user, aktif/nonaktif)
- Verifikasi / tolak bukti pembayaran IPL + input manual
- **Laporan IPL**: cari by nama / blok, tampilkan status bayar per bulan & tahun (✓/✗)
- Input pemasukan & pengeluaran (selain IPL) + rekap saldo
- Kelola kegiatan (CRUD + upload gambar)
- **Pengaturan**: nama situs, alamat, tentang, warna tema, logo, nominal IPL, tgl jatuh tempo

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v6
- **Backend / DB:** Firebase (Authentication, Firestore, Storage)
- **Icons:** Lucide React
- **Date:** date-fns

## Setup Firebase

1. Buat project di [Firebase Console](https://console.firebase.google.com/)
2. Aktifkan **Authentication** → Email/Password
3. Buat **Firestore Database** (mode production atau test)
4. Aktifkan **Storage**
5. Daftarkan Web App, salin config
6. Buat file `.env` dari `.env.example` dan isi nilai Firebase:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Rules Firestore (contoh)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuth() { return request.auth != null; }
    function isAdmin() {
      return isAuth() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /users/{userId} {
      allow read: if isAuth();
      allow write: if isAdmin() || (isAuth() && request.auth.uid == userId);
    }
    match /payments/{id} {
      allow read: if isAuth();
      allow create: if isAuth();
      allow update, delete: if isAdmin();
    }
    match /transactions/{id} {
      allow read: if isAuth();
      allow write: if isAdmin();
    }
    match /activities/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /settings/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

### Storage Rules (contoh)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /bukti/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /activities/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /settings/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Membuat Admin Pertama

1. Daftar sebagai warga biasa lewat aplikasi, **atau** buat user di Firebase Auth Console
2. Di Firestore → collection `users` → document UID user tersebut, set field:
   - `role`: `"admin"`
   - `nama`, `blok`, `noRumah`, `email`, `active`: `true`, `createdAt`: ISO string

## Menjalankan Lokal

```bash
npm install
npm run dev
```

Buka http://localhost:5173

## Build untuk Production

```bash
npm run build
```

Output di folder `dist/`. Bisa di-deploy ke:

- **Firebase Hosting** (direkomendasikan, sama project)
- Vercel / Netlify / GitHub Pages

### Deploy Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # pilih folder dist, single-page app: Yes
npm run build
firebase deploy
```

## Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit: Ambar Bogor Regency CMS"
git branch -M main
git remote add origin https://github.com/USERNAME/ambar-bogor-regency.git
git push -u origin main
```

**Jangan commit file `.env`** (sudah ada di `.gitignore`).

## Struktur Folder

```
src/
  components/     Layout, ProtectedRoute
  contexts/       AuthContext, SettingsContext
  lib/            firebase.ts
  pages/
    admin/        Dashboard, Warga, Pembayaran, Laporan, Transaksi, Kegiatan, Pengaturan
    warga/        Dashboard, StatusIPL, UploadBukti
    Home, IPLInfo, Kegiatan, Login
  types/          TypeScript interfaces
```

## Catatan

- Aplikasi dirancang **mobile-first** dan responsif.
- Tema warna (primary) bisa diubah dari menu Pengaturan admin dan langsung diterapkan via CSS variable.
- Semua data real-time lewat Firestore `onSnapshot`.
- Upload bukti & logo menggunakan Firebase Storage.
