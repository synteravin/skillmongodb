# Daftar Tugas - Overhaul Layout Halaman Tambah Quest & Riwayat/Papan Quest Premium

- [x] Peningkatan Halaman Tambah Quest (`Student/Quests/Create.tsx`)
  - [x] Implementasikan tata letak 2-kolom responsif (`grid grid-cols-1 lg:grid-cols-12 gap-8`)
  - [x] Rancang kolom kiri (`lg:col-span-8`) untuk form data utama (Judul, Deskripsi)
  - [x] Rancang area uploader file & gambar premium dengan dashed drag-and-drop borders dan visual progress feedback
  - [x] Rancang kolom kanan (`lg:col-span-4`) untuk sidebar budget, deadline, dan summary
  - [x] Tambahkan widget RPG Rewards Estimator dinamis yang beradaptasi dengan budget/gaji input
  - [x] Terapkan desain form control glassmorphic yang nyaman di dark & light mode

- [x] Peningkatan Papan & Riwayat Quest (`Student/Quests/Index.tsx`)
  - [x] Rancang ulang Quest Board Cards dengan interactive lift animation, border bercahaya, dan badge RPG rewards minimalis
  - [x] Bersihkan dan poles navigasi kembali ke Dashboard dengan micro-animations
  - [x] Overhaul sidebar Riwayat Quest (History Drawer):
    - [x] Tambahkan filter peran instan ("Pembuat", "Pekerja", "Bidder")
    - [x] Desain ulang layout accordion riwayat dengan visual yang sangat bersih dan rapi
    - [x] Terapkan timeline tracker horizontal mini di dalam accordion
    - [x] Sempurnakan detail ulasan bintang, berkas unduhan ZIP, dan badge RPG rewards di riwayat

- [x] Peningkatan Keresponsifan Garis Stepper & Halaman Admin
  - [x] Rancang ulang QuestStepper dengan CSS Grid 6-kolom (`grid grid-cols-6`) agar lebar kolom selalu 100% konsisten, mencegah deviasi akibat teks label panjang.
  - [x] Posisi garis progress linear dihitung secara presisi dari titik tengah kolom pertama (8.33%) hingga kolom terakhir (91.67%).
  - [x] Integrasikan pratinjau bukti transfer gambar yang rapi di panel admin dan perbaiki dark/light mode obrolan chat.

- [x] Pengujian & Verifikasi
  - [x] Jalankan kompilasi `npm run build` untuk memvalidasi tidak ada error TypeScript/Vite
  - [x] Jalankan pengujian otomatis `php artisan test` untuk memastikan integritas

