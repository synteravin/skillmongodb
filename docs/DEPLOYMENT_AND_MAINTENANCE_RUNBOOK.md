# Panduan Deployment Cloud & Pemeliharaan Sistem (Runbook)
## Sistem Manajemen Pembelajaran (LMS) & Bursa Quest Freelance — SkillVentura Enterprise
**Standar Kepatuhan Internasional: ISO/IEC/IEEE 15288:2023 (System Life Cycle Processes - Operation & Maintenance) & Cloud-Native SRE Standards**  
*Lokasi Dokumen Repositori: `docs/DEPLOYMENT_AND_MAINTENANCE_RUNBOOK.md`*  
*Dokumen Word Terkompilasi: `public/images/BackupData/Deployment & Maintenance Runbook - LMS SkillVentura.docx`*

---

## Lembar Pengesahan & Tata Kelola Dokumen

| Parameter Tata Kelola | Keterangan Dokumen Operasional |
| :--- | :--- |
| **Kode Dokumen** | `OPS-SKV-CLOUD-2026` |
| **Judul Dokumen** | *Cloud Deployment, Infrastructure Provisioning, & System Maintenance Runbook* |
| **Klasifikasi Keamanan** | Dokumen Teknis Resmi / Standard Operating Procedure (SOP) |
| **Target Pembaca** | Cloud Infrastructure Engineers, DevOps Engineers, System Administrators, & Tim IT Institusi |
| **Komputasi Utama** | **Laravel Cloud** (Official Serverless Managed PaaS) |
| **Basis Data NoSQL** | **MongoDB Atlas Cloud** (Multi-AZ Shared Replica Set Free Tier M0 / Dedicated) |
| **Penyimpanan Objek** | **Object Storage S3-Compatible** (Cloudflare R2 / AWS S3 / Private Bucket Streaming) |
| **Target Ketersediaan (SLA)** | 99.5% Uptime Bulanan |
| **Versi Dokumen** | **Edisi 2.0** (Revisi Lengkap Penyelarasan Arsitektur Produksi & Aset Backup) |
| **Tanggal Terbit** | November 2026 |

> [!IMPORTANT]
> **PANDUAN OPERASIONAL ADMINISTRATOR:**
> Dokumen ini dirancang sebagai acuan instruksi kerja baku (*Step-by-Step SOP*) tanpa ada langkah yang ambigu. Dengan menerapkan model arsitektur terkelola penuh (*Managed Serverless PaaS & Cloud Database*), tim operasional terbebas dari beban pemeliharaan sistem operasi Linux/Windows tingkat rendah (patch kernel, kompilasi Nginx/IIS manual, daemon management). Seluruh konfigurasi lingkungan, skrip cadangan data, dan prosedur pemulihan bencana (*Disaster Recovery*) diuraikan secara rinci dan teruji pada lingkungan produksi.

---

## DAFTAR ISI RUNBOOK

* [BAB I: Topologi Arsitektur Cloud-Native & Ekosistem Layanan](#bab-i-topologi-arsitektur-cloud-native--ekosistem-layanan)
* [BAB II: Persiapan Basis Data MongoDB Atlas Cloud (Free Tier M0)](#bab-ii-persiapan-basis-data-mongodb-atlas-cloud-free-tier-m0)
* [BAB III: Persiapan Penyimpanan Objek (Object Storage S3 / R2)](#bab-iii-persiapan-penyimpanan-objek-object-storage-s3--r2)
* [BAB IV: Persiapan Layanan Eksternal Pendukung (OAuth, SMTP, Payment & Real-Time)](#bab-iv-persiapan-layanan-eksternal-pendukung-oauth-smtp-payment--real-time)
* [BAB V: Prosedur Deployment Aplikasi di Laravel Cloud (Langkah-demi-Langkah)](#bab-v-prosedur-deployment-aplikasi-di-laravel-cloud-langkah-demi-langkah)
* [BAB VI: Konfigurasi Layanan Latar Belakang (Managed Worker & Scheduler)](#bab-vi-konfigurasi-layanan-latar-belakang-managed-worker--scheduler)
* [BAB VII: Prosedur Pemeliharaan Rutin, Cadangan Data, & Pemulihan Bencana](#bab-vii-prosedur-pemeliharaan-rutin-cadangan-data--pemulihan-bencana)
* [BAB VIII: Matriks Mitigasi Kendala (Troubleshooting Reference) & Monitoring](#bab-viii-matriks-mitigasi-kendala-troubleshooting-reference--monitoring)
* [BAB IX: Daftar Periksa Kesiapan Produksi (Go-Live Checklist)](#bab-ix-daftar-periksa-kesiapan-produksi-go-live-checklist)

---

## BAB I: Topologi Arsitektur Cloud-Native & Ekosistem Layanan

### 1.1 Diagram Arsitektur Cloud Terkelola

Sistem LMS SkillVentura mengadopsi prinsip arsitektur *stateless web tier* di mana server aplikasi terpisah secara fisik dari basis data dan penyimpanan berkas media:

```
                            ┌──────────────────────────────────────────────┐
                            │          Internet / Pengguna Siswa           │
                            │        (Browser Desktop & Mobile PWA)        │
                            └──────────────────────┬───────────────────────┘
                                                   │
                                                   │ HTTPS (Port 443 / TLS 1.3)
                                                   ▼
                            ┌──────────────────────────────────────────────┐
                            │      Edge Ingress & CDN (Laravel Cloud)      │
                            │  - Let's Encrypt Wildcard Auto-SSL           │
                            │  - DDoS Protection & HTTP/2 / HTTP/3         │
                            └──────────────────────┬───────────────────────┘
                                                   │
                                                   ▼
                            ┌──────────────────────────────────────────────┐
                            │     Serverless Web Tier (PHP 8.4 Runtime)    │
                            │  - Laravel 12 Enterprise Engine              │
                            │  - React 19 + Inertia.js v2 SPA UI           │
                            │  - Managed Background Queue & Cron Runner    │
                            └──────┬──────────────┬──────────────┬─────────┘
                                   │              │              │
         ┌─────────────────────────┘              │              └─────────────────────────┐
         │                                        │                                        │
         ▼                                        ▼                                        ▼
┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│   Basis Data MongoDB    │      │    Object Storage S3    │      │    Layanan Eksternal    │
│  (Atlas M0 Singapore)   │      │  (Cloudflare R2 / S3)   │      │ (OAuth, SMTP, Payment)  │
│ - 38 Koleksi Sistem     │      │ - Private Bucket        │      │ - Google Cloud Console  │
│ - SCRAM-SHA-256 Auth    │      │ - Stream: /media/{path} │      │ - Gmail / Mailgun SMTP  │
│ - Multi-AZ Replica Set  │      │ - Avatars, PDFs, ZIPs   │      │ - Midtrans & Pusher     │
└─────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```

### 1.2 Matriks 6 Ekosistem Layanan Terintegrasi

| Komponen Infrastruktur | Platform / Vendor | Spesifikasi & Versi | Peran & Tanggung Jawab Operasional |
| :--- | :--- | :--- | :--- |
| **1. Serverless Web Engine** | **Laravel Cloud** | PHP 8.4.x / Laravel 12.x | Menjalankan logika bisnis, perutean Inertia.js, autentikasi sesi, dan eksekutor pekerjaan queue/cron. |
| **2. Basis Data NoSQL** | **MongoDB Atlas** | v7.0 / v8.0 (Free Tier M0) | Menyimpan seluruh dokumen transaksional, kurikulum, kuis, progress gamifikasi EXP/Gold, dan arbitrase. |
| **3. Penyimpanan Objek** | **Cloudflare R2 / S3** | S3-Compatible API | Menampung berkas fisik statis: materi pelajaran PDF, aset gambar modul, sertifikat, dan arsip tugas ZIP. |
| **4. Otentikasi Sosial (SSO)**| **Google Cloud Console**| OAuth 2.0 API (Socialite) | Memungkinkan siswa dan mentor mendaftar serta masuk dengan satu kali klik akun Google resmi. |
| **5. Email Gateway** | **Gmail SMTP / Mailgun** | Port 465 (SSL) / 587 (TLS)| Mengirimkan tautan reset password, verifikasi akun baru, dan notifikasi persidangan sengketa arbitrase. |
| **6. Keamanan Biometrik** | **W3C WebAuthn** | FIDO2 Hardware-backed | Mendukung login biometrik tanpa password (sidik jari / Face ID) langsung melalui peramban pengguna. |

### 1.3 Karakteristik & Batasan Paket Bebas Biaya (Free Tier M0 Strategy)

| Dimensi Parameter | Batasan Teknis Free Tier M0 | Strategi Optimasi Arsitektur SkillVentura |
| :--- | :--- | :--- |
| **Kapasitas Penyimpanan DB** | 512 MB Storage Limit | **Pemisahan Fisik Berkas Mutlak**: Dokumen PDF dan gambar dilarang disimpan dalam database. MongoDB hanya menampung metadata teks ringkas (~2-5 KB per baris). Kuota 512 MB sanggup menampung lebih dari 100.000 riwayat pembelajaran. |
| **Koneksi Bersamaan** | Maksimal 100 soket simultan | **Connection Pooling Tuning**: String koneksi ditambahkan parameter `&maxPoolSize=10&maxIdleTimeMS=30000` untuk mencegah serverless worker menghabiskan kuota soket database. |
| **Backup Otomatis Atlas** | Tidak didukung pada paket M0 | **Prosedur Cadangan Mandiri**: Menggunakan CLI `mongodump` dan utilitas internal `php artisan db:backup-mongo` yang dijadwalkan secara berkala ke media lokal institusi. |

### 1.4 Matriks Pustaka & Tumpukan Teknologi Terkunci (*Locked Dependency Matrix*)

Audit komprehensif terhadap [`composer.lock`](file:///c:/Users/An/Herd/skillmongo/composer.lock) dan [`package-lock.json`](file:///c:/Users/An/Herd/skillmongo/package-lock.json) dilakukan guna menjamin kepatuhan versi dependensi secara deterministik di lingkungan cloud tanpa risiko degradasi pustaka (*dependency mismatch*):

#### A. Spesifikasi Lingkungan Runtime & CLI
* **PHP Runtime**: Spesifikasi `composer.json` bernilai `^8.2`. Target runtime kontainer resmi Laravel Cloud disetel ke `PHP 8.4.x`, sedangkan lingkungan CLI lokal administrator menggunakan **PHP 8.4.27 (cli) NTS x64**.
* **Ekstensi MongoDB PHP**: **`ext-mongodb` v2.5.5** (driver C/PHP resmi untuk konektivitas klaster MongoDB Atlas).
* **Ekstensi Grafis & Dokumen**: **`ext-gd`**, **`ext-dom`**, **`ext-mbstring`** (ekstensi wajib untuk kompilasi e-sertifikat PDF oleh DomPDF).
* **Node.js & Tooling**: **Node.js v24.22.1** (minimum platform `>= 20.x`), **NPM v11.19.1**, dan bundler **Vite v7.3.7**.

#### B. Matriks Dependensi Backend PHP (`composer.lock` Audit)

| Nama Paket (Package) | Versi Terkunci (*Locked*) | Batasan (*composer.json*) | Peran & Tanggung Jawab Operasional |
| :--- | :--- | :--- | :--- |
| **`laravel/framework`** | `v12.70.1` | `^12.0` | Core Web Application Framework Laravel 12 Enterprise. |
| **`mongodb/laravel-mongodb`** | `5.12.0` | `^5.8` | Driver ODM MongoDB Eloquent Model & Query Builder. |
| **`inertiajs/inertia-laravel`**| `v2.0.28` | `^2.0` | Inertia.js v2 Server-Side Adapter untuk SPA React. |
| **`laravel/fortify`** | `v1.41.0` | `^1.30` | Backend Autentikasi Headless, 2FA/TOTP, dan Reset Password. |
| **`laravel/socialite`** | `v5.31.0` | `^5.24` | Integrasi OAuth 2.0 Single Sign-On (Google Login). |
| **`laravel/wayfinder`** | `v0.1.23` | `^0.1.9` | Generator Otomatis TypeScript Route Action Functions. |
| **`league/flysystem-aws-s3-v3`**| `3.35.3` *(Pinned)* | `3.35.3` | Adapter S3 Object Storage untuk Flysystem (Terkunci Ketat). |
| **`barryvdh/laravel-dompdf`** | `v3.1.2` | `^3.1` | Renderer PDF e-Sertifikat Kelulusan & Putusan Arbitrase. |
| **`tightenco/ziggy`** | `v2.6.5` | `^2.6` | Helper Routing Laravel untuk konsumsi frontend JavaScript. |
| **`laravel/nightwatch`** | `v1.30.5` | `^1.26` | Pemantauan Telemetri, Logging, & Kinerja Aplikasi. |
| **`laravel/tinker`** | `v2.11.1` | `^2.10.1` | Powerful REPL untuk administrasi sistem & inisialisasi user. |
| **`pestphp/pest`** | `v4.7.8` | `^4.3` | Test Runner Framework Pest 4 (Berasosiasi PHPUnit `12.5.33`).|
| **`laravel/pint`** | `v1.32.1` | `^1.24` | Formatter Standar Penulisan Kode PHP Laravel Resmi. |
| **`laravel/boost`** | `v2.10.3` | `^2.1` | AI Accelerator Tooling & Rule Set Assistant. |
| **`laravel/pail`** | `v1.2.7` | `^1.2.2` | Real-time CLI Log Streaming Tool. |
| **`laravel/sail`** | `v1.69.0` | `^1.41` | Docker Environment Scaffolding untuk Staging Lokal. |

#### C. Matriks Dependensi Frontend React/TypeScript (`package-lock.json` Audit)

| Nama Paket (Package) | Versi Terkunci (*Locked*) | Spesifikasi (*package.json*) | Peran & Tanggung Jawab UI/UX |
| :--- | :--- | :--- | :--- |
| **`react`** | `19.2.8` | `^19.2.0` | Core UI Library React 19 Frontend. |
| **`react-dom`** | `19.2.8` | `^19.2.0` | DOM Renderer untuk React 19. |
| **`@inertiajs/react`** | `2.3.27` | `^2.3.7` | Inertia.js React Client Adapter v2. |
| **`tailwindcss`** | `4.3.3` | `^4.0.0` | Engine Utility-First CSS Tailwind CSS v4. |
| **`@tailwindcss/vite`** | `4.3.3` | `^4.1.11` | Vite Plugin Resmi Tailwind CSS v4. |
| **`vite`** | `7.3.7` | `^7.0.4` | Modern Next-Gen Frontend Build Tool & Bundler. |
| **`typescript`** | `5.9.3` | `^5.7.2` | Type Checker & Compiler Bahasa TypeScript. |
| **`@laravel/vite-plugin-wayfinder`** | `0.1.7` | `^0.1.3` | Vite Integration untuk Laravel Wayfinder Route Generator. |
| **`laravel-vite-plugin`** | `2.1.0` | `^2.0` | Plugin Resmi Integrasi Laravel Backend ke Vite Bundler. |
| **`framer-motion`** | `12.43.0` | `^12.35.2` | Library Animasi Transisi & Interaktivitas UI Halus. |
| **`lucide-react`** | `0.475.0` | `^0.475.0` | Koleksi Ikon Vektor Modern Berbasis SVG. |
| **`ziggy-js`** | `2.6.3` | `^2.6.0` | Client Library Perutean Named Route Ziggy di Browser. |
| **`@headlessui/react`** | `2.2.10` | `^2.2.9` | Komponen Aksesibel Tanpa Gaya (Modals, Dropdowns). |
| **`@dnd-kit/core`** | `6.3.1` | `^6.3.1` | Drag and Drop Kit untuk Builder Modul Kursus. |
| **`@dnd-kit/sortable`** | `10.0.0` | `^10.0.0` | Sortable Extension untuk Penyusunan Urutan Modul. |
| **`eslint`** | `9.39.5` | `^9.17.0` | Linter Kode JavaScript & TypeScript v9. |
| **`prettier`** | `3.9.6` | `^3.4.2` | Code Formatter Otomatis untuk JS/TSX/CSS. |
| **`typescript-eslint`** | `8.67.0` | `^8.23.0` | Parser & Aturan ESLint Khusus TypeScript v8. |
| **`babel-plugin-react-compiler`** | `1.0.0` | `^1.0.0` | Optimasi Compiler Memoization Otomatis React 19. |
| **`prettier-plugin-tailwindcss`**| `0.6.14` | `^0.6.11` | Formatter Otomatis Pengurutan Kelas Utility Tailwind. |

---

## BAB II: Persiapan Basis Data MongoDB Atlas Cloud (Free Tier M0)

Penyiapan basis data cloud dilakukan pada portal resmi MongoDB Atlas (`cloud.mongodb.com`).

### 2.1 Langkah 1: Registrasi Akun & Pembuatan Klaster Free Tier
1. Kunjungi portal resmi: `https://www.mongodb.com/cloud/atlas/register`.
2. Buat Organisasi baru (misal: `SkillVentura-Org`) dan buat Project baru (misal: `SkillVentura-Production`).
3. Pada wizard **Deploy your cluster**, pilih paket **Free (M0)** (512 MB Storage, Shared RAM/vCPU).
4. Beri nama cluster: `SkillVentura`. Pilih Cloud Provider: **AWS** dan Region: **Singapore (ap-southeast-1)**. Pemilihan region ini krusial untuk menghasilkan latensi terendah (< 35 ms) bagi pengguna di Indonesia.
5. Klik **Create Deployment**.

![Gambar 2.1: Penyediaan Klaster M0 Free di Region Singapore AWS](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/StupMongoDB/Step-1.png)
*Gambar 2.1: Halaman konfigurasi awal pemilihan paket Free Tier, nama klaster SkillVentura, dan lokasi server AWS Singapore.*

---

### 2.2 Langkah 2: Pembuatan Kredensial Pengguna Database & Keamanan
1. Sistem MongoDB Atlas akan menampilkan modal **Connect to SkillVentura** (*Step 1: Set up connection security*).
2. Buat akun pengguna database (*Database User*) khusus aplikasi. Sistem menyediakan nama pengguna bawaan atau dapat disesuaikan (misal: `kusiapanama16_db_user`).
3. Salin dan simpan kata sandi (*Password*) yang dihasilkan ke tempat yang aman.
4. Alamat IP lokal administrator akan otomatis ditambahkan ke IP Access List.

![Gambar 2.2: Pembuatan Database User & Penyimpanan Kredensial](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/StupMongoDB/Step-2.png)
*Gambar 2.2: Layar konfirmasi pembuatan pengguna database dan pengamanan kata sandi otentikasi.*

---

### 2.3 Langkah 3: Pemilihan Metode Koneksi Aplikasi
1. Pada Step 2 modal: **Choose a connection method**, tersedia opsi koneksi: Drivers, Compass, Shell, dan VS Code.
2. Pilih opsi **Drivers and Client Libraries** untuk menghubungkan aplikasi Laravel backend.

![Gambar 2.3: Pemilihan Metode Koneksi Drivers](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/StupMongoDB/Step-3.png)
*Gambar 2.3: Pilihan metode penghubungan klaster menggunakan driver resmi bahasa pemrograman.*

---

### 2.4 Langkah 4: Pengambilan String Koneksi Driver PHP (Format SRV)
1. Pada Step 3 modal: **Connecting with MongoDB Client Library**, pilih Language: **PHP** dan Client Library: **Laravel MongoDB Integration** (Version 1.15 or later).
2. Sistem akan menyajikan Connection String resmi berformat SRV:
   ```text
   mongodb+srv://kusiapanama16_db_user:<db_password>@skillventura.4raqp5z.mongodb.net/
   ```
3. Salin string ini. Ganti `<db_password>` dengan kata sandi riil pengguna database. Tambahkan nama database dan parameter pooling agar menjadi:
   ```text
   mongodb+srv://kusiapanama16_db_user:<db_password>@skillventura.4raqp5z.mongodb.net/skillventura?retryWrites=true&w=majority&maxPoolSize=10&maxIdleTimeMS=30000
   ```

![Gambar 2.4: Pengambilan Connection String URI Resmi untuk Laravel](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/StupMongoDB/Step-4.png)
*Gambar 2.4: Tampilan modal akhir yang menyajikan string koneksi MongoDB driver PHP untuk diinjeksikan pada .env.*

> [!NOTE]
> **PENGATURAN FIREWALL IP ACCESS LIST UNTUK LARAVEL CLOUD:**
> Pada menu **Security** $\rightarrow$ **Network Access**, tambahkan alamat `0.0.0.0/0` (Allow Access from Anywhere) dengan komentar `Laravel Cloud Serverless Pool`. Ini diperlukan karena kontainer serverless memiliki IP elastis yang berganti dinamis saat penskalaan. Keamanan database tetap terjamin melalui otentikasi **SCRAM-SHA-256** dan enkripsi **TLS 1.3**.

---

## BAB III: Persiapan Penyimpanan Objek (Object Storage S3 / R2)

Sistem SkillVentura menggunakan protokol penyimpanan objek yang kompatibel dengan Amazon S3 (seperti **Cloudflare R2**, **Laravel Cloud Storage Bucket**, atau **AWS S3**).

### Langkah 3.1: Pembuatan Bucket Penyimpanan
1. Buka dashboard layanan penyimpanan objek pilihan Anda (misal: Cloudflare Dashboard $\rightarrow$ **R2** atau Laravel Cloud $\rightarrow$ **Storage**).
2. Klik tombol **Create Bucket**.
3. Beri nama bucket: `skillventura-storage` atau nama bucket yang tertera pada lingkungan institusi (misal: `fls-a3030587-455e-44f0-9eb3-32be9b06810d`).
4. Pilih lokasi geografis terdekat (Asia Pasifik / Singapore).
5. Klik **Create Bucket**.

### Langkah 3.2: Pembuatan Kredensial API Token
1. Buka menu **Manage R2 API Tokens** atau **Bucket Credentials**.
2. Klik **Create API Token**, beri izin akses **Object Read & Write** pada bucket tersebut.
3. Simpan parameter berikut dengan aman:
   - **Access Key ID** (`AWS_ACCESS_KEY_ID`)
   - **Secret Access Key** (`AWS_SECRET_ACCESS_KEY`)
   - **Endpoint S3 URL** (`AWS_ENDPOINT`)

### Langkah 3.3: Arsitektur Keamanan Akses Berkas (Private Streaming Proxy)

> [!IMPORTANT]
> **PENJELASAN PENTING MENGENAI VISIBILITAS BUCKET:**
> Berbeda dengan aplikasi web tradisional yang mengharuskan bucket dibuka ke publik (*Public Read*), LMS SkillVentura mengadopsi mekanisme **Application Streaming Proxy** via [`MediaController.php`](file:///c:/Users/An/Herd/skillmongo/app/Http/Controllers/MediaController.php):
> - **Bucket S3 WAJIB DISIAPKAN SECARA PRIVATE** (Akses publik dinonaktifkan).
> - Seluruh berkas (avatar, dokumen materi, modul, gambar, bukti transfer DP) diakses melalui rute aplikasi:
>   `GET https://skillventura.com/media/{path}`
> - Controller secara internal membaca stream dari S3 secara privat lalu mengalirkannya ke browser siswa dengan header MIME yang valid dan proteksi *Cache-Control* 24 jam. Hal ini mencegah kebocoran dokumen rahasia dan melindungi sistem dari pembengkakan kuota egress akibat *hotlinking* liar.

### Langkah 3.4: Konfigurasi Path-Style Endpoint
Pada [`config/filesystems.php`](file:///c:/Users/An/Herd/skillmongo/config/filesystems.php#L58), parameter `AWS_USE_PATH_STYLE_ENDPOINT` dikonfigurasi sebagai berikut:
- **Cloudflare R2 & MinIO**: Setel `AWS_USE_PATH_STYLE_ENDPOINT=true` (Format URL: `https://<account_id>.r2.cloudflarestorage.com/<bucket_name>/<file>`).
- **Amazon S3 Murni**: Setel `AWS_USE_PATH_STYLE_ENDPOINT=false` (Format Virtual-Host: `https://<bucket_name>.s3.amazonaws.com/<file>`).

---

## BAB IV: Persiapan Layanan Eksternal Pendukung (OAuth, SMTP, Payment & Real-Time)

### 4.1 Setup Google Cloud Console (Google Login / Socialite)
1. Akses **Google Cloud Console**: `https://console.cloud.google.com/apis/credentials`.
2. Buat Project baru: `SkillVentura-LMS`.
3. Konfigurasikan **OAuth Consent Screen** (User Type: External).
4. Buat kredensial baru bertipe **OAuth 2.0 Client ID** (Web Application).
5. Isi konfigurasi endpoint:
   - **Authorized JavaScript origins**: `https://skillventura.com`
   - **Authorized redirect URIs**: `https://skillventura.com/auth/google/callback`
6. Salin **Client ID** dan **Client Secret** untuk diinjeksikan pada `.env`.

### 4.2 Setup Layanan Email SMTP Transaksional
Untuk memastikan fitur reset password dan verifikasi akun berjalan lancar:
- **Menggunakan Gmail SMTP Resmi**:
  1. Masuk ke Akun Google $\rightarrow$ menu **Keamanan (Security)** $\rightarrow$ aktifkan **Verifikasi 2 Langkah (2-Step Verification)**.
  2. Buka menu **Sandi Aplikasi (App Passwords)**, buat sandi baru dengan nama `SkillVentura Mailer`.
  3. Salin 16-digit kode sandi yang dihasilkan (tanpa spasi).
  4. Konfigurasi port: `MAIL_PORT=465` dan `MAIL_SCHEME=smtps`.

### 4.3 Setup Midtrans Payment Gateway (Escrow Quest & Donasi)
Jika mengaktifkan gerbang pembayaran otomatis untuk penampungan dana titipan (*escrow*) kontrak freelance dan donasi platform:
1. Daftarkan akun di `https://dashboard.midtrans.com`.
2. Salin **Server Key** dan **Client Key** (Sandbox untuk staging, Production untuk live).
3. Setel Payment Notification Webhook URL ke: `https://skillventura.com/api/midtrans/notification`.

### 4.4 Setup Pusher / Laravel Echo (Real-Time Chat & Arbitrase)
Untuk notifikasi instant dan percakapan sengketa proyek secara real-time:
1. Buat aplikasi di `https://dashboard.pusher.com` pada cluster `ap1` (Singapore).
2. Salin `PUSHER_APP_ID`, `PUSHER_APP_KEY`, dan `PUSHER_APP_SECRET`.

---

## BAB V: Prosedur Deployment Aplikasi di Laravel Cloud (Langkah-demi-Langkah)

### Langkah 5.1: Menghubungkan Repositori GitHub
1. Masuk ke dashboard resmi: `https://cloud.laravel.com`.
2. Klik tombol **+ New Application**.
3. Pilih penyedia Git: **GitHub**, lalu berikan otorisasi akses ke repositori proyek `skillmongo`.
4. Pilih repositori dan tentukan branch produksi: `main`.
5. Beri nama aplikasi: `SkillVentura LMS Enterprise`.

### Langkah 5.2: Konfigurasi Runtime Environment & Build Hooks
Pada menu **Application Settings** $\rightarrow$ **Build & Runtime**:
1. **PHP Version**: Pilih `8.4`.
2. **Build Commands**: Masukkan pipeline kompilasi build produksi berikut secara berurutan:
   ```bash
   composer install --no-dev --optimize-autoloader
   php artisan wayfinder:generate
   npm ci
   npm run build
   ```
*(Kombinasi ini menjamin pustaka PHP teroptimasi, fungsi route TypeScript Wayfinder terbarui otomatis, dan aset React/Tailwind v4 terkompilasi sempurna)*.

### Langkah 5.3: Injeksi Variabel Lingkungan Produksi (.env)
Buka tab **Environment Variables** pada dashboard Laravel Cloud, lalu injeksikan parameter berikut:

```dotenv
# =====================================================================
# 1. CORE APPLICATION CONFIGURATION
# =====================================================================
APP_NAME="SkillVentura"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://skillventura.com
APP_KEY=base64:32_CHARACTER_SECRET_KEY
APP_LOCALE=id
APP_FALLBACK_LOCALE=en

# =====================================================================
# 2. MONGODB ATLAS PRODUCTION DATABASE (MULTI-AZ SINGAPORE)
# =====================================================================
DB_CONNECTION=mongodb
MONGODB_URI="mongodb+srv://kusiapanama16_db_user:<password>@skillventura.4raqp5z.mongodb.net/skillventura?retryWrites=true&w=majority&maxPoolSize=10&maxIdleTimeMS=30000"
MONGODB_DATABASE=skillventura

# Pengaturan Sesi & Cache Terpusat pada MongoDB
SESSION_DRIVER=mongodb
SESSION_LIFETIME=120
CACHE_STORE=mongodb
QUEUE_CONNECTION=mongodb

# =====================================================================
# 3. S3-COMPATIBLE OBJECT STORAGE (PRIVATE BUCKET STREAMING)
# =====================================================================
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID="<your_access_key>"
AWS_SECRET_ACCESS_KEY="<your_secret_key>"
AWS_DEFAULT_REGION=auto
AWS_BUCKET=fls-a3030587-455e-44f0-9eb3-32be9b06810d
AWS_ENDPOINT="https://<account_id>.r2.cloudflarestorage.com"
AWS_USE_PATH_STYLE_ENDPOINT=true

# =====================================================================
# 4. EMAIL RELAY GATEWAY (GMAIL SMTP / TRANSACTIONAL)
# =====================================================================
MAIL_MAILER=smtp
MAIL_SCHEME=smtps
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME="admin@skillventura.com"
MAIL_PASSWORD="<16_digit_app_password>"
MAIL_FROM_ADDRESS="no-reply@skillventura.com"
MAIL_FROM_NAME="${APP_NAME}"

# =====================================================================
# 5. GOOGLE OAUTH 2.0 (SINGLE SIGN-ON)
# =====================================================================
GOOGLE_CLIENT_ID="<your_google_client_id>"
GOOGLE_CLIENT_SECRET="<your_google_client_secret>"
GOOGLE_REDIRECT_URI="https://skillventura.com/auth/google/callback"

# Logging dialirkan langsung ke Live Console Laravel Cloud
LOG_CHANNEL=stderr
```

### Langkah 5.4: Migrasi Indeks & Inisialisasi Akun Super Admin
Setelah proses deployment pertama selesai, buka tab **Console / Terminal** di Laravel Cloud:

1. **Eksekusi Migrasi Database**:
   ```bash
   php artisan migrate --force
   ```
   *(Perintah ini akan membuat koleksi MongoDB dan mengompilasi struktur indeksnya tanpa menyentuh data existing)*.

2. **Inisialisasi Akun Super Administrator Awal**:
   ```bash
   php artisan tinker --execute "App\Models\User::updateOrCreate(['email' => 'admin@skillventura.com'], ['name' => 'Super Admin', 'password' => bcrypt('SkillVentura2026!Secure'), 'role' => 'admin', 'is_active' => true, 'email_verified_at' => now()]);"
   ```

> [!CAUTION]
> **ATURAN INTEGRITAS DATA PRODUKSI:**
> **Dilarang keras menjalankan `php artisan db:seed` di lingkungan produksi.** Database produksi harus dimulai dalam kondisi bersih tanpa data uji/dummy buatan.

### Langkah 5.5: Konfigurasi Kustom Domain & Auto-SSL
1. Buka menu **Domains** pada dashboard Laravel Cloud $\rightarrow$ klik **Add Custom Domain**.
2. Masukkan domain resmi institusi (misal: `skillventura.com`).
3. Sistem akan memberikan target CNAME atau ALIAS Record.
4. Buka DNS Management domain Anda (Cloudflare, cPanel, dll.) dan buat DNS Record:
   - Type: `CNAME`
   - Name: `@` atau `www`
   - Target: Alamat CNAME dari Laravel Cloud
   - Proxy status: DNS Only (jika menggunakan Cloudflare)
5. Setelah propagasi DNS selesai (5–15 menit), sertifikat SSL Let's Encrypt akan terbit otomatis dan protokol HTTPS akan aktif.

---

## BAB VI: Konfigurasi Layanan Latar Belakang (Managed Worker & Scheduler)

### 6.1 Aktivasi Managed Background Queue Worker
Penerbitan e-sertifikat kelulusan dalam format PDF dan pemrosesan antrean pekerjaan ditangani oleh worker terkelola:
1. Pada aplikasi Laravel Cloud, buka tab **Workers** $\rightarrow$ klik **+ Add Worker**.
2. Konfigurasikan parameter worker:
   - **Command**: `php artisan queue:work mongodb --sleep=3 --tries=3 --timeout=90 --memory=256`
   - **Processes**: `1` (skalakan ke `2` jika traffic siswa meningkat)
3. Klik **Save & Deploy**. Worker akan dimonitor dan dijalankan otomatis 24/7.

### 6.2 Aktivasi Managed Scheduled Tasks (Cron Otomatis)
Platform memiliki jadwal otomatis pada [`routes/console.php`](file:///c:/Users/An/Herd/skillmongo/routes/console.php#L11) untuk menutup lowongan quest freelance yang telah melewati tenggat waktu:
```php
Schedule::command('quests:check-expiry')->everyFifteenMinutes();
```
1. Buka tab **Scheduled Tasks** / **Cron** pada dashboard Laravel Cloud.
2. Aktifkan opsi **Run Laravel Scheduler**.
3. Laravel Cloud secara otomatis akan memicu eksekusi `php artisan schedule:run` setiap 1 menit. Pengecekan quest kedaluwarsa akan berjalan presisi setiap 15 menit.

---

## BAB VII: Prosedur Pemeliharaan Rutin, Cadangan Data, & Pemulihan Bencana

Prosedur berikut memanfaatkan berkas, skrip, dan tangkapan layar verifikasi yang telah dipersiapkan di dalam repositori: [`public/images/BackupData/`](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/).

### 7.1 Prosedur Pencadangan (Backup) Database MongoDB Atlas

Pencadangan database dapat dilakukan langsung dari Windows PowerShell administrator menggunakan utilitas CLI `mongodump`:

1. **Pembuatan Folder Penampung Backup**:
   ```powershell
   New-Item -ItemType Directory -Force -Path "C:\Users\An\Documents\BackupData\MongoDB"
   ```

2. **Eksekusi Pencadangan via `mongodump`**:
   ```powershell
   mongodump --uri="mongodb+srv://kusiapanama16_db_user:<password>@skillventura.4raqp5z.mongodb.net/skillventura?retryWrites=true&w=majority" --db=skillventura --archive="C:\Users\An\Documents\BackupData\MongoDB\skillventura-production.gz" --gzip
   ```
   *(Perintah di atas akan mengekspor seluruh koleksi sistem ke dalam satu berkas arsip biner terkompresi `skillventura-production.gz`)*.

![Gambar 7.1: Eksekusi Pencadangan Database via mongodump di Windows PowerShell](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/StupMongoDB/Step-5.png)
*Gambar 7.1: Proses dumping seluruh koleksi MongoDB aktif ke dalam berkas arsip skillventura-production.gz.*

#### Alternatif Internal: Artisan Command Proyek
Aplikasi juga dilengkapi command internal [`BackupMongoDatabase.php`](file:///c:/Users/An/Herd/skillmongo/app/Console/Commands/BackupMongoDatabase.php) yang dapat dieksekusi di server:
```bash
php artisan db:backup-mongo
```

---

### 7.2 Prosedur Pemulihan Bencana Database (Disaster Recovery Restore)

Apabila terjadi kerusakan data fatal dan institusi ingin memulihkan database dari berkas cadangan resmi: [`public/images/BackupData/MongoDB/skillventura-production.gz`](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/MongoDB/skillventura-production.gz):

1. **Eksekusi Pemulihan via `mongorestore`**:
   ```powershell
   mongorestore `
     --uri="mongodb+srv://skillventura.4raqp5z.mongodb.net" `
     --username="kusiapanama16_db_user" `
     --authenticationDatabase="admin" `
     --archive="C:\Users\An\Documents\BackupData\MongoDB\skillventura-production.gz" `
     --gzip `
     --nsInclude="skillventura.*" `
     --drop
   ```
   *(Parameter `--drop` memastikan seluruh koleksi lama dibersihkan sebelum ditimpa dengan data cadangan yang bersih)*.

![Gambar 7.2A: Eksekusi Pemulihan (Restore) Database via mongorestore di Windows PowerShell](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/StupMongoDB/SetupRestore/Step-1%20Restore.png)
*Gambar 7.2A: Proses restore koleksi database dari berkas arsip skillventura-production.gz ke klaster MongoDB Atlas.*

---

### 7.3 Verifikasi Hasil Pemulihan di MongoDB Atlas Data Explorer

Setelah proses pemulihan selesai:
1. Masuk ke dashboard MongoDB Atlas $\rightarrow$ pilih klaster **SkillVentura**.
2. Klik tab **Data Explorer** $\rightarrow$ buka database `skillventura`.
3. Pastikan database telah memuat **38 Koleksi** dan **74 Indeks** secara utuh dan valid.

![Gambar 7.2B: Verifikasi Keberhasilan Restore di Atlas Data Explorer](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/StupMongoDB/SetupRestore/Hasil.png)
*Gambar 7.2B: Tampilan Data Explorer membuktikan 38 koleksi dan 74 indeks telah pulih sempurna.*

---

### 7.4 Verifikasi Bucket & Penyiapan Folder Cadangan Object Storage

Pencadangan seluruh berkas media fisik (foto avatar, cover kursus, spesimen tanda tangan mentor, berkas lampiran sengketa) dari Cloudflare R2 / S3 ke penyimpanan lokal dilakukan menggunakan AWS CLI:

1. **Verifikasi Koneksi S3 & Penyiapan Folder Lokal**:
   ```powershell
   $env:AWS_ACCESS_KEY_ID = "e9e9cb7e2e95ab3cc71f6a1f317ba516"
   $env:AWS_SECRET_ACCESS_KEY = "87593128e5bd0c5306940aa4cc3e243c5ccbc4f831564702171b2656737ba260"
   $env:AWS_DEFAULT_REGION = "auto"
   $Bucket = "fls-a3030587-455e-44f0-9eb3-32be9b06810d"
   $Endpoint = "https://367be3a2035528943240074d0096e0cd.r2.cloudflarestorage.com"
   $Region = $env:AWS_DEFAULT_REGION

   aws s3 ls "s3://$Bucket" --endpoint-url $Endpoint --region $Region
   New-Item -ItemType Directory -Force -Path "C:\Users\An\Documents\BackupData\ObjectStorage\"
   ```

![Gambar 7.3A: Pengecekan Folder S3 Bucket via AWS CLI di Windows PowerShell](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/SetupObjectStorage/OBS-1.png)
*Gambar 7.3A: Daftar folder media terverifikasi ada di dalam S3 Bucket dan direktori lokal dipersiapkan.*

---

### 7.5 Eksekusi Pencadangan Berkas Media Object Storage (AWS S3 Sync)

Jalankan perintah sinkronisasi untuk menarik seluruh berkas dari bucket S3 ke direktori lokal:

```powershell
aws s3 sync "s3://$Bucket/" "C:\Users\An\Documents\BackupData\ObjectStorage" `
  --endpoint-url $Endpoint `
  --region $Region `
  --no-progress
```

![Gambar 7.3B: Eksekusi Sinkronisasi Unduhan Berkas Media via AWS CLI](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/SetupObjectStorage/OBS-2.png)
*Gambar 7.3B: Proses penarikan berkas avatar, badge, modul, dan bukti pembayaran dari Cloudflare R2 ke folder BackupData.*

Struktur 12 folder direktori media yang tersimpan di dalam [`public/images/BackupData/ObjectStorage/`](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/ObjectStorage/):

```text
ObjectStorage/
├── avatars/              # Foto avatar profil pengguna
├── badges/               # Lencana level pencapaian gamifikasi
├── certificates/         # Desain template master sertifikat
├── characters/           # Aset avatar kelas RPG siswa
├── courses/              # Gambar cover & materi kursus
├── donation-banners/     # Banner informasi donasi publik
├── footer/               # Berkas aset halaman footer
├── forum_attachments/    # Berkas lampiran percakapan forum
├── modules/              # Berkas infografis & materi modul
├── quests/               # Berkas lampiran tugas & bukti transfer
├── ranks/                # Ikon tingkatan pangkat RPG
└── signatures/           # Spesimen tanda tangan digital mentor
```

#### Prosedur Pemulihan (Restore Media ke S3 Baru):
Jika ingin mengunggah kembali seluruh berkas ini ke S3 Bucket yang baru dibuat:
```powershell
aws s3 sync "public/images/BackupData/ObjectStorage/" "s3://$Bucket/" `
  --endpoint-url $Endpoint `
  --region $Region
```

---

### 7.6 Prosedur Pembersihan Tembolok (Cache Clearing)
Jika terjadi perubahan konfigurasi variabel lingkungan di Laravel Cloud, jalankan:
```bash
php artisan optimize:clear
```
Kemudian tekan tombol **Redeploy** pada tab Deployments Laravel Cloud agar seluruh kontainer web memuat konfigurasi baru secara serempak.

---

## BAB VIII: Matriks Mitigasi Kendala (Troubleshooting Reference) & Monitoring

### 8.1 Matriks Penanganan Insiden Operasional Cepat

| Gejala Insiden | Kemungkinan Penyebab Utama | Prosedur Solusi Teknis Terarah |
| :--- | :--- | :--- |
| **Autentikasi MongoDB Ditolak / Timeout saat Deploy** | 1. Kata sandi mengandung karakter khusus yang belum di-URL encode.<br>2. Network Access Atlas belum dibuka `0.0.0.0/0`. | 1. Jika password mengandung simbol (seperti `@`, `#`), ganti menjadi format URL-encoded (misal `@` menjadi `%40`) atau buat sandi alfanumerik murni.<br>2. Buka MongoDB Atlas $\rightarrow$ Network Access $\rightarrow$ pastikan `0.0.0.0/0` berstatus **Active**. |
| **Berkas Media Gambar / PDF Menghasilkan Error 404** | Konfigurasi S3 salah atau berkas belum diunggah ke path yang sesuai di bucket. | 1. Periksa variabel `AWS_BUCKET` dan `AWS_ENDPOINT` di `.env`.<br>2. Pastikan file tersimpan pada path yang benar di S3.<br>3. Ingat bahwa berkas di-stream melalui rute `/media/{path}` oleh [`MediaController.php`](file:///c:/Users/An/Herd/skillmongo/app/Http/Controllers/MediaController.php). |
| **Proses Build Gagal saat `npm run build`** | Out of Memory pada kontainer build atau type error TypeScript. | 1. Jalankan `npm run types` secara lokal untuk memastikan tidak ada error TypeScript sebelum melakukan git push.<br>2. Periksa log build di tab **Deployments** Laravel Cloud. |
| **Galat "Connection Pool Exhausted" pada MongoDB** | Jumlah proses kontainer melebihi batas 100 koneksi bersamaan paket Atlas M0. | Pastikan `MONGODB_URI` memuat parameter: `&maxPoolSize=10&maxIdleTimeMS=30000`. Batasi jumlah worker processes maksimal 1 atau 2 proses. |
| **Google Login Menghasilkan "Redirect URI Mismatch"** | Domain di Google Console tidak sesuai dengan URL produksi. | Buka Google Cloud Console $\rightarrow$ Credentials $\rightarrow$ OAuth 2.0 Client ID $\rightarrow$ pastikan **Authorized Redirect URI** bernilai tepat: `https://skillventura.com/auth/google/callback`. |
| **Sertifikat SSL Berstatus "Pending" di Domain Kustom** | Catatan CNAME DNS di domain registrar belum terpropagasi secara global. | Gunakan tool seperti `dnschecker.org` untuk memverifikasi propagasi CNAME. Laravel Cloud akan otomatis menerbitkan sertifikat Let's Encrypt begitu DNS terdeteksi valid. |
| **Email Reset Password Tidak Terkirim** | Kredensial App Password Gmail salah atau port SSL terblokir. | Pastikan menggunakan **16-digit App Password** Google (bukan password login biasa), `MAIL_PORT=465`, dan `MAIL_SCHEME=smtps`. |

### 8.2 Pemantauan Log Sistem Waktu Nyata (Live Logs)
1. Buka dashboard Laravel Cloud $\rightarrow$ pilih aplikasi `SkillVentura LMS Enterprise`.
2. Klik tab **Logs** / **Live Logs**.
3. Aliran log HTTP request, background worker logs, dan exception stack traces akan ditampilkan secara *real-time* untuk memudahkan diagnosa kendala operasional tanpa memerlukan akses SSH server fisik.

---

## BAB IX: Daftar Periksa Kesiapan Produksi (Go-Live Checklist)

Gunakan tabel daftar periksa berikut sebelum meluncurkan sistem kepada siswa dan tenaga pendidik:

```markdown
[ ] 1. Cluster MongoDB Atlas M0 aktif di region Singapore (ap-southeast-1).
[ ] 2. Database User 'kusiapanama16_db_user' terdaftar dengan hak akses penuh.
[ ] 3. Network Access Atlas disetel ke '0.0.0.0/0' dengan status Active.
[ ] 4. S3 Object Storage Bucket dibuat dengan nama 'fls-a3030587-455e-44f0-9eb3-32be9b06810d' berstatus PRIVATE.
[ ] 5. Seluruh folder media cadangan (public/images/BackupData/ObjectStorage/) telah disinkronkan ke S3 Bucket.
[ ] 6. Kredensial Google OAuth 2.0 Client ID telah dikonfigurasi dengan Redirect URI resmi.
[ ] 7. Kredensial SMTP Email Relay (Gmail App Password) telah diuji dan aktif.
[ ] 8. Seluruh Environment Variables produksi telah diinjeksikan pada tab Variables Laravel Cloud.
[ ] 9. Pipeline build sukses dieksekusi tanpa error (Composer, Wayfinder, NPM Build).
[ ] 10. Perintah 'php artisan migrate --force' sukses dijalankan di terminal console Laravel Cloud.
[ ] 11. Akun Super Admin telah dibuat melalui Tinker tanpa menyentuh db:seed.
[ ] 12. Managed Worker aktif untuk pemrosesan background queue.
[ ] 13. Managed Scheduled Tasks aktif untuk eksekusi otomatis quests expiry.
[ ] 14. Domain kustom resmi institusi terhubung dan sertifikat SSL Let's Encrypt aktif (HTTPS).
[ ] 15. Tes fungsional login Google, pendaftaran siswa, modul ajar, dan unggah berkas telah diverifikasi sukses.
```

---
*Dokumen ini diterbitkan secara resmi sebagai Standard Operating Procedure (SOP) Deployment & Maintenance Sistem Manajemen Pembelajaran SkillVentura Enterprise.*
