# Portal Proyek IoT — Saklar Lampu Otomatis

Portal untuk mendokumentasikan prototype IoT tiap kelompok. Setiap kelompok punya
halaman portal dan QR sendiri: tempel QR di miniatur, scan dengan HP, dan pengunjung
langsung melihat kelompok, anggota, galeri foto/video, akses remote modul, komponen,
serta cara penggunaan prototype.

Dibangun dengan Next.js 16 (App Router, Server Actions, Cache Components), shadcn/ui,
Tailwind CSS v4, Motion (Framer Motion), dan **Prisma ORM 7** dengan database SQLite
(lewat driver adapter libSQL).

## Menjalankan

Butuh **Node.js 22.13+** dan **bun** (seed data contoh dijalankan dengan bun).

```bash
bun install        # memasang paket + membuat Prisma Client (postinstall)
bun run setup      # membuat tabel database & mengisi data contoh
bun run dev
```

Buka http://localhost:3000. Database SQLite dibuat di `data/portal.db`.
`bun run setup` aman dijalankan ulang: data contoh hanya diisi bila database masih kosong.

### Akun contoh

| Peran | Username | Password |
| ----- | -------- | -------- |
| Guru  | `guru` | `guru123` |
| Siswa | `tjkt1-k1` … `tjkt3-k4` (kelas 1–3, kelompok 1–4) | `siswa123` |

> Segera ganti password guru (menu profil → *Ganti password*) dan reset password
> kelompok dari halaman *Kelola* sebelum dipakai di kelas.

### Supaya QR bisa di-scan dari HP

QR berisi alamat portal. Jika dibuka lewat `localhost`, HP tidak bisa mengaksesnya.
Salin `.env.example` menjadi `.env.local` lalu isi alamat yang bisa dijangkau HP:

```bash
NEXT_PUBLIC_APP_URL=http://192.168.1.10:3000   # IP laptop guru di Wi-Fi sekolah
```

Lalu jalankan ulang server. Untuk pemakaian sehari-hari gunakan mode production:

```bash
bun run build
bun run start
```

## Alur penggunaan

1. **Guru** login → buat kelas & kelompok (sekaligus akun login kelompok).
2. **Siswa** login dengan akun kelompok → isi *Info Proyek*, *Anggota* (+foto),
   *Galeri* (foto, video MP4, atau link YouTube), *Panduan* (komponen & langkah
   penggunaan), dan *Remote* (link Blynk/Arduino Cloud/Telegram/web server ESP).
3. Setiap kelompok otomatis punya portal `/p/<slug>` dan QR-nya. Unduh PNG atau cetak
   dari dashboard. Guru bisa mencetak QR semua kelompok per kelas di `/cetak`.
4. Guru memantau persentase kelengkapan dan memberi catatan/feedback per kelompok.

QR tidak berubah ketika data diperbarui, jadi aman dicetak lebih awal.

## Struktur singkat

```
app/(site)/            beranda + galeri, portal publik /p/[slug]
app/login/             login guru & siswa
app/guru/              dashboard guru, kelola kelompok
app/siswa/             dashboard siswa (editor data kelompok)
app/cetak/             halaman cetak QR (satuan & massal)
app/api/upload         unggah foto/video (dicek hak aksesnya)
app/api/files/[...]    menyajikan file unggahan (mendukung streaming video)
app/actions/           server actions (auth, guru, data kelompok)
components/editor/     editor data kelompok (dipakai siswa & guru)
prisma/schema.prisma   skema database (kelas, kelompok, akun, anggota, media)
prisma/seed.ts         pengisi data contoh (`prisma db seed`)
prisma.config.ts       konfigurasi Prisma CLI (lokasi skema, database, seed)
lib/db.ts              Prisma Client (satu instance per proses)
lib/data.ts            query baca untuk halaman
lib/generated/prisma/  Prisma Client hasil generate (tidak di-commit)
lib/                   sesi, akses, validasi, seed data contoh
```

## Database (Prisma)

Skema ada di `prisma/schema.prisma`. Lokasi database diatur lewat `DATABASE_URL`
(default `file:./data/portal.db`, relatif ke folder proyek). CLI Prisma membaca
`.env` / `.env.local` dengan aturan yang sama seperti Next.js.

| Perintah | Fungsi |
| -------- | ------ |
| `bun run setup` | Buat folder `data/`, sinkronkan tabel, isi data contoh bila kosong |
| `bun run db:push` | Terapkan perubahan `schema.prisma` ke database |
| `bun run db:seed` | Isi data contoh (dilewati bila sudah ada data) |
| `bun run db:studio` | Buka Prisma Studio untuk melihat/mengubah data di browser |
| `bunx prisma generate` | Buat ulang Prisma Client (otomatis saat `bun install`) |

Setelah mengubah `schema.prisma`, jalankan `bun run db:push` lalu jalankan ulang
server dev.

## Data & backup

Semua data ada di folder `data/` (`portal.db` + `uploads/` + `.session-secret`).
Backup cukup dengan menyalin folder ini saat server berhenti. Untuk mengulang dari
data contoh: hentikan server lalu `bun run reset-data` (menghapus `data/` lalu
menjalankan `setup`).

Foto contoh memakai gambar publik dari Unsplash & randomuser.me, dan video contoh
adalah video YouTube referensi — ganti dengan foto/video asli siswa lewat dashboard.
