# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Guru mata pelajaran IoT (Mr. Iqbal)** — mengelola 3 kelas (XI TJKT 1–3), 4 kelompok per kelas; membuat akun kelompok, memantau kelengkapan dokumentasi, memberi catatan, dan mencetak QR.
- **Siswa kelas XI (per kelompok)** — login dengan satu akun bersama per kelompok untuk mengunggah data proyek yang sudah disiapkan guru.
- **Pemindai QR (pengunjung utama portal publik)** — pengunjung pameran sekolah (orang tua, tamu, adik kelas) dan siswa kelompok lain yang saling melihat karya. Mereka memindai QR yang ditempel di miniatur prototype dengan HP.

## Product Purpose
Portal dokumentasi proyek miniatur prototype IoT "Saklar Lampu Otomatis". Setiap kelompok punya URL portal dan QR sendiri; scan QR → seluruh info proyek: nama kelompok, kelas, anggota + foto, slider foto & video, link akses remote modul, komponen, dan cara penggunaan. Sukses = pengunjung pameran langsung paham karya kelompok dari HP dalam hitungan detik, dan siswa bisa melengkapi datanya sendiri.

## Positioning
Satu QR yang tetap sama selamanya per kelompok — isi portal bisa diperbarui siswa kapan saja tanpa mencetak ulang QR; dikelola langsung oleh guru kelas, bukan platform umum.

## Operating Context
- QR dicetak, dilaminating, ditempel di miniatur; dipindai di ruang pameran/kelas dengan HP (mobile-first untuk portal publik).
- Guru memakai laptop (dashboard, cetak QR massal per kelas). Siswa memakai laptop atau HP untuk mengunggah foto/video.
- Server berjalan di laptop guru/server sekolah; QR memakai `NEXT_PUBLIC_APP_URL`.

## Capabilities and Constraints
- Next.js 16 (App Router, Cache Components), Prisma ORM 7 + PostgreSQL (adapter `pg`), upload lokal di `data/`.
- Login guru & siswa (akun per kelompok). Siswa hanya bisa mengubah kelompoknya.
- Media: foto (≤8 MB), video MP4/WEBM/MOV (≤80 MB), link YouTube.
- Bahasa antarmuka: Indonesia.

## Brand Commitments
- Nama: **IOT LAB** (IoT.Lab) · Kelas IoT · Mr. Iqbal.
- Biru harus tetap dominan.
- Arah visual dipatok pengguna lewat gambar referensi majalah "HARD LINES" (brutalisme editorial); lihat surface brief.

## Evidence on Hand
- Foto anggota & prototype saat ini placeholder (randomuser.me, Unsplash) dan video YouTube referensi — harus diganti foto/video asli siswa. Jangan mengarang testimoni, nilai, atau prestasi.

## Product Principles
1. Pengunjung paham karya kelompok dalam satu layar HP.
2. Karya siswa (foto, video, anggota) adalah bintangnya; antarmuka mendukung, bukan menyaingi.
3. Mengisi data harus mudah untuk siswa SMK — jelas apa yang kurang dan apa langkah berikutnya.
4. QR tidak pernah berubah; data boleh terus tumbuh.
