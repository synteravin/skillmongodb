# Laporan Analisis Profesional Arsitektur & Kepatuhan SRS SkillMongo
**Perspektif: Enterprise Systems Architect & Senior Product Manager**

Laporan ini menyajikan analisis kritis menyeluruh terhadap spesifikasi sistem (**SRS**) dan implementasi teknis platform **SkillMongo** dari standar industri rekayasa perangkat lunak modern.

---

## 1. Evaluasi Arsitektur Data & Skalabilitas (MongoDB & Eloquent)

### Desain Skema Dokumen (NoSQL MongoDB)
Penggunaan MongoDB sebagai database utama di platform LMS Gamifikasi sangat tepat karena struktur datanya yang semi-terstruktur. Data progress belajar siswa (`user_stats`) yang menyimpan daftar modul selesai (`completed_modules`) dan sub-statistik jalur (`path_stats`) disimpan dalam bentuk *embedded arrays*.

*   **Keuntungan Industri**: 
    *   **Performa Baca Instan**: Tidak membutuhkan operasi `JOIN` SQL yang berat untuk memuat progress belajar siswa. Seluruh data RPG (EXP, Level, Gold, progress modul) dimuat dalam satu query dokumen tunggal.
    *   **Fleksibilitas Atribut Karakter**: Atribut RPG baru dapat ditambahkan tanpa perlu migrasi skema tabel (schema-less structure) yang berpotensi menyebabkan downtime.
*   **Risiko & Mitigasi Transaksional**:
    *   *Gencatan Keadaan Konsistensi (Consistency Gap)*: Pada alur penyelesaian quest (`submitFinalZip`), sistem melakukan pembaruan status quest sekaligus pendistribusikan reward (EXP/Gold/ERP) ke koleksi `user_stats`. 
    *   *Rekomendasi Industri*: Karena MongoDB secara bawaan adalah sistem non-relasional, penulisan multi-dokumen ini wajib menggunakan fitur **MongoDB Transactions** (`DB::transaction`) untuk memastikan kegagalan penulisan di salah satu dokumen memicu rollback otomatis, mencegah eksploitasi penggandaan koin (double-spending vulnerability).

---

## 2. Analisis Loop Gamifikasi (Gamification Engine & Octalysis)

Sistem gamifikasi SkillMongo memenuhi beberapa pilar utama dalam **Octalysis Framework** (Kerangka Desain Gamifikasi Kelas Dunia):

```
       OCTALYSIS PILLARS IN SKILLMONGO
       
    [1. Epic Meaning & Calling]  ──> Pemilihan Karakter Awal (Avatar & Kelas)
    [2. Development & Accomplish] ──> Roadmap Visual, Level-Up (EXP), Badges
    [3. Empowerment of Creativity]──> Bidding Penawaran & Kustomisasi Proposal
    [4. Ownership & Possession]   ──> Akumulasi RPG Gold & Koleksi Sertifikat
    [5. Social Influence]         ──> Leaderboard Peringkat & Forum Diskusi
```

*   **Development & Accomplishment (Drive 2)**: Visualisasi roadmap peta jalan kursus memberikan dorongan motivasi penyelesaian materi secara visual (*progress bar effect*). Kenaikan level dengan rumus dinamis fixed-threshold 500 EXP memberikan feedback pencapaian yang terprediksi.
*   **Empowerment of Creativity & Feedback (Drive 3)**: Alur Bidding Quest memicu siswa bertindak proaktif merumuskan strategi harga penawaran (`bid_amount`) dan proposal taktis.
*   **Social Influence & Relatedness (Drive 5)**: Leaderboard global memicu dorongan kompetitif yang sehat antar-siswa untuk mempertahankan keunggulan EXP mereka di sistem.

---

## 3. Evaluasi Keamanan Alur Escrow ZIP (Freelance Quest Board)

Alur verifikasi dua tahap pada pasar freelance merupakan inovasi proses bisnis yang sangat aman dari ancaman *payment default* (pekerja tidak dibayar) atau *low-quality delivery* (pekerja mengirim berkas kosong).

### Mekanisme Proteksi Escrow:
1.  **Penguncian Anggaran**: Saat pembuat quest menyetujui bid pelamar (`acceptBid`), anggaran quest dikunci di sistem (status `ongoing`).
2.  **Tahap Review Fungsional (Submitted)**: Pekerja hanya mengirimkan tautan demonstrasi (tautan demo aktif) dan catatan ulasan untuk diuji kelayakannya. Pekerja tidak diizinkan mengirim berkas sumber (source code) terlebih dahulu, mencegah pembuat quest mengambil kode lalu membatalkan pembayaran sepihak.
3.  **Rating & Feedback Lock (Approved)**: Setelah hasil uji kelayakan disetujui, pembuat quest mengisi penilaian ulasan bintang (1-5) dan rating kinerja. Status quest berubah menjadi `approved`, di mana sistem mengunci komitmen pembayaran.
4.  **ZIP Final Hand-off (Completed)**: Pekerja mengunggah berkas sumber proyek final dalam bentuk ZIP. Pengunggahan file ZIP memicu penutupan quest otomatis (`completed`) dan pencairan dana RPG secara waktu nyata.

---

## 4. Analisis State Machine & Edge Cases (Quest System)

Meskipun status transaksi quest telah terstruktur rapi, analisis sistem industri menemukan beberapa *Edge Cases* (kasus batas) yang belum tercover penuh dalam rancangan SRS saat ini:

### Matriks Analisis Kasus Batas:
| Skenario Kasus Batas | Dampak Sistem | Rekomendasi Mitigasi SRS |
| :--- | :--- | :--- |
| **Pekerja Tidak Aktif (Stale Worker)** | Quest terkunci pada status `ongoing` selamanya. Anggaran pembuat tertahan di sistem. | Tambahkan fitur **Quest Expiry / SLA Timeout**. Jika tenggat waktu terlewati 48 jam dan pekerja tidak mengumpulkan tugas awal, pembuat quest berhak melakukan pembatalan sepihak (*Cancel Quest*). |
| **Perselisihan Hasil (Disputes)** | Pekerja mengklaim hasil kerja sudah sesuai, namun Pembuat quest menolak berkali-kali tanpa dasar yang jelas. | Tambahkan peran **Admin Moderator Mediator**. Jika terjadi penolakan revisi lebih dari 3 kali, tombol "Ajukan Banding" muncul bagi pekerja untuk menunjuk Admin sebagai penengah. |
| **Bids Tanpa Batas Waktu** | Siswa mengajukan bid dan proposal tetap melayang aktif meskipun quest telah ditutup. | Tambahkan fitur kadaluarsa bid otomatis (*auto-archive pending bids*) saat quest berganti status ke `ongoing`. |

---

## 5. Kesimpulan & Rekomendasi Optimasi Skala Industri

Sistem **SkillMongo** memiliki dasar SRS yang sangat kuat dan siap untuk produksi skala menengah. Untuk meningkatkan skalabilitasnya ke standar *Enterprise Software*:

1.  **Database Indexing**: Wajib menambahkan indeks majemuk (compound indexes) pada koleksi MongoDB:
    *   `quests`: indeks pada `[status, creator_id]` untuk memperepat query filter board.
    *   `quest_messages`: indeks pada `[bid_id, created_at]` untuk optimalisasi performa chat panel.
2.  **Transactional Integrity**: Terapkan implementasi Laravel DB transaction fungsional pada relasi penambahan saldo/points dengan penutupan berkas ZIP quest.
3.  **Real-time Event Broadcasting**: Untuk meningkatkan kenyamanan obrolan (Quest Chat), integrasikan Laravel Reverb atau Pusher agar komunikasi antara pekerja dan pembuat terjadi secara real-time tanpa perlu pemuatan ulang manual (polling).
