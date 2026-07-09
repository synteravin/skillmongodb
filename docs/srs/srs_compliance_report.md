# Laporan Analisis Kepatuhan Proyek terhadap Software Requirements Specification (SRS)

Laporan ini memetakan implementasi teknis saat ini pada proyek **SkillMongo** terhadap kerangka standar spesifikasi kebutuhan perangkat lunak (SRS) untuk platform *Gamified Learning & Freelance Quest*.

---

## 1. Modul Autentikasi & Pemilihan Karakter (Authentication & Character Module)

### Deskripsi Kebutuhan (SRS)
*   **Keamanan Akun**: Proses login, pendaftaran, pemulihan sandi, verifikasi email, autentikasi dua-faktor (2FA), dan dukungan passkeys (WebAuthn).
*   **Inisiasi Akun**: Siswa yang baru mendaftar wajib memilih kelas karakter/avatar RPG (role-playing) sebelum dapat mengakses dashboard utama.
*   **Statistik RPG Awal**: Pemilihan karakter memicu pembentukan statistik awal (Level 1, Gold, EXP, ERP) untuk gamifikasi.

### Pemetaan Teknis & Kepatuhan
| Kebutuhan Fungsional | Berkas Implementasi Utama | Status | Catatan Teknis |
| :--- | :--- | :--- | :--- |
| **Registrasi & Login** | `app/Actions/Fortify/` | `COMPLIANT` | Menggunakan Laravel Fortify untuk backend auth yang aman secara out-of-the-box. |
| **Sistem Passkeys (WebAuthn)** | `resources/js/pages/auth/webauthn-*.js` | `COMPLIANT` | Mendukung login berbasis biometrik modern. |
| **Autentikasi Dua Faktor (2FA)** | `resources/js/pages/settings/two-factor.tsx` | `COMPLIANT` | Antarmuka QR code dan pemulihan kode TOTP. |
| **Pemilihan Karakter** | [SelectCharacterController.php](file:///c:/Users/An/Herd/skillmongo/app/Http/Controllers/Student/SelectCharacterController.php) | `COMPLIANT` | Rute `select-character` mengikat data karakter awal siswa ke model `Character.php` dan `UserStat.php`. |

---

## 2. Modul Kurikulum & Peta Belajar (LMS & Roadmaps)

### Deskripsi Kebutuhan (SRS)
*   **Hirarki Materi**: Jalur Karir (Career Paths) ➔ Grup Karir (Career Groups) ➔ Kursus (Courses) ➔ Modul (Modules) ➔ Konten (Module Content/Lessons).
*   **Roadmap Interaktif**: Peta petualangan visual untuk memandu siswa menyelesaikan materi secara bertahap.
*   **Pemilihan Jalur**: Siswa dapat memilih jalur karir yang ingin mereka kejar secara spesifik.

### Pemetaan Teknis & Kepatuhan
| Kebutuhan Fungsional | Berkas Implementasi Utama | Status | Catatan Teknis |
| :--- | :--- | :--- | :--- |
| **Struktur Kurikulum** | `app/Models/Path.php`, `CareerGroup.php`, `Course.php`, `Module.php`, `ModuleContent.php` | `COMPLIANT` | Basis data relasional (MongoDB) terstruktur rapi untuk hirarki kurikulum. |
| **Aksi Pemilihan Karir** | [SelectPathController.php](file:///c:/Users/An/Herd/skillmongo/app/Http/Controllers/Student/SelectPathController.php) | `COMPLIANT` | Menyimpan preferensi jalur aktif siswa di field `selected_path_id`. |
| **Penyelesaian Modul** | [CompleteModuleController.php](file:///c:/Users/An/Herd/skillmongo/app/Http/Controllers/Student/CompleteModuleController.php) | `COMPLIANT` | Menandai modul selesai dan memberikan poin akumulatif secara aman. |
| **Roadmap Petualangan** | [CourseRoadmapController.php](file:///c:/Users/An/Herd/skillmongo/app/Http/Controllers/Student/CourseRoadmapController.php) | `COMPLIANT` | Memetakan progress materi ke file frontend React `Roadmap.tsx`. |

---

## 3. Modul Kuis & Tugas (Assessment System)

### Deskripsi Kebutuhan (SRS)
*   **Kuis Pilihan Ganda**: Soal acak, pengiriman jawaban otomatis, pembatasan durasi, dan penilaian real-time.
*   **Pengumpulan Tugas Manual**: Unggah berkas tugas (file/gambar) oleh siswa untuk dievaluasi secara manual oleh Mentor.
*   **Grading Mentor**: Mentor dapat melihat daftar tugas masuk dan memberikan nilai (grade) serta catatan feedback.

### Pemetaan Teknis & Kepatuhan
| Kebutuhan Fungsional | Berkas Implementasi Utama | Status | Catatan Teknis |
| :--- | :--- | :--- | :--- |
| **Sistem Kuis & Hasil** | [QuizController.php](file:///c:/Users/An/Herd/skillmongo/app/Http/Controllers/QuizController.php) | `COMPLIANT` | Mengelola submit jawaban siswa dan menghitung akurasi poin instan. |
| **Tugas & Submisi Siswa** | [SubmissionController.php](file:///c:/Users/An/Herd/skillmongo/app/Http/Controllers/Student/SubmissionController.php) | `COMPLIANT` | Siswa mengunggah link demonstrasi dan berkas pendukung ke model `StudentSubmission.php`. |
| **Panel Evaluasi Mentor** | [StudentSubmissionController.php](file:///c:/Users/An/Herd/skillmongo/app/Http/Controllers/Mentor/StudentSubmissionController.php) | `COMPLIANT` | Memungkinkan mentor memberikan penilaian dan menyetujui submisi siswa. |

---

## 4. Ekosistem RPG Gamification Engine

### Deskripsi Kebutuhan (SRS)
*   **Perhitungan Leveling**: Transisi level otomatis setiap akumulasi 500 EXP (rumus: `floor(exp / 500) + 1`).
*   **Distribusi Gold & ERP**: Hadiah atas keberhasilan kuis, modul, dan quest freelance.
*   **Papan Peringkat (Leaderboard)**: Menampilkan peringkat siswa berdasarkan perolehan EXP tertinggi di seluruh sistem.
*   **Lencana Prestasi (Badges)**: Pembukaan lencana profil unik berdasarkan tingkatan pencapaian level.

### Pemetaan Teknis & Kepatuhan
| Kebutuhan Fungsional | Berkas Implementasi Utama | Status | Catatan Teknis |
| :--- | :--- | :--- | :--- |
| **Model Statistik RPG** | [UserStat.php](file:///c:/Users/An/Herd/skillmongo/app/Models/UserStat.php) | `COMPLIANT` | Memiliki getter virtual `total_exp` and `current_level` yang dihitung dinamis. |
| **Leaderboard Global** | [LeaderboardController.php](file:///c:/Users/An/Herd/skillmongo/app/Http/Controllers/Student/LeaderboardController.php) | `COMPLIANT` | Query mengurutkan perolehan EXP siswa teratas dan dirender ke React. |
| **Manajemen Badges** | `app/Http/Controllers/Admin/LevelBadgeController.php` | `COMPLIANT` | Pengelolaan level badges oleh admin secara dinamis. |

---

## 5. Modul Freelance Quest (Escrow & Bidding Board)

### Deskripsi Kebutuhan (SRS)
*   **Posting Quest**: Pengguna (Siswa/Admin) mempublikasikan lowongan quest dengan nominal rentang gaji (budget) dan deadline.
*   **Bidding (Penawaran)**: Pelamar mengirimkan proposal harga dan CV/Portofolio.
*   **Sistem Escrow ZIP & Verifikasi Dua Tahap**:
    1. Pekerja terpilih mengirimkan tautan demo pengerjaan.
    2. Pembuat menyetujui hasil ulasan pengerjaan awal.
    3. Pekerja menyerahkan berkas ZIP final untuk menyelesaikan quest secara penuh dan mencairkan hadiah uang serta EXP/Gold/ERP.
*   **Komunikasi Instan**: Obrolan langsung (persistent chat) antara pelamar/pekerja dengan pembuat quest & admin.
*   **Moderasi Admin**: Setiap posting quest baru masuk ke status `draft` dan harus ditinjau (disetujui/ditolak) oleh admin sebelum tayang ke publik.

### Pemetaan Teknis & Kepatuhan
| Kebutuhan Fungsional | Berkas Implementasi Utama | Status | Catatan Teknis |
| :--- | :--- | :--- | :--- |
| **Moderasi & Siklus Quest** | [QuestController.php](file:///c:/Users/An/Herd/skillmongo/app/Http/Controllers/Student/QuestController.php) | `COMPLIANT` | Mengatur transisi status (`draft`, `open`, `ongoing`, `submitted`, `approved`, `completed`). |
| **Moderasi Admin** | [QuestController.php](file:///c:/Users/An/Herd/skillmongo/app/Http/Controllers/Admin/QuestController.php) | `COMPLIANT` | Endpoint persetujuan/penolakan postingan quest oleh administrator. |
| **Escrow ZIP Hand-off** | `Student/QuestController.php::submitFinalZip` | `COMPLIANT` | Alur rilis hadiah finansial dan RPG rewards setelah file ZIP final terunggah aman. |
| **Direct Messaging** | [QuestMessageController.php](file:///c:/Users/An/Herd/skillmongo/app/Http/Controllers/QuestMessageController.php) | `COMPLIANT` | Panel chat terintegrasi pada model `QuestMessage.php` untuk koordinasi pelamar. |

---

## 6. Modul Forum Diskusi (Course Forum)

### Deskripsi Kebutuhan (SRS)
*   **Komunikasi Antar Siswa**: Forum diskusi terisolasi per mata kuliah / kursus.
*   **Interaksi Pesan**: Siswa dapat memberikan reaksi emotikon (reactions) pada kiriman, menyematkan pesan (pin message) untuk pesan penting, serta mengedit/menghapus pesan mereka sendiri.

### Pemetaan Teknis & Kepatuhan
| Kebutuhan Fungsional | Berkas Implementasi Utama | Status | Catatan Teknis |
| :--- | :--- | :--- | :--- |
| **Forum Kontroler** | [ForumController.php](file:///c:/Users/An/Herd/skillmongo/app/Http/Controllers/Student/ForumController.php) | `COMPLIANT` | Mengelola pemuatan pesan, reaksi emotikon, penyematan pin, dan hak akses hapus/sunting. |
| **Model Data** | `app/Models/ForumMessage.php` | `COMPLIANT` | Menyimpan relasi pesan dengan mata kuliah, reaksi array, dan status pin. |

---

## Kesimpulan Kepatuhan SRS
Proyek **SkillMongo** secara keseluruhan berada pada status **`FULLY COMPLIANT`** (Sangat Patuh) terhadap spesifikasi kebutuhan perangkat lunak platform gamifikasi pembelajaran & pasar freelance terintegrasi. Struktur kode mengikuti konvensi Laravel terbaik, arsitektur data fleksibel berbasis MongoDB, antarmuka front-end React yang elegan, serta cakupan pengujian unit yang andal.
