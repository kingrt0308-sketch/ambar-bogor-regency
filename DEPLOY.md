# Panduan Deploy — Ambar Bogor Regency (GitHub Pages)

## Prasyarat
- Akun GitHub
- Akun Firebase (Auth + Firestore + Storage sudah aktif)
- Node.js 18+ terpasang

---

## 1. Isi konfigurasi Firebase

```bash
cp .env.example .env
```

Edit file `.env`, isi dengan data dari Firebase Console → Project Settings → Your apps:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

## 2. Sesuaikan nama repository (jika berbeda)

Jika nama repo GitHub **bukan** `ambar-bogor-regency`, ubah di 2 file:

1. **`vite.config.ts`** → konstanta `REPO_NAME`
2. **`src/main.tsx`** → konstanta `BASENAME`

Keduanya harus sama, contoh: `/nama-repo-anda`

---

## 3. Install & tes lokal

```bash
npm install
npm run dev
```

Buka http://localhost:5173/ambar-bogor-regency/

---

## 4. Buat repository GitHub & push

```bash
git init
git add .
git commit -m "Siap deploy Ambar Bogor Regency"
git branch -M main
git remote add origin https://github.com/USERNAME/ambar-bogor-regency.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub Anda.

---

## 5. Deploy ke GitHub Pages

```bash
npm run deploy
```

Perintah ini otomatis:
- Build aplikasi
- Salin `index.html` → `404.html` (agar routing SPA tidak error)
- Upload ke branch `gh-pages`

---

## 6. Aktifkan GitHub Pages

1. Buka repo di GitHub → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** → folder **/ (root)** → **Save**

Tunggu 1–3 menit.

**URL website:**
```
https://USERNAME.github.io/ambar-bogor-regency/
```

---

## 7. Izinkan domain di Firebase

Firebase Console → **Authentication** → **Settings** → **Authorized domains**  
Tambahkan: `USERNAME.github.io`

---

## 8. Buat Admin pertama

1. Daftar sebagai warga di website
2. Firebase Console → **Firestore** → collection `users`
3. Ubah field `role` menjadi `"admin"`

---

## Update selanjutnya

Setiap kali ubah kode:

```bash
npm run deploy
```

---

## Catatan

- Jangan commit file `.env`
- Firebase tetap dipakai untuk login, database, dan upload file
- GitHub Pages hanya untuk hosting file frontend (HTML/CSS/JS)
