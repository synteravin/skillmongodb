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
| **Platform Komputasi** | **Laravel Cloud** (Official Serverless Managed PaaS) |
| **Basis Data NoSQL** | **MongoDB Atlas Cloud** (Multi-AZ Shared Replica Set Free Tier M0) |
| **Penyimpanan Objek** | **Object Storage S3-Compatible** (Cloudflare R2 / Private Bucket + `/media/` Streaming) |
| **Target Ketersediaan (SLA)** | 99.5% Uptime Bulanan (High Availability Serverless Architecture) |
| **Versi Dokumen** | **Edisi 3.0** (Alur Runtut: Setup Environment -> Setup Deployment -> Maintenance) |
| **Tanggal Terbit** | November 2026 |

> [!IMPORTANT]
> **PANDUAN OPERASIONAL ADMINISTRATOR:**
> Dokumen ini dirancang sebagai acuan instruksi kerja baku (*Step-by-Step SOP*) tanpa ada langkah yang ambigu. Seluruh konfigurasi disusun secara runtut mengikuti 3 fase implementasi:
> 1. **Fase 1: Setup Environment** — Penyiapan seluruh infrastruktur cloud, basis data, penyimpanan media, dan kredensial sebelum aplikasi di-deploy.
> 2. **Fase 2: Setup Deployment** — Alur peluncuran aplikasi ke Laravel Cloud, pipeline kompilasi, injeksi environment, migrasi, dan konfigurasi domain.
> 3. **Fase 3: Maintenance** — Prosedur pemeliharaan berkala, pencadangan data (*backup*), restorasi basis data (*restore*), pembersihan cache, dan mitigasi insiden (*troubleshooting*).

---

## DAFTAR ISI RUNBOOK

* **[BAGIAN I: SETUP ENVIRONMENT (PERSIAPAN INFRASTRUKTUR & LAYANAN CLOUD)](#bagian-i-setup-environment-persiapan-infrastruktur--layanan-cloud)**
  * [Bab 1: Topologi Arsitektur Cloud & Matriks Dependensi Terkunci](#bab-1-topologi-arsitektur-cloud--matriks-dependensi-terkunci)
  * [Bab 2: Persiapan Basis Data MongoDB Atlas Cloud (Free Tier M0)](#bab-2-persiapan-basis-data-mongodb-atlas-cloud-free-tier-m0)
  * [Bab 3: Persiapan Penyimpanan Objek (Object Storage Cloudflare R2 / S3)](#bab-3-persiapan-penyimpanan-objek-object-storage-cloudflare-r2--s3)
  * [Bab 4: Persiapan Kredensial Layanan Eksternal (Google OAuth & Gmail SMTP)](#bab-4-persiapan-kredensial-layanan-eksternal-google-oauth--gmail-smtp)

* **[BAGIAN II: SETUP DEPLOYMENT (PENERAPAN APLIKASI KE LARAVEL CLOUD)](#bagian-ii-setup-deployment-penerapan-aplikasi-ke-laravel-cloud)**
  * [Bab 5: Prosedur Deployment Aplikasi di Laravel Cloud](#bab-5-prosedur-deployment-aplikasi-di-laravel-cloud)
  * [Bab 6: Konfigurasi Layanan Latar Belakang (Managed Worker & Scheduler)](#bab-6-konfigurasi-layanan-latar-belakang-managed-worker--scheduler)

* **[BAGIAN III: MAINTENANCE (PEMELIHARAAN SISTEM, PENCADANGAN, & RESTORASI)](#bagian-iii-maintenance-pemeliharaan-sistem-pencadangan--restorasi)**
  * [Bab 7: Prosedur Pencadangan Data Rutin (Data Backup)](#bab-7-prosedur-pencadangan-data-rutin-data-backup)
  * [Bab 8: Prosedur Restorasi Basis Data & Media (Restoration)](#bab-8-prosedur-restorasi-basis-data--media-restoration)
  * [Bab 9: Pemeliharaan Sistem, Troubleshooting, & Go-Live Checklist](#bab-9-pemeliharaan-sistem-troubleshooting--go-live-checklist)

---

# BAGIAN I: SETUP ENVIRONMENT (PERSIAPAN INFRASTRUKTUR & LAYANAN CLOUD)

Sebelum melakukan deployment aplikasi, seluruh infrastruktur dan layanan pendukung wajib disiapkan dan diuji konektivitasnya terlebih dahulu.

---

## Bab 1: Topologi Arsitektur Cloud & Matriks Dependensi Terkunci

### 1.1 Diagram Alur Arsitektur Cloud Terkelola

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
│  (Atlas M0 Singapore)   │      │  (Cloudflare R2 / S3)   │      │ (Google Auth & SMTP)    │
│ - 38 Koleksi Sistem     │      │ - Private Bucket        │      │ - Google OAuth 2.0      │
│ - SCRAM-SHA-256 Auth    │      │ - Stream: /media/{path} │      │ - Gmail SMTP Relay      │
│ - Multi-AZ Replica Set  │      │ - Avatars, PDFs, ZIPs   │      │   Port 465 (SSL/TLS)    │
└─────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```

### 1.2 Matriks Layanan Infrastruktur Utama

| Komponen Infrastruktur | Platform / Vendor | Spesifikasi & Versi | Peran & Tanggung Jawab Operasional |
| :--- | :--- | :--- | :--- |
| **1. Serverless Web Engine** | **Laravel Cloud** | PHP 8.4.x / Laravel 12.x | Menjalankan logika bisnis, perutean Inertia.js, autentikasi sesi, dan eksekutor pekerjaan queue/cron. |
| **2. Basis Data NoSQL** | **MongoDB Atlas** | v8.0 (Free Tier M0) | Menyimpan seluruh dokumen transaksional, kurikulum, kuis, progress gamifikasi EXP/Gold, dan arbitrase. |
| **3. Penyimpanan Objek** | **Cloudflare R2 / S3** | S3-Compatible API | Menampung berkas fisik statis: materi pelajaran PDF, aset gambar modul, sertifikat, dan arsip tugas ZIP. |
| **4. Otentikasi Sosial (SSO)**| **Google Cloud Console**| OAuth 2.0 API (Socialite) | Memungkinkan siswa dan mentor mendaftar serta masuk dengan satu kali klik akun Google resmi. |
| **5. Email Gateway** | **Gmail SMTP Relay** | Port 465 (SSL) / 587 (TLS)| Mengirimkan tautan reset password dan verifikasi akun baru secara transaksional. |

### 1.3 Karakteristik & Batasan Paket Bebas Biaya (Free Tier M0 Strategy)

| Dimensi Parameter | Batasan Teknis Free Tier M0 | Strategi Optimasi Arsitektur SkillVentura |
| :--- | :--- | :--- |
| **Kapasitas Penyimpanan DB** | 512 MB Storage Limit | **Pemisahan Fisik Berkas Mutlak**: Dokumen PDF dan gambar dilarang disimpan dalam database. MongoDB hanya menampung metadata teks ringkas (~2-5 KB per baris). Kuota 512 MB sanggup menampung lebih dari 100.000 riwayat pembelajaran. |
| **Koneksi Bersamaan** | Maksimal 100 soket simultan | **Connection Pooling Tuning**: String koneksi ditambahkan parameter `&maxPoolSize=10&maxIdleTimeMS=30000` untuk mencegah serverless worker menghabiskan kuota soket database. |
| **Backup Otomatis Atlas** | Tidak didukung pada paket M0 | **Prosedur Cadangan Mandiri**: Menggunakan CLI `mongodump` dan utilitas internal `php artisan db:backup-mongo` yang diekspor secara berkala ke media lokal institusi. |

### 1.4 Matriks Pustaka & Tumpukan Teknologi Terkunci (*Locked Dependency Matrix*)

Audit komprehensif terhadap [`composer.lock`](file:///c:/Users/An/Herd/skillmongo/composer.lock) dan [`package-lock.json`](file:///c:/Users/An/Herd/skillmongo/package-lock.json) dilakukan guna menjamin kepatuhan versi dependensi secara deterministik di lingkungan cloud tanpa risiko degradasi pustaka (*dependency mismatch*):

#### A. Spesifikasi Lingkungan Runtime & Kepatuhan Keamanan
* **PHP Runtime**:
  - Konfigurasi `composer.json`: `"php": "^8.2"` (Baseline Laravel 12 Enterprise).
  - Runtime Produksi Laravel Cloud: **PHP 8.4.x Serverless Container**.
  - Lingkungan CLI Lokal Administrator: **PHP 8.4.27 (cli) NTS x64**.
* **Ekstensi PHP Wajib**:
  - **`ext-mongodb` v2.5.5**: Driver resmi C/PHP untuk konektivitas klaster MongoDB Atlas.
  - **`ext-gd`**: Pustaka grafis GD untuk pemrosesan gambar cover, badge RPG, dan sertifikat.
  - **`ext-dom` & `ext-mbstring`**: Penguraian DOM XML & multi-byte string untuk Barryvdh DomPDF.
* **Node.js Runtime & Mitigasi Kerentanan Keamanan (Security Advisory)**:
  - Konfigurasi `package.json`: `"@types/node": "^22.13.5"`.
  - **Audit Kerentanan Kritis CVE-2026-111497 (Brotli RCE, CVSS 9.2)**:
    - *Latar Belakang*: Pada buletin keamanan resmi 21 Oktober 2026, teridentifikasi celah *Out-of-Bounds Write* pada pustaka Brotli decoder di dalam modul internal `node:zlib` yang memungkinkan penyerang mengeksekusi kode sembarangan (*Remote Code Execution*).
    - *Status Sistem Lokal*: Binary Node.js di mesin lokal administrator berada pada versi **`v24.22.1`** (`C:\Program Files\nodejs\node.exe`), yang merupakan versi rilis patch resmi yang telah menutup celah tersebut (kebal dari kerentanan).
    - *Aturan Produksi (Production Rule)*: Lingkungan build Laravel Cloud dan server produksi **WAJIB MENGGUNAKAN** minimal **Node.js v22.23.4+ (lini 22.x LTS)** atau **Node.js v24.22.1+ (lini 24.x)**. Dilarang keras menggunakan versi unpatched (seperti `v24.7.0` atau `v22.13.0`).
* **Tooling & Package Manager**:
  - **NPM Package Manager**: **v11.19.1**.
  - **Frontend Bundler**: **Vite v7.3.7** (`@tailwindcss/vite v4.3.3`).
  - **TypeScript Engine**: **TypeScript v5.9.3**.

#### B. Matriks Dependensi Backend PHP (`composer.lock`)

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
| **`laravel/tinker`** | `v2.11.1` | `^2.10.1` | Powerful REPL untuk inisialisasi akun Super Admin & maintenance. |
| **`pestphp/pest`** | `v4.7.8` | `^4.3` | Test Runner Framework Pest 4 (Berasosiasi PHPUnit `12.5.33`).|
| **`laravel/pint`** | `v1.32.1` | `^1.24` | Formatter Standar Penulisan Kode PHP Laravel Resmi. |

#### C. Matriks Dependensi Frontend React/TypeScript (`package-lock.json`)

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
| **`@dnd-kit/core`** & **`sortable`** | `6.3.1` / `10.0.0` | `^6.3.1` / `^10.0.0` | Drag and Drop Kit untuk Builder Modul Kursus interaktif. |
| **`eslint`** & **`prettier`** | `9.39.5` / `3.9.6` | `^9.17.0` / `^3.4.2` | Linter Kode & Code Formatter Otomatis untuk JS/TSX/CSS. |

---

## Bab 2: Persiapan Basis Data MongoDB Atlas Cloud (Free Tier M0)

Penyiapan basis data cloud dilakukan pada portal resmi MongoDB Atlas (`cloud.mongodb.com`) melalui 9 langkah terverifikasi:

### 2.1 Langkah 1: Registrasi Akun & Pembuatan Klaster Free Tier
1. Kunjungi portal resmi: `https://www.mongodb.com/cloud/atlas/register`.
2. Pada wizard **Deploy your cluster**, pilih paket **Free (M0)** (512 MB Storage).
3. Beri nama cluster: `SkillVentura`. Pilih Cloud Provider: **AWS** dan Region: **Singapore (ap-southeast-1)** untuk menjamin latensi jaringan terendah (< 35 ms) bagi pengguna di Indonesia.
4. Klik **Create Deployment**.

![Gambar 2.1: Penyediaan Klaster M0 Free di Region Singapore AWS](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/SetupMongoDB/CreateMongoDB/Step-1.png)
*Gambar 2.1: Halaman konfigurasi awal pemilihan paket Free Tier, nama klaster SkillVentura, dan lokasi server AWS Singapore.*

---

### 2.2 Langkah 2: Pembuatan Kredensial Pengguna Database & Keamanan Quickstart
1. Sistem menampilkan wizard **Connect to SkillVentura** (*Step 1: Set up connection security*).
2. Buat akun pengguna database (*Database User*): `kusiapanama16_db_user`.
3. Salin dan simpan kata sandi (*Password*) yang dihasilkan ke tempat yang aman.
4. Alamat IP lokal administrator akan otomatis ditambahkan ke daftar izin sementara.

![Gambar 2.2: Pembuatan Database User & Penyimpanan Kredensial](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/SetupMongoDB/CreateMongoDB/Step-2.png)
*Gambar 2.2: Layar konfirmasi pembuatan pengguna database dan pengamanan kata sandi otentikasi.*

---

### 2.3 Langkah 3: Pemilihan Metode Koneksi Aplikasi
1. Pada modal **Choose a connection method**, pilih opsi **Drivers and Client Libraries** untuk menghubungkan aplikasi backend berbasis PHP Laravel.

![Gambar 2.3: Pemilihan Metode Koneksi Drivers](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/SetupMongoDB/CreateMongoDB/Step-3.png)
*Gambar 2.3: Pilihan metode penghubungan klaster menggunakan driver resmi bahasa pemrograman.*

---

### 2.4 Langkah 4: Pengambilan String Koneksi Driver PHP (Format SRV)
1. Pilih Language: **PHP** dan Client Library: **Laravel MongoDB Integration** (Version 1.15 or later).
2. Sistem menyajikan URI resmi format SRV:
   ```text
   mongodb+srv://kusiapanama16_db_user:<db_password>@skillventura.4raqp5z.mongodb.net/
   ```
3. Tambahkan nama database dan parameter pooling untuk menjaga kestabilan serverless container:
   ```text
   mongodb+srv://kusiapanama16_db_user:<db_password>@skillventura.4raqp5z.mongodb.net/skillventura?retryWrites=true&w=majority&maxPoolSize=10&maxIdleTimeMS=30000
   ```

![Gambar 2.4: Pengambilan Connection String URI Resmi untuk Laravel](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/SetupMongoDB/CreateMongoDB/Step-4.png)
*Gambar 2.4: Tampilan modal yang menyajikan string koneksi MongoDB driver PHP untuk diinjeksikan pada .env.*

---

### 2.5 Langkah 5: Navigasi Menu Keamanan Jaringan & Database Access
1. Dari dashboard klaster SkillVentura di MongoDB Atlas, buka menu bilah sisi kiri pada grup **SECURITY** $\rightarrow$ klik **Database & Network Access**.

![Gambar 2.5: Navigasi Menu Database & Network Access](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/SetupMongoDB/CreateMongoDB/Step-6.png)
*Gambar 2.5: Tampilan Data Explorer dan perpindahan navigasi ke menu pengaturan hak akses keamanan klaster.*

---

### 2.6 Langkah 6: Verifikasi Kredensial Pengguna Database (Database Users)
1. Pada tab **Database Users**, pastikan akun `kusiapanama16_db_user` telah berstatus aktif dengan autentikasi **SCRAM** dan hak akses `atlasAdmin@admin`.
2. Di bilah menu kiri, klik submenu **IP Access List** di bawah **NETWORK ACCESS**.

![Gambar 2.6: Verifikasi Pengguna Database & Hak Akses SCRAM](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/SetupMongoDB/CreateMongoDB/Step-7.png)
*Gambar 2.6: Halaman Database Users membuktikan user kusiapanama16_db_user aktif dan siap dialihkan ke pengaturan IP Access List.*

---

### 2.7 Langkah 7: Pemeriksaan Daftar IP Access List & Penambahan Alamat IP
1. Pada halaman **IP Access List**, periksa daftar IP awal yang hanya memuat IP lokal administrator (`158.140.180.89/32`).
2. Klik tombol **+ ADD IP ADDRESS** di pojok kanan atas.

![Gambar 2.7: Pemeriksaan Daftar IP Access List Awal](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/SetupMongoDB/CreateMongoDB/Step-8.png)
*Gambar 2.7: Daftar IP firewall awal yang hanya mengizinkan IP lokal administrator.*

---

### 2.8 Langkah 8: Penambahan Aturan Firewall 0.0.0.0/0 (Serverless Ingress)
1. Pada jendela modal **Add IP Access List Entry**, masukkan `0.0.0.0/0` (*Allow access from anywhere*).
2. Beri catatan komentar: `Laravel Cloud Serverless Pool`, lalu klik **Confirm**.
3. **Penting**: Aturan ini mutlak diperlukan karena kontainer serverless Laravel Cloud memiliki rentang alamat IP keluar (*egress*) dinamis yang berubah-ubah saat auto-scaling berlangsung. Keamanan koneksi tetap terproteksi penuh melalui autentikasi kredensial SCRAM dan enkripsi transport TLS/SSL bawaan MongoDB SRV.

![Gambar 2.8: Konfigurasi Firewall IP 0.0.0.0/0 untuk Serverless PaaS](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/SetupMongoDB/CreateMongoDB/Step-9.png)
*Gambar 2.8: Jendela modal penambahan alamat 0.0.0.0/0 agar kontainer Laravel Cloud dapat berkomunikasi secara fleksibel.*

---

### 2.9 Langkah 9: Verifikasi Status Aktif Firewall Jaringan
1. Pastikan kedua entri IP Access List telah berstatus **Active**:
   - `0.0.0.0/0 (includes your current IP address)` — **Active**
   - IP lokal administrator (`158.140.180.89/32`) — **Active**

![Gambar 2.9: Verifikasi Status Aktif Kedua Entri IP Access List](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/SetupMongoDB/CreateMongoDB/Step-10.png)
*Gambar 2.9: Tampilan akhir firewall Network Access yang membuktikan status 0.0.0.0/0 telah aktif.*

---

## Bab 3: Persiapan Penyimpanan Objek (Object Storage Cloudflare R2 / S3)

Sistem SkillVentura menggunakan protokol penyimpanan objek yang kompatibel dengan Amazon S3 (seperti **Cloudflare R2** atau **Laravel Cloud Storage Bucket**).

### 3.1 Pembuatan Bucket Penyimpanan
1. Buka dashboard Cloudflare R2 atau Laravel Cloud Storage $\rightarrow$ klik **Create Bucket**.
2. Beri nama bucket: `skillventura-storage` atau nama bucket yang tertera pada lingkungan institusi (misal: `fls-a3030587-455e-44f0-9eb3-32be9b06810d`).
3. Pilih lokasi geografis terdekat (Asia Pasifik / Singapore) lalu simpan.

### 3.2 Pembuatan Kredensial API Token
1. Buka menu **Manage R2 API Tokens** $\rightarrow$ klik **Create API Token**.
2. Beri izin akses **Object Read & Write** pada bucket tersebut.
3. Simpan parameter berikut dengan aman:
   - **Access Key ID** (`AWS_ACCESS_KEY_ID`)
   - **Secret Access Key** (`AWS_SECRET_ACCESS_KEY`)
   - **Endpoint S3 URL** (`AWS_ENDPOINT`)

### 3.3 Arsitektur Keamanan Akses Berkas (Private Streaming Proxy)

> [!IMPORTANT]
> **PENJELASAN PENTING ARSITEKTUR MEDIA:**
> Berbeda dengan aplikasi web tradisional yang mengharuskan bucket dibuka ke publik (*Public Read*), LMS SkillVentura mengadopsi mekanisme **Application Streaming Proxy** via [`MediaController.php`](file:///c:/Users/An/Herd/skillmongo/app/Http/Controllers/MediaController.php):
> - **Bucket S3 WAJIB DISIAPKAN SECARA PRIVATE** (Akses publik dinonaktifkan).
> - Seluruh berkas (avatar, modul, gambar materi, sertifikat, bukti transfer) diakses melalui rute aplikasi:
>   `GET https://skillventura.com/media/{path}`
> - Controller secara internal membaca stream dari S3 secara privat lalu mengalirkannya ke browser siswa dengan header MIME yang valid dan proteksi *Cache-Control* 24 jam. Hal ini mencegah kebocoran dokumen rahasia dan melindungi sistem dari pembengkakan kuota egress akibat *hotlinking* liar.

### 3.4 Konfigurasi Path-Style Endpoint
Pada [`config/filesystems.php`](file:///c:/Users/An/Herd/skillmongo/config/filesystems.php#L58), parameter `AWS_USE_PATH_STYLE_ENDPOINT` dikonfigurasi sebagai berikut:
- **Cloudflare R2 & MinIO**: Setel `AWS_USE_PATH_STYLE_ENDPOINT=true` (Format URL: `https://<account_id>.r2.cloudflarestorage.com/<bucket_name>/<file>`).
- **Amazon S3 Murni**: Setel `AWS_USE_PATH_STYLE_ENDPOINT=false` (Format Virtual-Host: `https://<bucket_name>.s3.amazonaws.com/<file>`).

---

## Bab 4: Persiapan Kredensial Layanan Eksternal (Google OAuth & Gmail SMTP)

### 4.1 Setup Google Cloud Console (Google Login / Socialite)
1. Akses **Google Cloud Console**: `https://console.cloud.google.com/apis/credentials`.
2. Buat Project baru: `SkillVentura-LMS`.
3. Konfigurasikan **OAuth Consent Screen** (User Type: External).
4. Buat kredensial baru bertipe **OAuth 2.0 Client ID** (Web Application).
5. Isi konfigurasi endpoint:
   - **Authorized JavaScript origins**: `https://skillventura.com`
   - **Authorized redirect URIs**: `https://skillventura.com/auth/google/callback`
6. Salin **Client ID** (`GOOGLE_CLIENT_ID`) dan **Client Secret** (`GOOGLE_CLIENT_SECRET`) untuk diinjeksikan pada `.env`.

### 4.2 Setup Layanan Email SMTP Transaksional
Untuk memastikan fitur reset password dan verifikasi akun berjalan lancar menggunakan Gmail SMTP Resmi:
1. Masuk ke Akun Google $\rightarrow$ menu **Keamanan (Security)** $\rightarrow$ aktifkan **Verifikasi 2 Langkah (2-Step Verification)**.
2. Buka menu **Sandi Aplikasi (App Passwords)**, buat sandi baru dengan nama `SkillVentura Mailer`.
3. Salin 16-digit kode sandi yang dihasilkan (tanpa spasi).
4. Konfigurasi port produksi: `MAIL_PORT=465` dan `MAIL_SCHEME=smtps`.

---

# BAGIAN II: SETUP DEPLOYMENT (PENERAPAN APLIKASI KE LARAVEL CLOUD)

Setelah seluruh kredensial pada Bagian I siap, proses peluncuran aplikasi ke platform serverless Laravel Cloud dapat dilakukan langkah-demi-langkah.

---

## Bab 5: Prosedur Deployment Aplikasi di Laravel Cloud

### 5.1 Langkah 1: Menghubungkan Repositori GitHub
1. Masuk ke dashboard resmi: `https://cloud.laravel.com`.
2. Klik tombol **+ New Application**.
3. Pilih penyedia Git: **GitHub**, lalu berikan otorisasi akses ke repositori proyek `skillmongo`.
4. Pilih repositori dan tentukan branch produksi: `main`.
5. Beri nama aplikasi: `SkillVentura LMS Enterprise`.

### 5.2 Langkah 2: Konfigurasi Runtime Environment & Build Hooks
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

### 5.3 Langkah 3: Injeksi Variabel Lingkungan Produksi (.env)
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

### 5.4 Langkah 4: Migrasi Indeks & Inisialisasi Akun Super Admin
Setelah proses deployment pertama selesai, buka tab **Console / Terminal** di Laravel Cloud:

1. **Eksekusi Migrasi Database**:
   ```bash
   php artisan migrate --force
   ```
   *(Perintah ini akan membuat koleksi MongoDB dan mengompilasi struktur indeksnya tanpa menyentuh data existing)*.

2. **Inisialisasi Akun Super Administrator Awal via Tinker**:
   ```bash
   php artisan tinker --execute "App\Models\User::updateOrCreate(['email' => 'admin@skillventura.com'], ['name' => 'Super Admin', 'password' => bcrypt('SkillVentura2026!Secure'), 'role' => 'admin', 'is_active' => true, 'email_verified_at' => now()]);"
   ```

> [!CAUTION]
> **ATURAN INTEGRITAS DATA PRODUKSI:**
> **Dilarang keras menjalankan `php artisan db:seed` di lingkungan produksi.** Database produksi harus dimulai dalam kondisi bersih tanpa data uji/dummy buatan.

### 5.5 Langkah 5: Konfigurasi Kustom Domain & Auto-SSL
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

## Bab 6: Konfigurasi Layanan Latar Belakang (Managed Worker & Scheduler)

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

# BAGIAN III: MAINTENANCE (PEMELIHARAAN SISTEM, PENCADANGAN, & RESTORASI)

Prosedur operasional rutin untuk menjaga kestabilan sistem, pencadangan data (*data backup*), pemulihan basis data (*restoration*), dan pemantauan performa di lingkungan produksi.

---

## Bab 7: Prosedur Pencadangan Data Rutin (Data Backup)

Prosedur berikut memanfaatkan berkas, skrip, dan tangkapan layar verifikasi yang telah dipersiapkan di dalam repositori: [`public/images/BackupData/`](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/).

### 7.1 Prosedur Pencadangan Database MongoDB Atlas
Pencadangan database dapat dilakukan langsung dari Windows PowerShell administrator menggunakan utilitas CLI `mongodump`:

1. **Pembuatan Folder Penampung Backup**:
   ```powershell
   New-Item -ItemType Directory -Force -Path "C:\Users\An\Documents\BackupData\MongoDB"
   ```

2. **Eksekusi Pencadangan via `mongodump`**:
   ```powershell
   mongodump --uri="mongodb+srv://kusiapanama16_db_user:<password>@skillventura.4raqp5z.mongodb.net/skillventura?retryWrites=true&w=majority" --db=skillventura --archive="C:\Users\An\Documents\BackupData\MongoDB\skillventura-production.gz" --gzip
   ```
   *(Perintah di atas mengekspor seluruh koleksi transaksional aktif ke dalam berkas arsip biner tunggal `skillventura-production.gz`)*.

![Gambar 7.1: Eksekusi Pencadangan Database via mongodump di Windows PowerShell](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/SetupMongoDB/SetupBackup/Step-5.png)
*Gambar 7.1: Proses dumping seluruh koleksi MongoDB aktif ke dalam berkas arsip skillventura-production.gz.*

#### Alternatif Internal: Artisan Command Proyek
Aplikasi juga dilengkapi command internal [`BackupMongoDatabase.php`](file:///c:/Users/An/Herd/skillmongo/app/Console/Commands/BackupMongoDatabase.php) yang dapat dieksekusi di server:
```bash
php artisan db:backup-mongo
```

---

### 7.2 Prosedur Pencadangan Media Object Storage (AWS S3 Sync)
Pencadangan seluruh berkas media fisik (foto avatar, cover kursus, spesimen tanda tangan mentor, lampiran tugas) dari Cloudflare R2 / S3 ke penyimpanan lokal dilakukan menggunakan AWS CLI:

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

![Gambar 7.2A: Pengecekan Folder S3 Bucket via AWS CLI di Windows PowerShell](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/SetupObjectStorage/BackupObjectStorage/OBS-1.png)
*Gambar 7.2A: Daftar folder media terverifikasi ada di dalam S3 Bucket dan direktori lokal dipersiapkan.*

2. **Eksekusi Sinkronisasi Unduhan Berkas Media (AWS S3 Sync)**:
   ```powershell
   aws s3 sync "s3://$Bucket/" "C:\Users\An\Documents\BackupData\ObjectStorage" `
     --endpoint-url $Endpoint `
     --region $Region `
     --no-progress
   ```

![Gambar 7.2B: Eksekusi Sinkronisasi Unduhan Berkas Media via AWS CLI](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/SetupObjectStorage/BackupObjectStorage/OBS-2.png)
*Gambar 7.2B: Proses penarikan berkas media dari Cloudflare R2 ke folder BackupData.*

Struktur 12 folder media yang tersimpan di dalam [`public/images/BackupData/ObjectStorage/`](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/ObjectStorage/):
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

---

## Bab 8: Prosedur Restorasi Basis Data & Media (Restoration)

### 8.1 Prosedur Restorasi Basis Data MongoDB Atlas
Apabila terjadi kebutuhan pemulihan data atau pemindahan server dan institusi ingin merestorasi database dari berkas cadangan resmi: [`public/images/BackupData/MongoDB/skillventura-production.gz`](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/MongoDB/skillventura-production.gz):

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

![Gambar 8.1A: Eksekusi Pemulihan Database via mongorestore di Windows PowerShell](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/SetupMongoDB/SetupRestore/Step-1%20Restore.png)
*Gambar 8.1A: Proses restore koleksi database dari berkas arsip skillventura-production.gz ke klaster MongoDB Atlas.*

---

### 8.2 Verifikasi Hasil Pemulihan di MongoDB Atlas Data Explorer
Setelah proses pemulihan selesai:
1. Masuk ke dashboard MongoDB Atlas $\rightarrow$ pilih klaster **SkillVentura**.
2. Klik tab **Data Explorer** $\rightarrow$ buka database `skillventura`.
3. Pastikan database telah memuat **38 Koleksi** dan **74 Indeks** secara utuh dan valid.

![Gambar 8.1B: Verifikasi Keberhasilan Restore di Atlas Data Explorer](file:///c:/Users/An/Herd/skillmongo/public/images/BackupData/SetupMongoDB/SetupRestore/Hasil.png)
*Gambar 8.1B: Tampilan Data Explorer membuktikan 38 koleksi dan 74 indeks telah pulih sempurna.*

---

### 8.3 Prosedur Restorasi Berkas Media ke S3 Baru
Jika ingin mengunggah kembali seluruh berkas ini ke S3 Bucket yang baru dibuat:
```powershell
aws s3 sync "public/images/BackupData/ObjectStorage/" "s3://$Bucket/" `
  --endpoint-url $Endpoint `
  --region $Region
```

---

## Bab 9: Pemeliharaan Sistem, Troubleshooting, & Go-Live Checklist

### 9.1 Prosedur Pembersihan Tembolok (Cache Clearing)
Jika terjadi perubahan konfigurasi variabel lingkungan di Laravel Cloud, jalankan:
```bash
php artisan optimize:clear
```
Kemudian tekan tombol **Redeploy** pada tab Deployments Laravel Cloud agar seluruh kontainer web memuat konfigurasi baru secara serempak.

---

### 9.2 Matriks Mitigasi Kendala Operasional Cepat (Troubleshooting)

| Gejala Insiden | Kemungkinan Penyebab Utama | Prosedur Solusi Teknis Terarah |
| :--- | :--- | :--- |
| **Autentikasi MongoDB Ditolak / Timeout saat Deploy** | 1. Kata sandi mengandung karakter khusus yang belum di-URL encode.<br>2. Network Access Atlas belum dibuka `0.0.0.0/0`. | 1. Jika password mengandung simbol (seperti `@`, `#`), ganti menjadi format URL-encoded (misal `@` menjadi `%40`) atau buat sandi alfanumerik murni.<br>2. Buka MongoDB Atlas $\rightarrow$ Network Access $\rightarrow$ pastikan `0.0.0.0/0` berstatus **Active**. |
| **Berkas Media Gambar / PDF Menghasilkan Error 404** | Konfigurasi S3 salah atau berkas belum diunggah ke path yang sesuai di bucket. | 1. Periksa variabel `AWS_BUCKET` dan `AWS_ENDPOINT` di `.env`.<br>2. Pastikan file tersimpan pada path yang benar di S3.<br>3. Ingat bahwa berkas di-stream melalui rute `/media/{path}` oleh [`MediaController.php`](file:///c:/Users/An/Herd/skillmongo/app/Http/Controllers/MediaController.php). |
| **Proses Build Gagal saat `npm run build`** | Out of Memory pada kontainer build atau type error TypeScript. | 1. Jalankan `npm run types` secara lokal untuk memastikan tidak ada error TypeScript sebelum melakukan git push.<br>2. Periksa log build di tab **Deployments** Laravel Cloud. |
| **Galat "Connection Pool Exhausted" pada MongoDB** | Jumlah proses kontainer melebihi batas 100 koneksi bersamaan paket Atlas M0. | Pastikan `MONGODB_URI` memuat parameter: `&maxPoolSize=10&maxIdleTimeMS=30000`. Batasi jumlah worker processes maksimal 1 atau 2 proses. |
| **Google Login Menghasilkan "Redirect URI Mismatch"** | Domain di Google Console tidak sesuai dengan URL produksi. | Buka Google Cloud Console $\rightarrow$ Credentials $\rightarrow$ OAuth 2.0 Client ID $\rightarrow$ pastikan **Authorized Redirect URI** bernilai tepat: `https://skillventura.com/auth/google/callback`. |
| **Sertifikat SSL Berstatus "Pending" di Domain Kustom** | Catatan CNAME DNS di domain registrar belum terpropagasi secara global. | Gunakan tool seperti `dnschecker.org` untuk memverifikasi propagasi CNAME. Laravel Cloud akan otomatis menerbitkan sertifikat Let's Encrypt begitu DNS terdeteksi valid. |
| **Email Reset Password Tidak Terkirim** | Kredensial App Password Gmail salah atau port SSL terblokir. | Pastikan menggunakan **16-digit App Password** Google (bukan password login biasa), `MAIL_PORT=465`, dan `MAIL_SCHEME=smtps`. |
| **Peringatan Keamanan / Galat Build Node.js** | Menggunakan Node.js unpatched (< v22.23.4 atau < v24.22.1) yang rentan CVE-2026-111497 atau konfigurasi path npm lokal bercampur. | Pastikan runtime Node.js minimal berada pada **v22.23.4+ (LTS)** atau **v24.22.1+**. Pada mesin Windows lokal, arahkan path eksekusi ke `C:\Program Files\nodejs\node.exe` dan bersihkan cache npm via `npm cache clean --force`. |

---

### 9.3 Pemantauan Log Sistem Waktu Nyata (Live Logs)
1. Buka dashboard Laravel Cloud $\rightarrow$ pilih aplikasi `SkillVentura LMS Enterprise`.
2. Klik tab **Logs** / **Live Logs**.
3. Aliran log HTTP request, background worker logs, dan exception stack traces akan ditampilkan secara *real-time* untuk memudahkan diagnosa kendala operasional tanpa memerlukan akses SSH server fisik.

---

### 9.4 Daftar Periksa Kesiapan Produksi (Go-Live Checklist)

Gunakan tabel daftar periksa berikut sebelum meluncurkan sistem kepada siswa dan tenaga pendidik:

| No | Komponen Verifikasi | Kriteria Keberhasilan & Pengujian | Status Kesiapan |
| :---: | :--- | :--- | :---: |
| 1 | **Klaster MongoDB Atlas** | Cluster M0 aktif di region Singapore (ap-southeast-1), multi-AZ. | `[  ] LULUS` |
| 2 | **Database User** | User `kusiapanama16_db_user` aktif dengan peran `atlasAdmin@admin`. | `[  ] LULUS` |
| 3 | **Network Access Firewall** | Aturan `0.0.0.0/0` dan IP lokal administrator berstatus **Active**. | `[  ] LULUS` |
| 4 | **Object Storage S3** | Bucket `fls-a3030587-455e-44f0-9eb3-32be9b06810d` berstatus **PRIVATE**. | `[  ] LULUS` |
| 5 | **Aset Media Statis** | 12 folder media (`public/images/BackupData/ObjectStorage/`) tersinkronisasi. | `[  ] LULUS` |
| 6 | **Google OAuth 2.0** | Redirect URI `https://skillventura.com/auth/google/callback` terverifikasi. | `[  ] LULUS` |
| 7 | **Email Relay SMTP** | Gmail App Password 16-digit teruji mengirimkan email reset password. | `[  ] LULUS` |
| 8 | **Environment Variables** | Seluruh variabel produksi diinjeksikan pada dashboard Laravel Cloud. | `[  ] LULUS` |
| 9 | **Build Pipeline** | Composer optimize, Wayfinder generate, dan NPM build sukses tanpa galat. | `[  ] LULUS` |
| 10 | **Migrasi Indeks** | `php artisan migrate --force` sukses membuat koleksi dan indeks MongoDB. | `[  ] LULUS` |
| 11 | **Akun Super Admin** | Akun `admin@skillventura.com` dibuat melalui Tinker tanpa menyentuh db:seed. | `[  ] LULUS` |
| 12 | **Managed Worker Queue** | Worker queue aktif memproses penerbitan PDF e-sertifikat kelulusan. | `[  ] LULUS` |
| 13 | **Managed Scheduled Cron** | Cron scheduler aktif memicu `quests:check-expiry` setiap 15 menit. | `[  ] LULUS` |
| 14 | **Domain & Sertifikat SSL** | Domain resmi `skillventura.com` terhubung dan HTTPS Let's Encrypt aktif. | `[  ] LULUS` |
| 15 | **Tes Fungsional End-to-End**| Login Google, pendaftaran siswa, kuis, dan unggah berkas teruji sukses. | `[  ] LULUS` |
| 16 | **Kepatuhan Keamanan Node** | Node.js minimal v22.23.4+ LTS atau v24.22.1+ (bebas celah CVE-2026-111497). | `[  ] LULUS` |

---
*Dokumen ini diterbitkan secara resmi sebagai Standard Operating Procedure (SOP) Deployment & Maintenance Sistem Manajemen Pembelajaran SkillVentura Enterprise.*
