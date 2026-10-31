# Panduan Setup & Alur Pengembangan — SkillVentura

Dokumen ini merupakan panduan resmi bagi **Developer** untuk melakukan instalasi dari awal (*clone repository*) hingga aplikasi berjalan, siap melakukan perubahan kode (*development*), dan memverifikasi kualitas kode.

---

## 1. Prasyarat Sistem

Sebelum memulai instalasi, pastikan perangkat lokal Anda telah memenuhi prasyarat berikut:

1. **PHP `>= 8.4`** dengan ekstensi berikut aktif di `php.ini`:
   - `ext-mongodb` (**Wajib** — driver utama MongoDB)
   - `ext-gd` dan `ext-dom` (**Wajib** — digunakan DomPDF untuk merender sertifikat PDF)
   - `ext-mbstring`, `ext-xml`, `ext-curl`, `ext-openssl`
   - Periksa status ekstensi MongoDB dengan perintah:
     ```bash
     php --ri mongodb
     ```
2. **Composer `>= 2.x`**
3. **Node.js `>= 20.x`** dan **npm**

---

## 2. Persiapan API Keys & Layanan Eksternal

Aplikasi membutuhkan 4 kredensial layanan eksternal untuk dimasukkan ke dalam berkas `.env`:

| Layanan | Kredensial / API Key | Keterangan & Cara Mendapatkan |
| :--- | :--- | :--- |
| **MongoDB Atlas** | `MONGODB_URI`<br>`MONGODB_DATABASE` | Buat cluster & database `skillventura` di [MongoDB Atlas](https://cloud.mongodb.com). Buat database user (`readWrite`) dan whitelist IP lokal Anda pada menu **Network Access**. |
| **Object Storage (S3 / R2)** | `AWS_ACCESS_KEY_ID`<br>`AWS_SECRET_ACCESS_KEY`<br>`AWS_BUCKET`<br>`AWS_ENDPOINT` | Kredensial Cloudflare R2 / AWS S3 untuk menyimpan avatar, materi modul, PDF sertifikat, dan tanda tangan digital. |
| **Google Cloud Console** | `GOOGLE_CLIENT_ID`<br>`GOOGLE_CLIENT_SECRET` | Buat OAuth 2.0 Client ID di [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Tambahkan Redirect URI: `http://localhost:8000/auth/google/callback`. |
| **Gmail SMTP** | `MAIL_USERNAME`<br>`MAIL_PASSWORD` | Digunakan untuk email reset password. Gunakan akun Gmail dengan **16-digit App Password** (dibuat dari menu *Google Account $\rightarrow$ Security $\rightarrow$ 2-Step Verification $\rightarrow$ App Passwords*). |

---

## 3. Langkah Instalasi Lengkap (Step-by-Step dari Clone ke Run)

Ikuti urutan langkah instalasi berikut secara berurutan:

### Langkah 1: Clone Repositori
```bash
git clone <repository-url> skillmongo
cd skillmongo
```

### Langkah 2: Install Dependensi PHP (Composer)
```bash
composer install
```

### Langkah 3: Salin File Konfigurasi Environment (`.env`)
Salin berkas `.env.example` menjadi `.env`:
- **Linux / macOS / Git Bash:**
  ```bash
  cp .env.example .env
  ```
- **Windows Command Prompt (CMD):**
  ```cmd
  copy .env.example .env
  ```
- **Windows PowerShell:**
  ```powershell
  Copy-Item .env.example .env
  ```

### Langkah 4: Generate Application Encryption Key (`APP_KEY`)
Jalankan perintah berikut untuk meng-generate `APP_KEY` baru di dalam berkas `.env`:
```bash
php artisan key:generate
```

### Langkah 5: Konfigurasi Berkas `.env`
Buka berkas `.env` menggunakan teks editor Anda, lalu lengkapi variabel koneksi database MongoDB, Object Storage (S3/R2), Google OAuth, dan SMTP sesuai dengan petunjuk yang telah disediakan di dalam berkas `.env.example`.

### Langkah 6: Hubungkan Storage Symlink & Generate TypeScript Routes
```bash
# Buat symlink storage lokal (jika diperlukan fallback aset publik)
php artisan storage:link

# Generate fungsi TypeScript untuk route backend (Laravel Wayfinder)
php artisan wayfinder:generate
```

### Langkah 7: Jalankan Migrasi & Database Seeder
Jalankan migrasi indeks dan database seeder bawaan aplikasi:
```bash
php artisan migrate --force
php artisan db:seed --force
```

### Langkah 8: Install Dependensi Node.js & Frontend
```bash
npm install
```

### Langkah 9: Jalankan Aplikasi untuk Pengembangan
```bash
composer run dev
```
Perintah ini akan menjalankan 3 proses latar belakang secara paralel:
1. **Laravel HTTP Server** pada `http://localhost:8000`
2. **Queue Worker** (`php artisan queue:listen --tries=1`) untuk memproses email dan antrean tugas
3. **Vite Development Server** dengan *Hot Module Replacement* (HMR)

Buka peramban (browser) dan akses: **`http://localhost:8000`**.

---

> [!TIP]
> **Shortcut Setup Otomatis:**
> Proyek ini juga menyediakan script instalasi otomatis di `composer.json`. Setelah mengklon repositori, Anda dapat langsung menjalankan:
> ```bash
> composer run setup
> ```
> Perintah di atas akan mengeksekusi `composer install`, menyalin `.env`, menjalankan `key:generate`, migrasi database, `npm install`, dan `npm run build` secara berurutan. Setelah itu, jalankan `php artisan db:seed`, lengkapi variabel pada `.env`, dan jalankan `composer run dev`.

---

## 4. Inisialisasi Data Master Kursus & Aset

Setelah migrasi dan database seeder selesai dijalankan, Anda dapat melengkapi aset dan kurikulum pembelajaran melalui menu navigasi Admin:

* **Menu Assets (`/admin/assets`)**:
  - **Characters (Wajib)**: Tambahkan minimal 1 karakter agar alur pemilihan karakter siswa baru (`/select-character`) dapat diselesaikan sebelum masuk ke dashboard.
  - **Ranks & Badges**: Atur urutan level pangkat dan lencana kursus.
  - **Certificate Design**: Unggah desain template sertifikat lalu klik **Set Active**.
* **Menu Signature (`/signature`)**: Simpan tanda tangan digital Admin & Mentor agar tercetak pada PDF sertifikat kelulusan siswa.
* **Menu Courses (`/admin/courses`)**: Buat kursus baru beserta alur kurikulum (*Basic Fundamental Path*, *Career Group*, *Module*, dan *Final Quiz*).
* **Menu Footer & Banner (`/admin/footer` & `/donation-banner`)**: Kelola informasi tautan footer publik dan banner donasi halaman depan.

---

## 5. Alur Pengembangan & Update Kode (Development Workflow)

### A. Memperbarui Frontend (React + Inertia.js + Tailwind CSS v4)
- Komponen halaman berada di direktori `resources/js/pages/`.
- Komponen antarmuka yang dapat digunakan kembali berada di `resources/js/components/`.
- Styling menggunakan **Tailwind CSS v4** dengan berkas konfigurasi di `resources/css/app.css`.
- Selama `composer run dev` aktif, setiap perubahan kode pada `resources/js/` atau `resources/css/` akan langsung ter-render otomatis di browser tanpa reload (*Hot Module Replacement*).
- Untuk menguji hasil kompilasi produksi aset frontend:
  ```bash
  npm run build
  ```

### B. Memperbarui Backend (Laravel 12 + MongoDB)
- Model Eloquent MongoDB berada di `app/Models/` (menggunakan base class dari driver `mongodb/laravel-mongodb`).
- Controller berada di `app/Http/Controllers/`.
- Rute aplikasi didefinisikan di `routes/web.php` dan `routes/settings.php`.
- **Laravel Wayfinder**: Jika Anda menambahkan atau mengubah rute di backend, Wayfinder akan otomatis memperbarui fungsi rute TypeScript di frontend (`@/actions/` atau `@/routes/`). Anda juga dapat menjalankannya manual dengan:
  ```bash
  php artisan wayfinder:generate
  ```

### C. Standardisasi Kode & Pengujian Sebelum Commit
Sebelum melakukan *commit* atau membuat *Pull Request*, jalankan pemeriksaan berikut untuk memastikan kode sesuai standar:

```bash
# 1. Format kode PHP sesuai standar PSR / Laravel Pint
vendor/bin/pint

# 2. Periksa tipe data TypeScript frontend
npm run types

# 3. Jalankan linter frontend (ESLint)
npm run lint

# 4. Jalankan pengujian otomatis (Pest)
php artisan test --compact
```
