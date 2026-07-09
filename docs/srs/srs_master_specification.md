# Spesifikasi Kebutuhan Perangkat Lunak (Software Requirements Specification - SRS)
## Nama Proyek: Platform SkillMongo (Gamified LMS & Freelance Quest Board)
**Standar Kepatuhan: IEEE Std 830-1998 / ISO/IEC/IEEE 29148:2018**
*Lokasi Dokumen: docs/srs/srs_master_specification.md*

---

## 1. PENDAHULUAN (INTRODUCTION)

### 1.1 Tujuan (Purpose)
Dokumen spesifikasi ini menetapkan spesifikasi kebutuhan perangkat lunak (SRS) menyeluruh untuk platform **SkillMongo**. Dokumen ini dirancang sebagai rujukan utama (single source of truth) untuk memandu pengembang, arsitek sistem, penjamin mutu (QA), dan pemangku kepentingan dalam melakukan perancangan, pengembangan, serta pengujian sistem.

### 1.2 Ruang Lingkup (Scope)
Platform SkillMongo mengintegrasikan sistem manajemen pembelajaran tergamifikasi (*Gamified LMS*) dengan papan lowongan kerja lepas (*Freelance Quest Board*). Platform ini dirancang untuk:
*   Mendorong minat belajar siswa melalui peta jalan visual tergamifikasi.
*   Mengukur kognitif siswa secara adil melalui pengerjaan tugas proyek dan kuis.
*   Memasilitasi siswa memperoleh pengalaman dunia kerja profesional melalui pengerjaan quest freelance yang terproteksi oleh sistem escrow aman.
*   Memberikan imbalan (reward) RPG (EXP, Gold, ERP) atas pencapaian prestasi akademik dan kerja.

### 1.3 Definisi, Akronim, & Singkatan
*   **LMS (Learning Management System)**: Perangkat lunak untuk kurasi, distribusi, dan pelacakan progress pembelajaran digital.
*   **Escrow**: Mekanisme penahanan saldo/koin finansial pihak ketiga yang dirilis hanya ketika kondisi spesifikasi penyerahan ZIP final terpenuhi.
*   **EXP (Experience Points)**: Metrik poin kemajuan akademik siswa.
*   **Gold**: Mata uang virtual game untuk ekosistem mikroekonomi RPG platform.
*   **ERP (Enterprise Readiness Points)**: Metrik reputasi kesiapan industri kerja kognitif siswa.
*   **Passkeys (WebAuthn)**: Mekanisme login tanpa kata sandi menggunakan kredensial biometrik lokal.
*   **NFR (Non-Functional Requirements)**: Parameter kualitas layanan perangkat lunak non-fungsional.
*   **RTM (Requirements Traceability Matrix)**: Tabel pemetaan keterpelusuran kebutuhan.

### 1.4 Rujukan (References)
1.  **IEEE Std 830-1998**: *IEEE Recommended Practice for Software Requirements Specifications*.
2.  **ISO/IEC/IEEE 29148:2018**: *Systems and software engineering — Life cycle processes — Requirements engineering*.
3.  **W3C Web Authentication (WebAuthn)**: *API for accessing Credential Management API*.

### 1.5 Organisasi Dokumen (Document Organization)
Dokumen ini disusun sebagai berikut:
*   **Seksi 1**: Pendahuluan dokumen, cakupan sistem, dan dokumen rujukan.
*   **Seksi 2**: Gambaran umum perspektif produk, ringkasan fungsi, batasan rancangan, serta asumsi sistem.
*   **Seksi 3**: Antarmuka eksternal dan Kebutuhan Fungsional detail dengan format deklaratif ("Sistem harus...").
*   **Seksi 4**: Kamus Data Bisnis Logis konseptual (menghindari representasi database fisik NoSQL).
*   **Seksi 5**: Matriks Verifikasi dan Keterpelusuran Kebutuhan (RTM).

---

## 2. DESKRIPSI UMUM (OVERALL DESCRIPTION)

### 2.1 Perspektif Produk (Product Perspective)
SkillMongo beroperasi sebagai platform mandiri yang mengonsolidasikan kurikulum akademik sekolah/LMS dengan pasar micro-freelance kerja. Sistem berkomunikasi dengan cloud storage untuk manajemen berkas statis dan biometrik browser lokal untuk keamanan.

### 2.2 Ringkasan Fungsi Produk (Product Functions Summary)
*   **Fungsi Autentikasi**: Menyediakan login/daftar aman tradisional, verifikasi email, TOTP 2FA, dan biometrik tanpa password (Passkeys).
*   **Fungsi Akademik (LMS)**: Menyajikan roadmap interaktif, modul ajar, pengiriman tugas, dan pengerjaan kuis kognitif berdurasi.
*   **Fungsi Gamifikasi (RPG)**: Mengakumulasikan EXP, Gold, dan ERP serta menghitung kenaikan level, peringkat reputasi, dan pemberian lencana badges.
*   **Fungsi Pasar Quest (Freelance)**: Memasilitasi transaksi quest (bidding, chat room pelamar, escrow review, zip submission).
*   **Fungsi Kolaborasi**: Menyediakan wadah forum diskusi per kelas dengan fitur reaction emotikon dan pin pesan penting.

### 2.3 Karakteristik Pengguna (User Classes & Characteristics)
*   **Siswa (Student)**: Pembelajar dan pekerja lepas. Membutuhkan antarmuka yang ramah pengguna, gamifikasi interaktif, dan kejelasan alur quest.
*   **Mentor**: Pendidik dan kurator. Membutuhkan antarmuka manajemen kuis, penilaian tugas yang cepat, dan akses status kemajuan siswa.
*   **Administrator**: Pengawas sistem. Membutuhkan kontrol penuh atas audit pengguna, moderasi quest board, dan konfigurasi master data RPG.

### 2.4 Batasan Desain & Implementasi (Design & Implementation Constraints)
Daftar tumpukan teknologi berikut menjadi batasan fisik implementasi sistem:
*   **Bahasa Pemrograman**: Kode backend wajib ditulis menggunakan PHP 8.4, dan frontend wajib menggunakan TypeScript.
*   **Framework**: Backend berbasis Laravel 12 dan frontend menggunakan React 19 SPA (Single Page Application) yang dijembatani oleh Inertia.js v2.
*   **Basis Data**: Menggunakan penyimpanan basis data berorientasi dokumen NoSQL (MongoDB) dengan driver Eloquent Laravel.
*   **Konektivitas Cloud**: Penyimpanan ZIP tugas akhir dan aset visual wajib dikelola melalui AWS S3 Storage API.

### 2.5 Asumsi & Ketergantungan (Assumptions & Dependencies)
*   **Asumsi**: Siswa memiliki perangkat komputer dengan kamera atau sensor sidik jari pendukung autentikasi biometrik jika ingin mengaktifkan Passkeys.
*   **Ketergantungan**: Konektivitas server cloud AWS S3 dan koneksi internet yang stabil agar unggahan file ZIP tidak terputus di tengah jalan.

---

## 3. KEBUTUHAN SPESIFIK (SPECIFIC REQUIREMENTS)

### 3.1 Antarmuka Eksternal (External Interface Requirements)

#### 3.1.1 Antarmuka Pengguna (User Interfaces)
*   Antarmuka wajib mendukung transisi Light dan Dark Mode yang konsisten tanpa adanya elemen tombol yang tidak terbaca di kedua mode tersebut.
*   Resolusi minimum layar ponsel pintar yang didukung adalah 320px lebar (mobile responsive) hingga maksimal 1920px lebar (desktop widescreen).

#### 3.1.2 Antarmuka Perangkat Lunak (Software Interfaces)
*   **WebAuthn API**: Berinteraksi dengan browser klien untuk verifikasi kredensial biometrik sidik jari/wajah.
*   **AWS S3 API**: Mengelola penyimpanan zip file tugas akhir secara terenkripsi dan privat.

#### 3.1.3 Antarmuka Komunikasi (Communications Interfaces)
*   Komunikasi jaringan wajib menggunakan protokol enkripsi HTTPS (port 443) untuk seluruh transmisi data API.
*   Pengiriman email notifikasi dan OTP 2FA menggunakan protokol SMTP terenkripsi (SSL/TLS).

### 3.2 Kebutuhan Fungsional (Functional Requirements)

#### 3.2.1 Autentikasi & Keamanan Akun
*   **REQ-F-AUT-001**: Sistem harus memproses login tradisional menggunakan pencocokan email dan hash sandi Bcrypt.
*   **REQ-F-AUT-002**: Sistem harus memblokir akses pengguna yang belum menyelesaikan verifikasi email setelah melakukan pendaftaran.
*   **REQ-F-AUT-003**: Sistem harus menyediakan opsi autentikasi biometrik tanpa sandi (Passkeys) berbasis protokol WebAuthn menggunakan enkripsi sidik jari/pemindaian wajah lokal.
*   **REQ-F-AUT-004**: Sistem harus mewajibkan input kode verifikasi OTP 6-digit (TOTP) jika pengguna telah mengaktifkan perlindungan Autentikasi Dua-Faktor (2FA).

#### 3.2.2 Peta Jalan & Modul Belajar (LMS)
*   **REQ-F-LMS-001**: Sistem harus menyajikan Roadmap petualangan visual interaktif yang memetakan jalur kemajuan belajar kursus siswa.
*   **REQ-F-LMS-002**: Sistem harus mengunci akses ke modul ajar berikutnya sampai seluruh modul prasyarat sebelumnya dinyatakan selesai dikerjakan oleh siswa.
*   **REQ-F-LMS-003**: Sistem harus memungkinkan siswa menandai suatu modul ajar telah selesai dikerjakan untuk memperbarui status progress belajar.

#### 3.2.3 Penilaian Kognitif (Quiz & Submissions)
*   **REQ-F-EVL-001**: Sistem harus mengacak urutan soal kuis pilihan ganda saat siswa memulai evaluasi kuis akhir jalur belajar.
*   **REQ-F-EVL-002**: Sistem harus membatasi durasi pengerjaan kuis menggunakan *countdown timer* otomatis.
*   **REQ-F-EVL-003**: Sistem harus mencatat hasil akurasi skor kuis pilihan ganda siswa secara instan setelah tombol kirim jawaban ditekan.
*   **REQ-F-EVL-004**: Sistem harus memungkinkan siswa mengunggah tautan dan catatan proyek untuk dievaluasi secara manual oleh Mentor.
*   **REQ-F-EVL-005**: Sistem harus memasilitasi Mentor untuk memberikan penilaian angka (grade) dan catatan perbaikan (*feedback*) terhadap tugas proyek manual siswa.

#### 3.2.4 Ekosistem Gamifikasi RPG
*   **REQ-F-RPG-001**: Sistem harus mengakumulasikan EXP, Gold, dan ERP ke statistik karakter siswa setelah menyelesaikan materi modul, kuis, atau tugas proyek.
*   **REQ-F-RPG-002**: Sistem harus menghitung tingkat level karakter siswa secara dinamis menggunakan rumus matematis kurva kenaikan level:
    $$\text{Level} = \lfloor 0.1 \times \sqrt{\text{EXP}} \rfloor + 1$$
*   **REQ-F-RPG-003**: Peningkatan level siswa berdasarkan rumus REQ-F-RPG-002 harus memicu pembukaan penghargaan lencana prestasi (*badges*) profil siswa secara otomatis.
*   **REQ-F-RPG-004**: Sistem harus menyajikan papan peringkat peringkat global (*Leaderboard*) yang mengurutkan akumulasi total EXP siswa dari yang tertinggi ke terendah.

#### 3.2.5 Pasar Kerja & Sistem Escrow ZIP
*   **REQ-F-ESC-001**: Sistem harus memasilitasi siswa/admin memposting lowongan quest dengan batas nominal anggaran minimal-maksimal dan tanggal tenggat waktu.
*   **REQ-F-ESC-002**: Sistem harus mengunci saldo anggaran reward quest saat pembuat quest menunjuk pekerja terpilih (`acceptBid`) dan mengubah status quest menjadi `ongoing`.
*   **REQ-F-ESC-003**: Sistem harus mewajibkan pekerja mengirimkan tautan demonstrasi fungsional (demo link) terlebih dahulu untuk dinilai kelayakan kerjanya sebelum dapat mengunggah kode sumber final.
*   **REQ-F-ESC-004**: Sistem harus mewajibkan pembuat quest memberikan penilaian ulasan bintang (1-5) dan ulasan tertulis terhadap kelayakan demo pekerja, yang akan mengubah status quest menjadi `approved`.
*   **REQ-F-ESC-005**: Sistem harus mendeteksi bahwa berkas pengumpulan proyek final wajib berupa kompresi berkas berekstensi `.zip` dengan status *locked* (tidak dapat diubah setelah terunggah).
*   **REQ-F-ESC-006**: Sistem harus mencairkan dana koin/emas RPG dan mendistribusikan EXP serta ERP ke status profil pekerja segera setelah berkas ZIP proyek final berhasil diunggah secara penuh (status `completed`).
*   **REQ-F-ESC-007**: Sistem harus menyediakan panel chat room persisten otomatis antara pekerja aktif dengan pembuat quest untuk koordinasi pengerjaan.
*   **REQ-F-ESC-008**: Sistem harus mewajibkan setiap quest baru yang dibuat masuk ke status `draft` untuk ditinjau, disetujui, atau ditolak oleh Administrator sebelum dapat diakses publik.

#### 3.2.6 Forum Diskusi Sosial
*   **REQ-F-FRM-001**: Sistem harus menyediakan forum diskusi terisolasi per mata kuliah bagi siswa untuk berinteraksi.
*   **REQ-F-FRM-002**: Sistem harus memungkinkan pengguna menyematkan pesan penting (*pin message*) di bagian atas daftar obrolan forum.
*   **REQ-F-FRM-003**: Sistem harus memungkinkan pengguna menambahkan atau menghapus reaksi emotikon (emojis) pada kiriman pesan forum.

### 3.3 Kebutuhan Non-Fungsional (Non-Functional Requirements - NFR)

#### 3.3.1 Kebutuhan Performa (Performance)
*   **NFR-P-001**: Sistem harus membatasi ukuran berkas ZIP penyerahan tugas final maksimal sebesar **50 Megabytes (MB)**.
*   **NFR-P-002**: Sistem harus menerapkan *Upload Timeout* maksimal 120 detik untuk mencegah kemacetan server jika kecepatan internet pengunggah lambat.
*   **NFR-P-003**: Waktu respon server untuk memuat halaman Papan Quest (Quest Board) tidak boleh melebihi latensi **2 detik** dalam kondisi beban puncak operasional.

#### 3.3.2 Kebutuhan Keamanan (Security)
*   **NFR-S-001**: Sistem harus mengunci akun pengguna (Account Lockout Policy) selama 15 menit setelah terjadi kegagalan login sebanyak 5 kali berturut-turut.
*   **NFR-S-002**: Sistem harus mengenkripsi seluruh data sensitif di database, termasuk kunci pemulihan 2FA (*recovery codes*) menggunakan standar enkripsi AES-256-CBC.
*   **NFR-S-003**: Sistem harus mematuhi regulasi privasi data lokal dengan mewajibkan penghapusan dokumen log chat quest secara permanen jika akun pengguna ditutup secara resmi.

---

## 4. KAMUS DATA BISNIS LOGIS (LOGICAL BUSINESS DATA DICTIONARY)

Kamus data logis di bawah menyajikan definisi konseptual entitas tanpa membatasi implementasi tipe data sintaks database fisik:

### 4.1 Entitas: Pengguna (User)
*   **Nama Tampilan**: Pengguna sistem.
*   **Deskripsi**: Informasi dasar identitas aktor platform.
*   **Atribut Logis**:
    *   `ID Pengguna`: String alfanumerik unik pengenal pengguna.
    *   `Nama Lengkap`: Teks huruf alfabet nama resmi pengguna.
    *   `Email`: Format alamat email valid (e.g. user@domain.com).
    *   `Peran`: Kategori akses terbatas (`Siswa`, `Mentor`, atau `Administrator`).

### 4.2 Entitas: Kemajuan RPG (RPG Progress)
*   **Nama Tampilan**: Progres & Statistik Karakter Siswa.
*   **Deskripsi**: Status gamifikasi RPG yang melekat pada karakter siswa.
*   **Atribut Logis**:
    *   `Tingkat Level`: Bilangan bulat positif penanda level (rentang: 1 - 100).
    *   `Poin EXP`: Akumulasi angka kemajuan akademik (rentang: >= 0, unit: Poin).
    *   ` RPG Gold`: Saldo mata uang virtual game untuk belanja aset RPG (rentang: >= 0, unit: Koin Gold).
    *   `Poin ERP`: Skor indeks kesiapan industri kognitif (rentang: 0 - 100, unit: Poin).
    *   `Jalur Belajar Aktif`: Pengenal jalur belajar yang saat ini diikuti oleh siswa.

### 4.3 Entitas: Lowongan Pekerjaan (Quest)
*   **Nama Tampilan**: Lowongan Quest Freelance.
*   **Deskripsi**: Proyek freelance yang diposting oleh siswa atau admin.
*   **Atribut Logis**:
    *   `Judul Quest`: Nama ringkas proyek (panjang: 5 - 150 karakter).
    *   `Deskripsi Pekerjaan`: Deskripsi rincian spesifikasi tugas (panjang: >= 20 karakter).
    *   `Gaji Minimum`: Batas bawah upah koin yang ditawarkan (unit: Rupiah / Gold, rentang: >= 0).
    *   `Gaji Maksimum`: Batas atas upah koin yang ditawarkan (unit: Rupiah / Gold, rentang: >= Gaji Minimum).
    *   `Tenggat Waktu`: Tanggal batas akhir pengumpulan proyek (format: tanggal di masa depan).
    *   `Status Transaksi`: Tahapan siklus escrow (`Draft`, `Rejected`, `Open`, `Ongoing`, `Submitted`, `Approved`, `Completed`).

### 4.4 Entitas: Penawaran (Quest Bid)
*   **Nama Tampilan**: Proposal Penawaran Kerja.
*   **Deskripsi**: Pengajuan lamaran penawaran quest dari pelamar.
*   **Atribut Logis**:
    *   `Nominal Tawar`: Harga jasa yang diajukan oleh pelamar (unit: Rupiah, rentang: >= 0).
    *   `Tautan CV`: URL akses dokumen CV pelamar.
    *   `Tautan Portofolio`: URL akses galeri portofolio pelamar.
    *   `Pernyataan Proposal`: Teks ulasan taktis lamaran kerja pelamar.
    *   `Status Lamaran`: Kondisi lamaran (`Menunggu`, `Diterima`, atau `Ditolak`).

---

## 5. MATRIKS VERIFIKASI & KETERLACAKAN KEBUTUHAN (VERIFICATION & TRACEABILITY MATRIX)

Setiap kebutuhan fungsional (REQ) dan non-fungsional (NFR) diverifikasi menggunakan salah satu dari 4 metode pengujian standar berikut:
*   **Testing (T)**: Pengujian otomatis menggunakan skrip pengujian (unit/feature tests).
*   **Demonstration (D)**: Demonstrasi interaksi UI/UX secara visual di layar.
*   **Analysis (A)**: Analisis log atau formula matematis (misal: verifikasi level RPG).
*   **Inspection (I)**: Inspeksi konfigurasi file, kode gaya pemrograman, atau izin akses berkas.

| Req ID | Deskripsi Kebutuhan | Metode Verifikasi | Kode Pengujian Otomatis (tests/Feature/) |
| :--- | :--- | :--- | :--- |
| **REQ-F-AUT-003** | Login Biometrik Passkeys (WebAuthn) | `D`, `I` | Verifikasi manual antarmuka biometrik di browser. |
| **REQ-F-LMS-002** | Penguncian Roadmap Modul Prasyarat | `T`, `D` | `QuestTest.php` (Has character & modules check). |
| **REQ-F-EVL-003** | Pencatatan Akurasi Skor Kuis MCQ | `T` | `QuestTest.php` (Quiz submit & score test). |
| **REQ-F-RPG-002** | Rumus Kenaikan Level RPG Dinamis | `T`, `A` | `UserStat.php` (Getter method verification). |
| **REQ-F-ESC-004** | Ulasan Rating & Persetujuan Escrow | `T`, `D` | `QuestSubmissionTest.php::two step approval`. |
| **REQ-F-ESC-005** | Validasi Kompresi ZIP Tugas Final | `T` | `QuestSubmissionTest.php::zip format constraint`. |
| **REQ-F-ESC-006** | Pencairan Rewards Escrow & ZIP | `T` | `QuestSubmissionTest.php::payout on zip success`. |
| **NFR-P-001** | Batasan Ukuran ZIP Maksimal 50MB | `T`, `I` | `QuestSubmissionTest.php` (File size validation check). |
| **NFR-S-001** | Kunci Akun 15 Menit Gagal Login 5x | `T` | `AuthLockoutTest.php` (Lockout verification). |

---

## 6. PENUTUP & PEMELIHARAAN DOKUMEN
Dokumen Master SRS ini menjadi panduan absolut dalam pengembangan sistem SkillMongo. Setiap penambahan fitur baru harus memperbarui dokumen spesifikasi ini terlebih dahulu untuk menjaga konsistensi arsitektur dan penjaminan kualitas produk secara berkelanjutan.
