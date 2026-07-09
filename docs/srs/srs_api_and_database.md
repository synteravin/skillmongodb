# Kontrak API & Kamus Data Basis Data SkillMongo
*Lokasi Dokumen: docs/srs/srs_api_and_database.md*

Dokumen ini melengkapi Master SRS dengan menyajikan spesifikasi teknis **Kontrak API** (endpoints) dan **Kamus Data (Database Schema Dictionary)** untuk koleksi MongoDB yang digunakan dalam SkillMongo.

---

## 1. Spesifikasi Kontrak API Utama (API Endpoints)

Seluruh request dan response menggunakan format **JSON** (kecuali upload file yang menggunakan `multipart/form-data`).

### A. Modul Freelance Quest (Escrow & Bidding)

#### 1. Membuat Quest Baru
*   **Endpoint**: `POST /student/quests`
*   **Payload (multipart/form-data)**:
    ```json
    {
      "title": "string (min: 5)",
      "description": "string (min: 20)",
      "min_salary": "numeric (min: 0)",
      "max_salary": "numeric (>= min_salary)",
      "deadline": "date (Y-m-d, must be after today)",
      "images": "file[] (optional, max: 2MB per file)",
      "files": "file[] (optional, pdf/doc/docx/xls/xlsx/zip, max: 10MB per file)"
    }
    ```
*   **Response (302 Redirect / Inertia)**:
    Mengarahkan kembali ke `/student/quests` dengan flash session message `success` jika berhasil.

#### 2. Mengajukan Penawaran (Place Bid)
*   **Endpoint**: `POST /student/quests/{quest}/bid`
*   **Payload (application/json)**:
    ```json
    {
      "bid_amount": "numeric (required)",
      "cv": "string (url, required)",
      "portfolio": "string (url, required)",
      "proposal": "string (min: 10, required)"
    }
    ```

#### 3. Mengirimkan Pekerjaan Awal (Ulasan Kelayakan)
*   **Endpoint**: `POST /student/quests/{quest}/submit`
*   **Payload (application/json)**:
    ```json
    {
      "submission_link": "string (url, required)",
      "submission_note": "string (optional)"
    }
    ```

#### 4. Menyetujui Ulasan Pengerjaan Awal (Approve Work)
*   **Endpoint**: `POST /student/quests/{quest}/approve`
*   **Payload (application/json)**:
    ```json
    {
      "rating": "integer (1-5, required)",
      "rating_comment": "string (optional)"
    }
    ```

#### 5. Mengirimkan ZIP Final (Tutup Escrow & Cairkan Dana)
*   **Endpoint**: `POST /student/quests/{quest}/submit-final-zip`
*   **Payload (multipart/form-data)**:
    ```json
    {
      "submission_file": "file (zip required, max: 20MB)"
    }
    ```

---

### B. Modul Komunikasi (Quest & Forum Chat)

#### 1. Mengirim Pesan Chat Quest (Koordinasi Pelamar)
*   **Endpoint**: `POST /quests/bids/{bid}/messages`
*   **Payload (application/json)**:
    ```json
    {
      "message": "string (required)"
    }
    ```

#### 2. Mengirim Pesan Forum Kursus
*   **Endpoint**: `POST /student/forum/{course}/messages`
*   **Payload (application/json)**:
    ```json
    {
      "message": "string (required)"
    }
    ```

---

## 2. Kamus Data Koleksi MongoDB (Database Dictionary)

### A. Koleksi: `users`
Menyimpan informasi kredensial login dan profil otoritas pengguna.

| Field Name | Type | Key | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Identifier unik dokumen pengguna. |
| `name` | String | - | Nama lengkap pengguna. |
| `email` | String | Unique | Alamat email terverifikasi. |
| `password` | String | - | Hash sandi Bcrypt. |
| `role` | String | - | Peran user: `student`, `mentor`, atau `admin`. |
| `two_factor_secret` | String | - | Kode rahasia terenkripsi TOTP 2FA. |
| `two_factor_recovery_codes` | Array (String) | - | Kode cadangan pemulihan 2FA. |
| `remember_token` | String | - | Token session log-in tetap aktif. |

### B. Koleksi: `user_stats`
Menyimpan poin reputasi RPG dan progress petualangan belajar siswa.

| Field Name | Type | Key | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Identifier unik statistik pengguna. |
| `user_id` | String | Foreign Key | Kunci relasi ke koleksi `users`. |
| `selected_path_id`| String | Foreign Key | Kunci relasi ke sub-jalur belajar aktif (`paths`). |
| `level` | Integer | - | Tingkatan level saat ini (default: 1). |
| `exp` | Integer | - | Jumlah poin pengalaman (default: 0). |
| `gold` | Integer | - | Jumlah koin emas RPG (default: 0). |
| `erp` | Integer | - | Skor Enterprise Readiness Points (default: 0). |
| `completed_modules`| Array (String) | - | Daftar ID modul pelajaran yang telah diselesaikan. |
| `path_stats` | Object (JSON) | - | Statistik terperinci per-jalur karir (exp, gold, quiz_score). |

### C. Koleksi: `quests`
Mengelola transaksi lowongan pengerjaan proyek freelance berbasis escrow.

| Field Name | Type | Key | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Identifier unik quest. |
| `title` | String | - | Judul tugas pekerjaan. |
| `description` | String | - | Detail spesifikasi quest. |
| `min_salary` | Integer | - | Gaji minimum (dalam IDR). |
| `max_salary` | Integer | - | Gaji maksimum (dalam IDR). |
| `deadline` | Date | - | Batas waktu pengerjaan. |
| `status` | String | - | Siklus quest: `draft`, `rejected`, `open`, `ongoing`, `submitted`, `approved`, `completed`. |
| `creator_id` | String | Foreign Key | Pembuat quest (relasi ke `users`). |
| `worker_id` | String | Foreign Key | Pekerja terpilih (relasi ke `users`). |
| `rejection_note` | String | - | Catatan penolakan moderasi oleh admin. |
| `revision_note` | String | - | Catatan permintaan revisi oleh pembuat quest. |
| `submission_link` | String | - | Tautan demo pengerjaan awal dari pekerja. |
| `submission_file` | Object (JSON) | - | metadata file ZIP final (`name`, `path`, `size`). |

### D. Koleksi: `quest_bids`
Mengelola proposal lamaran pengerjaan quest dari siswa.

| Field Name | Type | Key | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Identifier unik penawaran bid. |
| `quest_id` | String | Foreign Key | Relasi ke koleksi `quests`. |
| `student_id` | String | Foreign Key | Relasi ke koleksi `users` (pelamar). |
| `bid_amount` | Double | - | Nominal harga penawaran pelamar. |
| `cv` | String | - | Tautan unduh CV pelamar. |
| `portfolio` | String | - | Tautan unduh portofolio kerja. |
| `proposal` | String | - | Deskripsi taktis ulasan lamaran. |
| `status` | String | - | Status lamaran: `pending`, `accepted`, atau `rejected`. |

---

## 3. Kesimpulan Kamus Data
Rancangan kamus data dan API contract di atas menjamin bahwa integrasi data antara database MongoDB NoSQL dan lapisan frontend React Inertia.js berjalan secara konsisten, aman, dan mematuhi skema validasi tipe data yang ketat.
