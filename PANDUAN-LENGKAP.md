# PANDUAN LENGKAP — Ambar Bogor Regency
# Dari nol sampai website online (langkah demi langkah)

Ikuti **satu per satu**. Jangan loncat.

------------------------------------------------------------
BAGIAN A — PERSIAPAN FIREBASE (di browser)
------------------------------------------------------------

1. Buka Google Chrome / browser
2. Ketik alamat: https://console.firebase.google.com
3. Login dengan akun Google
4. Klik tombol "Add project" atau "Tambah project"
5. Isi nama project: ambar-bogor-regency
6. Klik Continue / Lanjutkan sampai project selesai dibuat

7. Setelah masuk ke project:
   - Di menu kiri, klik "Build" lalu "Authentication"
   - Klik "Get started"
   - Pilih "Email/Password" → nyalakan (Enable) → Save

8. Menu kiri → "Build" → "Firestore Database"
   - Klik "Create database"
   - Pilih "Start in test mode"
   - Pilih lokasi (boleh Asia) → Enable

9. Menu kiri → "Build" → "Storage"
   - Klik "Get started" → Next → Done

10. Ambil data konfigurasi:
    - Klik ikon gerigi di kiri atas (Project settings)
    - Scroll ke bawah sampai "Your apps"
    - Klik ikon "</>" (Web)
    - Isi App nickname: ambar-web
    - Klik Register app
    - Akan muncul kotak berisi apiKey, authDomain, projectId, dll.
    - JANGAN DITUTUP dulu — nanti disalin ke file .env


------------------------------------------------------------
BAGIAN B — BUKA FOLDER KODE DI KOMPUTER
------------------------------------------------------------

Folder kode ada di:

   artifacts / ambar-app

Cara membuka:

CARA 1 — Pakai VS Code atau Cursor (disarankan)
  1. Buka aplikasi VS Code atau Cursor
  2. Menu File → Open Folder
  3. Cari dan pilih folder "ambar-app"
  4. Klik Open / Pilih Folder

CARA 2 — Pakai File Explorer (Windows)
  1. Buka File Explorer
  2. Masuk ke folder project Anda sampai menemukan folder "ambar-app"
  3. Klik kanan di dalam folder ambar-app → "Open in Terminal"
     (atau "Open PowerShell window here")


------------------------------------------------------------
BAGIAN C — BUAT FILE .env
------------------------------------------------------------

File .env berisi kunci Firebase. Tanpa file ini, login tidak jalan.

LANGKAH:

1. Pastikan Anda sudah membuka folder ambar-app
   (lihat Bagian B)

2. Di dalam folder ambar-app, sudah ada file bernama:
      .env.example

3. Buat salinan file itu dengan nama .env

   --- Jika pakai VS Code / Cursor ---
   a. Klik kanan file .env.example di sidebar kiri
   b. Pilih "Copy"
   c. Klik kanan di area kosong sidebar → "Paste"
   d. Rename file hasil copy menjadi: .env
      (hapus tulisan ".example", sisakan ".env")

   --- Jika pakai Terminal / PowerShell ---
   Ketik perintah ini lalu Enter:

      copy .env.example .env

      (di Mac/Linux ketik: cp .env.example .env)

4. Buka file .env (klik dua kali, atau buka di VS Code)

5. Isinya awalnya seperti ini:

      VITE_FIREBASE_API_KEY=your_api_key
      VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
      VITE_FIREBASE_PROJECT_ID=your_project_id
      VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
      VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
      VITE_FIREBASE_APP_ID=your_app_id

6. Ganti semua nilai di kanan tanda "=" dengan data dari Firebase
   (yang muncul di Bagian A nomor 10).

   Contoh hasil yang benar:

      VITE_FIREBASE_API_KEY=AIzaSyAbc123xyz...
      VITE_FIREBASE_AUTH_DOMAIN=ambar-bogor-regency.firebaseapp.com
      VITE_FIREBASE_PROJECT_ID=ambar-bogor-regency
      VITE_FIREBASE_STORAGE_BUCKET=ambar-bogor-regency.appspot.com
      VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
      VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

7. Simpan file (Ctrl + S)


------------------------------------------------------------
BAGIAN D — INSTALL & JALANKAN DI KOMPUTER (TES LOKAL)
------------------------------------------------------------

1. Buka Terminal di dalam folder ambar-app

   Cara di VS Code / Cursor:
   - Menu atas: Terminal → New Terminal
   - Atau tekan tombol: Ctrl + `  (tombol di bawah Esc)

2. Ketik perintah ini lalu Enter:

      npm install

   Tunggu sampai selesai (bisa 1–3 menit).
   Jangan tutup terminal.

3. Setelah selesai, ketik:

      npm run dev

4. Akan muncul tulisan mirip:

      Local: http://localhost:5173/ambar-bogor-regency/

5. Buka browser, ketik alamat itu, tekan Enter.

6. Jika halaman beranda muncul → berarti berhasil.
   Jika error → cek lagi file .env (Bagian C).


------------------------------------------------------------
BAGIAN E — BUAT REPOSITORY DI GITHUB
------------------------------------------------------------

1. Buka browser → https://github.com
2. Login
3. Klik tombol "+" di kanan atas → "New repository"
4. Repository name ketik: ambar-bogor-regency
5. Pilih Public
6. JANGAN centang "Add a README"
7. Klik "Create repository"

8. Setelah repo dibuat, GitHub menampilkan perintah.
   Salin URL repo Anda, contoh:
      https://github.com/nama-anda/ambar-bogor-regency.git


------------------------------------------------------------
BAGIAN F — KIRIM KODE KE GITHUB
------------------------------------------------------------

1. Buka Terminal lagi di folder ambar-app
   (sama seperti Bagian D)

2. Ketik perintah berikut satu per satu, setiap baris lalu Enter:

      git init

      git add .

      git commit -m "Pertama kali upload"

      git branch -M main

      git remote add origin https://github.com/NAMA-GITHUB-ANDA/ambar-bogor-regency.git

   (Ganti NAMA-GITHUB-ANDA dengan username GitHub Anda)

      git push -u origin main

3. Jika diminta login GitHub, ikuti petunjuk di layar
   (bisa muncul browser untuk login).

4. Setelah berhasil, buka repo di GitHub — file-file sudah terlihat.


------------------------------------------------------------
BAGIAN G — DEPLOY (BUAT WEBSITE ONLINE)
------------------------------------------------------------

1. Masih di Terminal folder ambar-app, ketik:

      npm run deploy

2. Tunggu sampai selesai.
   Proses ini mengupload website ke GitHub.

3. Aktifkan GitHub Pages:
   a. Buka repository di GitHub
   b. Klik tab "Settings"
   c. Menu kiri → klik "Pages"
   d. Di bagian Source:
      - Branch pilih: gh-pages
      - Folder pilih: / (root)
   e. Klik Save

4. Tunggu 1–3 menit.

5. Alamat website Anda:
      https://NAMA-GITHUB-ANDA.github.io/ambar-bogor-regency/

   Ganti NAMA-GITHUB-ANDA dengan username GitHub Anda.


------------------------------------------------------------
BAGIAN H — AGAR LOGIN BISA JALAN DI WEBSITE ONLINE
------------------------------------------------------------

1. Buka Firebase Console lagi
2. Authentication → tab "Settings"
3. Scroll ke "Authorized domains"
4. Klik "Add domain"
5. Ketik: NAMA-GITHUB-ANDA.github.io
   (contoh: budi123.github.io)
6. Klik Add


------------------------------------------------------------
BAGIAN I — BUAT AKUN ADMIN
------------------------------------------------------------

1. Buka website yang sudah online
2. Klik Login → Daftar Warga
3. Isi data dan daftar

4. Buka Firebase Console → Authentication
   - Anda akan melihat email yang baru didaftar
   - Salin "User UID" (kode panjang)

5. Buka Firestore Database
   - Klik collection "users"
   - Cari dokumen dengan UID tersebut
   - Klik field "role"
   - Ubah nilainya dari "warga" menjadi "admin"
   - Simpan

6. Logout dari website, login lagi → sekarang masuk sebagai Admin.


------------------------------------------------------------
UPDATE NANTI (setelah ubah kode)
------------------------------------------------------------

Setiap kali Anda mengubah kode, jalankan lagi:

      npm run deploy

Lalu tunggu 1–2 menit, website otomatis terbarui.


------------------------------------------------------------
YANG SERING SALAH
------------------------------------------------------------

1. File .env belum dibuat atau isinya masih "your_api_key"
   → Login tidak jalan

2. Nama repo di GitHub beda dengan "ambar-bogor-regency"
   → Ubah di 2 file:
      - vite.config.ts (cari tulisan REPO_NAME)
      - src/main.tsx (cari tulisan BASENAME)

3. Lupa tambah domain di Firebase Authorized domains
   → Login error saat di website online

4. npm install belum dijalankan
   → Perintah npm run dev / deploy error

5. Terminal tidak berada di folder ambar-app
   → Perintah gagal / file tidak ketemu
