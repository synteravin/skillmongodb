# Pusat Dokumentasi SRS & Arsitektur Sistem SkillMongo
*Lokasi Hub: docs/srs/README.md*

Selamat datang di **Pusat Dokumentasi Spesifikasi Kebutuhan Perangkat Lunak (SRS)** untuk proyek **SkillMongo**. Hub ini dirancang untuk memberikan pemahaman menyeluruh tentang bagaimana platform *Gamified LMS & Freelance Quest Board* ini dibangun, diuji, dan dipetakan sesuai standar industri internasional.

---

## 1. Navigasi Dokumentasi (Table of Contents)

Seluruh dokumentasi SRS dan perancangan sistem telah dipecah secara modular untuk kemudahan pemeliharaan:

*   📘 **[Master Spesifikasi Kebutuhan Perangkat Lunak (SRS Master)](file:///c:/Users/An/Herd/skillmongo/docs/srs/srs_master_specification.md)**
    *   *Deskripsi*: Dokumen resmi berstandar **IEEE Std 830-1998 / ISO 29148**. Mencakup batasan sistem, deskripsi fungsional fitur, kebutuhan non-fungsional (NFR), matriks keterlacakan kebutuhan (RTM), dan kriteria QA.
*   📊 **[Dokumentasi UML, ERD, & Sequence Diagrams](file:///c:/Users/An/Herd/skillmongo/docs/srs/srs_uml_diagrams.md)**
    *   *Deskripsi*: Pemodelan visual lengkap sistem. Mencakup ERD MongoDB NoSQL, Use Case Diagram peran pengguna, Class Diagram relasi objek backend, dan Sequence Diagram alur bisnis krusial (Escrow ZIP, Moderasi Quest, Level-Up RPG).
*   🔍 **[Analisis Arsitektur & Evaluasi Sistem Profesional](file:///c:/Users/An/Herd/skillmongo/docs/srs/srs_professional_analysis.md)**
    *   *Deskripsi*: Evaluasi kritis sistem dari perspektif arsitek sistem senior. Mencakup analisis loop gamifikasi *Octalysis Framework*, asesmen keamanan escrow freelance, dan penanganan kasus batas (*edge cases*).
*   🔌 **[Spesifikasi Kontrak API & Kamus Data MongoDB](file:///c:/Users/An/Herd/skillmongo/docs/srs/srs_api_and_database.md)**
    *   *Deskripsi*: Panduan teknis integrasi data. Mencakup kontrak masukan/keluaran endpoint API (JSON) dan kamus data struktur koleksi MongoDB untuk seluruh entitas sistem.
*   ✅ **[Laporan Kepatuhan & Pemetaan File Kode Sumber](file:///c:/Users/An/Herd/skillmongo/docs/srs/srs_compliance_report.md)**
    *   *Deskripsi*: Laporan kecocokan implementasi yang memetakan setiap fitur di SRS langsung ke baris file Controller, Model, dan Service yang ada di codebase proyek saat ini.

---

## 2. Struktur Modul Platform SkillMongo

Sistem ini mengintegrasikan 6 modul besar yang saling terhubung untuk menciptakan ekosistem pembelajaran gamifikasi yang adaptif:

```
                  ┌────────────────────────────────────────┐
                  │          SkillMongo Core App           │
                  └────┬───────┬───────┬───────┬───────┬───┘
                       │       │       │       │       │
      ┌────────────────┘       │       │       │       └──────────────┐
      ▼                        ▼       ▼       ▼                      ▼
[Autentikasi & RPG]      [LMS Engine] [Assess] [RPG Stats]     [Quest Escrow ZIP]
- Fortify Session        - Roadmaps   - Quizzes - EXP/Gold/ERP - Bidding & Chat
- Biometric Passkeys     - Modules    - Grading - Level-Up     - ZIP Hand-off
```

1.  **Modul Autentikasi & Karakter**: Gerbang masuk aman (2FA, Passkeys) dan setup avatar RPG awal untuk memicu dokumen status siswa.
2.  **Modul LMS (Learning Management System)**: Peta jalan visual (*Roadmap*) yang menuntun siswa menyelesaikan modul prasyarat secara bertahap.
3.  **Modul Kuis & Tugas**: Evaluasi kognitif melalui kuis pilihan ganda terhitung durasi dan tugas proyek manual yang dikoreksi mentor.
4.  **Modul RPG Gamification Engine**: Rumus kenaikan level otomatis (`floor(exp/500)+1`), papan peringkat global (Leaderboard), dan pembukaan lencana tingkatan (Level Badges).
5.  **Modul Freelance Quest (Escrow ZIP)**: Pasar freelance terproteksi. Gaji dikunci di sistem, pekerja mengirim demo kelayakan awal, pembuat memberikan ulasan bintang, dan dana dicairkan otomatis saat file ZIP final diunggah.
6.  **Modul Forum Diskusi**: Media komunikasi antarsiswa dan mentor terisolasi per kursus yang dilengkapi fitur reaksi emoji dan pin pesan penting.

---

## 3. Cara Membaca & Memperbarui Dokumen

Dokumentasi ini bersifat hidup (*living documents*) yang melekat langsung di dalam repositori kode sumber Anda. 
*   **Untuk Pengembang Baru**: Baca [Master SRS](file:///c:/Users/An/Herd/skillmongo/docs/srs/srs_master_specification.md) untuk memahami aturan bisnis, lalu periksa [Kamus Data](file:///c:/Users/An/Herd/skillmongo/docs/srs/srs_api_and_database.md) untuk memahami skema database sebelum menulis kode baru.
*   **Untuk Penjamin Mutu (QA)**: Periksa [Matriks Keterlacakan (RTM)](file:///c:/Users/An/Herd/skillmongo/docs/srs/srs_master_specification.md#7-matriks-keterlacakan-kebutuhan-requirements-traceability-matrix---rtm) untuk melihat file pengujian otomatis mana yang harus dijalankan saat fitur tertentu dimodifikasi.
