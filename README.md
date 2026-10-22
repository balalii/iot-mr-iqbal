# Portal Proyek IoT — Saklar Lampu Otomatis

Portal untuk mendokumentasikan prototype IoT tiap kelompok. Setiap kelompok punya
halaman portal dan QR sendiri: tempel QR di miniatur, scan dengan HP, dan pengunjung
langsung melihat kelompok, anggota, galeri foto/video, akses remote modul, komponen,
serta cara penggunaan prototype.

Dibangun dengan Next.js 16 (App Router, Server Actions, Cache Components), shadcn/ui,
Tailwind CSS v4, Motion (Framer Motion), dan **Prisma ORM 7** dengan database PostgreSQL
(lewat driver adapter `pg`).

## Menjalankan

Butuh **Node.js 22.13+**, **bun** (seed data contoh dijalankan dengan bun), dan
PostgreSQL.

1. Pasang paket (sekaligus membuat Prisma Client lewat postinstall):

   ```bash
   bun install
   ```

2. Siapkan PostgreSQL. Paling cepat tanpa Docker:

   ```bash
   bunx prisma dev --name iot --detach
   ```

   Lalu buat `.env.local` dari `.env.example` dan isi `DATABASE_URL` dengan URL
   `postgres://…` yang dicetak perintah di atas (atau Postgres lokal lain).

3. Jalankan migrasi & isi data contoh, lalu jalankan app:

   ```bash
   bun run setup
   bun run dev
   ```

Buka http://localhost:3000. `bun run setup` aman dijalankan ulang: data contoh hanya
diisi bila database masih kosong.

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
instrumentation.ts     buat akun guru pertama saat server production start
lib/db.ts              Prisma Client (satu instance per proses)
lib/data.ts            query baca untuk halaman
lib/generated/prisma/  Prisma Client hasil generate (tidak di-commit)
lib/                   sesi, akses, validasi, seed data contoh
```

## Database (Prisma)

Skema ada di `prisma/schema.prisma`, migrasi di `prisma/migrations/`. Koneksi diatur
lewat `DATABASE_URL`. CLI Prisma membaca `.env` / `.env.local` dengan aturan yang sama
seperti Next.js.

| Perintah | Fungsi |
| -------- | ------ |
| `bun run setup` | Jalankan migrasi yang belum diterapkan, isi data contoh bila kosong |
| `bun run db:migrate` | Buat migrasi baru dari perubahan `schema.prisma` lalu terapkan |
| `bun run db:seed` | Isi data contoh (dilewati bila sudah ada data) |
| `bun run db:studio` | Buka Prisma Studio untuk melihat/mengubah data di browser |
| `bunx prisma generate` | Buat ulang Prisma Client (otomatis saat `bun install`) |

Setelah mengubah `schema.prisma`, jalankan `bun run db:migrate -- --name <nama>` dan
commit folder migrasinya: deploy menerapkannya dengan `prisma migrate deploy`.

## Media (Cloudflare R2)

Foto & video unggahan dikirim ke `/api/upload` (cek hak akses, jenis, dan ukuran), lalu
disimpan di Cloudflare R2 bila `R2_*` diisi, di bawah `uploads/g<idKelompok>/`. Database
menyimpan URL publiknya (`R2_PUBLIC_URL/uploads/...`), jadi foto & video dibuka langsung
dari R2, bukan lewat server ini. Tanpa `R2_*` (mis. saat development), file disimpan di
`data/uploads/` dan disajikan lewat `/api/files`.

Menyiapkan R2, sekali saja:

1. Buat bucket, lalu aktifkan akses publik lewat custom domain (mis. `media.example.com`)
   atau `r2.dev`. Alamat itu menjadi `R2_PUBLIC_URL`.
2. *Manage API tokens* → token dengan izin **Object Read & Write** untuk bucket itu.
   Access Key ID dan Secret Access Key-nya menjadi `R2_ACCESS_KEY_ID` dan
   `R2_SECRET_ACCESS_KEY`; Account ID ada di halaman R2.

Mengganti atau menghapus media hanya mengubah database; file lamanya tetap ada di bucket.

## Data & backup

Data ada di database Postgres, bucket R2, dan folder `data/` (`.session-secret`, plus
`uploads/` bila R2 tidak dipakai). Untuk mengulang dari data contoh: hentikan server lalu
`bun run reset-data` (menghapus `data/`, mengosongkan database, lalu mengisi data contoh).

Foto contoh memakai gambar publik dari Unsplash & randomuser.me, dan video contoh
adalah video YouTube referensi — ganti dengan foto/video asli siswa lewat dashboard.
