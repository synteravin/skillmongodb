# Dokumentasi UML, ERD, & Sequence Diagram Sistem SkillMongo

Diagram-diagram di bawah menyajikan pemodelan visual lengkap untuk **SkillMongo**, termasuk Entity-Relationship Diagram (ERD), Use Case Diagram, Class Diagram, dan Sequence Diagram alur bisnis krusial.

---

## 1. Entity-Relationship Diagram (ERD)

Diagram di bawah menunjukkan hubungan antara koleksi MongoDB (diperlakukan sebagai entitas relasional melalui Eloquent ORM).

```mermaid
erDiagram
    USERS ||--|| USER_STATS : "has stats"
    USERS ||--|| CHARACTERS : "has character template"
    USERS ||--o{ STUDENT_SUBMISSIONS : "submits tasks"
    USERS ||--o{ QUESTS : "creates quests"
    USERS ||--o{ QUEST_BIDS : "places bids"
    USERS ||--o{ FORUM_MESSAGES : "posts messages"
    
    COURSES ||--o{ CAREER_GROUPS : "contains groups"
    COURSES ||--o{ FORUM_MESSAGES : "hosts forum"
    
    CAREER_GROUPS ||--o{ PATHS : "contains paths"
    CAREER_GROUPS ||--o{ MENTOR_CAREER_GROUPS : "has assigned mentors"
    
    PATHS ||--o{ MODULES : "contains modules"
    PATHS ||--o{ SUBMISSIONS : "defines tasks"
    PATHS ||--|| QUIZZES : "has final quiz"
    
    MODULES ||--o{ MODULE_CONTENTS : "has contents"
    
    QUIZZES ||--o{ QUIZ_QUESTIONS : "has questions"
    QUIZ_QUESTIONS ||--o{ QUIZ_ANSWERS : "has options"
    QUIZZES ||--o{ QUIZ_RESULTS : "tracks scores"
    
    SUBMISSIONS ||--o{ STUDENT_SUBMISSIONS : "receives uploads"
    
    QUESTS ||--o{ QUEST_BIDS : "has bids"
    QUESTS ||--o{ QUEST_MESSAGES : "has chat history"
    QUEST_BIDS ||--|| USERS : "placed by student"
```

---

## 2. Use Case Diagram

Diagram ini mendefinisikan hak aksi (Use Cases) untuk masing-masing tipe aktor (Student, Mentor, Admin) di dalam ekosistem platform.

```mermaid
graph TB
    subgraph Aktor Utama
        S["Siswa (Student)"]
        M["Mentor"]
        A["Admin"]
    end

    subgraph Modul Autentikasi & RPG
        UC_SelectChar["Pilih Karakter Awal"]
        UC_Auth["Login / Registrasi / 2FA"]
    end

    subgraph Modul LMS & Belajar
        UC_ViewRoadmap["Lihat Peta Belajar / Roadmap"]
        UC_CompleteModule["Selesaikan Modul Konten"]
        UC_SubmitQuiz["Kerjakan Kuis MCQ"]
        UC_SubmitTask["Kirim Tugas Proyek"]
    end

    subgraph Modul Freelance Quest
        UC_PostQuest["Posting Quest Baru (Draft)"]
        UC_BidQuest["Bidding Quest (Kirim Proposal)"]
        UC_ChatQuest["Chat Koordinasi Pekerjaan"]
        UC_SubmitFinalZIP["Kirim ZIP Proyek Final"]
        UC_ApproveWork["Approve Hasil & Rilis Rewards"]
    end

    subgraph Modul Kurasi & Moderasi
        UC_ManageCourse["Kelola Kursus & Peta Belajar"]
        UC_GradeTask["Koreksi & Grade Tugas Siswa"]
        UC_ModQuest["Moderasi Post Quest (Approve/Reject)"]
        UC_ManageUsers["Kelola Pengguna & Hak Akses"]
    end

    S --> UC_Auth
    S --> UC_SelectChar
    S --> UC_ViewRoadmap
    S --> UC_CompleteModule
    S --> UC_SubmitQuiz
    S --> UC_SubmitTask
    S --> UC_PostQuest
    S --> UC_BidQuest
    S --> UC_ChatQuest
    S --> UC_SubmitFinalZIP

    M --> UC_Auth
    M --> UC_GradeTask
    M --> UC_ManageCourse

    A --> UC_Auth
    A --> UC_ModQuest
    A --> UC_ManageUsers
    A --> UC_ManageCourse
    A --> UC_ApproveWork
```

---

## 3. Sequence Diagrams (Alur Bisnis Utama)

### A. Alur Siklus Escrow ZIP & Pembayaran Quest
Diagram ini mendemonstrasikan proses sejak penunjukan pekerja, pengerjaan, persetujuan awal (rating), pengunggahan ZIP final, hingga rilis koin RPG ke statistik pekerja.

```mermaid
sequenceDiagram
    autonumber
    actor SiswaPekerja as Pekerja (Siswa)
    actor SiswaPembuat as Pembuat Quest (Siswa)
    participant QC as QuestController
    participant DB as Database (MongoDB)
    participant US as UserStat (Pekerja)

    SiswaPembuat->>QC: acceptBid(questId, bidId)
    QC->>DB: Update Quest (status = 'ongoing', worker_id = StudentID)
    DB-->>QC: Sukses
    QC-->>SiswaPembuat: Quest Berjalan (Ongoing)
    
    Note over SiswaPekerja, SiswaPembuat: Tahap Pengerjaan & Diskusi via Chat
    
    SiswaPekerja->>QC: submitWork(questId, submissionLink, note)
    QC->>DB: Simpan Link & Ulasan (status = 'submitted')
    DB-->>QC: Sukses
    QC-->>SiswaPekerja: Tugas Terkirim
    
    SiswaPembuat->>QC: approveWork(questId, rating, comment)
    QC->>DB: Simpan Rating & Persetujuan Awal (status = 'approved')
    DB-->>QC: Sukses
    QC-->>SiswaPembuat: Ulasan Terkirim, Status 'approved'
    
    SiswaPekerja->>QC: submitFinalZIP(questId, zipFile)
    QC->>DB: Unggah File ZIP Final (status = 'completed')
    QC->>US: Distribusikan EXP, Gold, & ERP
    US->>DB: Simpan Statistik Baru (Stat Update)
    DB-->>QC: Sukses
    QC-->>SiswaPekerja: Quest Selesai, Rewards Diterima
```

### B. Alur Pengiriman & Moderasi Quest Baru oleh Admin
Diagram ini memetakan proses verifikasi quest sebelum dipublikasikan ke Papan Lowongan publik.

```mermaid
sequenceDiagram
    autonumber
    actor Siswa as Pembuat Quest (Siswa)
    participant QC as QuestController (Student)
    actor Admin as Admin (Moderator)
    participant AQC as QuestController (Admin)
    participant DB as Database (MongoDB)

    Siswa->>QC: store(title, description, budget, deadline)
    QC->>DB: Simpan Quest (status = 'draft')
    DB-->>QC: Sukses
    QC-->>Siswa: Quest Dikirim, Menunggu Moderasi

    Note over Admin: Admin memeriksa daftar draft quest di Dashboard
    
    alt Kasus A: Quest Disetujui
        Admin->>AQC: approvePost(questId)
        AQC->>DB: Update Quest (status = 'open')
        DB-->>AQC: Sukses
        AQC-->>Admin: Quest Ditayangkan Publik
    else Kasus B: Quest Ditolak
        Admin->>AQC: rejectPost(questId, rejectionNote)
        AQC->>DB: Update Quest (status = 'rejected', rejection_note)
        DB-->>AQC: Sukses
        AQC-->>Admin: Notifikasi Penolakan Tersimpan
    end
```

### C. Alur Kuis Kognitif & Level-Up Karakter RPG
Diagram ini memetakan proses ketika Siswa menyelesaikan kuis di LMS dan mendapatkan akumulasi EXP yang memicu Level-Up secara dinamis.

```mermaid
sequenceDiagram
    autonumber
    actor Siswa as Siswa (Player)
    participant QuizC as QuizController
    participant UserStat as UserStat (Model)
    participant DB as Database (MongoDB)

    Siswa->>QuizC: submit(quizId, answers[])
    QuizC->>DB: Periksa Kunci Jawaban
    DB-->>QuizC: Hitung Nilai Kelulusan
    
    alt Nilai Lulus (Passing Grade Tercapai)
        QuizC->>DB: Ambil UserStat Aktif
        DB-->>QuizC: UserStat data (Level 1, EXP 450)
        QuizC->>UserStat: Tambah +100 EXP & Poin ERP
        
        Note over UserStat: Rumus Level-Up dipicu dinamis:<br/>floor((450 + 100) / 500) + 1 = Level 2
        
        UserStat->>DB: Simpan Data Baru (Level = 2, EXP = 550)
        DB-->>QuizC: Sukses
        QuizC-->>Siswa: Nilai Kuis (Lulus), Naik ke Level 2!
    else Nilai Gagal
        QuizC-->>Siswa: Nilai Kuis (Gagal), Silakan Coba Lagi
    end
```

---

## 4. Class Diagram (UML)

Diagram kelas ini menyajikan hubungan antara pengontrol utama (Controllers) dengan model-model data inti di backend.

```mermaid
classDiagram
    class User {
        +string _id
        +string name
        +string email
        +string role
        +userStat() Relation
        +quests() Relation
    }
    
    class UserStat {
        +string _id
        +string user_id
        +int level
        +int exp
        +int gold
        +int erp
        +getTotalExpAttribute() int
        +getCurrentLevelAttribute() int
    }
    
    class Quest {
        +string _id
        +string title
        +string status
        +double min_salary
        +double max_salary
        +creator() Relation
        +worker() Relation
        +bids() Relation
    }
    
    class QuestBid {
        +string _id
        +string quest_id
        +string student_id
        +double bid_amount
        +string status
        +student() Relation
    }
    
    class Course {
        +string _id
        +string title
        +string status
        +careerGroups() Relation
    }
    
    class Path {
        +string _id
        +string career_group_id
        +string title
        +modules() Relation
        +quiz() Relation
    }

    User "1" -- "1" UserStat : "has"
    User "1" -- "many" Quest : "creates / works on"
    Quest "1" -- "many" QuestBid : "receives"
    QuestBid "many" -- "1" User : "submitted by"
    Course "1" -- "many" Path : "maps to learning paths"
```

---

## 5. Ringkasan Desain Sistem

Seluruh diagram UML dan ERD di atas memetakan dengan tepat struktur database NoSQL MongoDB yang diimplementasikan melalui model relasional Eloquent di Laravel. Dengan pemodelan status quest dan kalkulator kenaikan level dinamis, integritas data sistem SkillMongo dipastikan solid dan terstruktur dengan rapi untuk kemudahan pemeliharaan jangka panjang.
