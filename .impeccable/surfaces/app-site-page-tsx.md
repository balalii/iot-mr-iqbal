---
version: 1
slug: "app-site-page-tsx"
primary_target: "app/(site)/page.tsx"
related_targets: ["app/(site)/p/[slug]/page.tsx","app/login/page.tsx","app/guru/page.tsx","app/siswa/page.tsx"]
---

# Surface brief — IoT Lab portal (beranda, portal kelompok, login, dashboard)

Scope: beranda `/` (Persuade), portal publik `/p/[slug]` (Experience, mobile-first, pemindai QR di pameran), login & dashboard guru/siswa (Operate) — satu dunia visual.
Audience: pengunjung pameran sekolah & siswa kelompok lain (portal/beranda); guru & siswa (dashboard).
Constraints: biru dominan; nama IOT LAB; simulasi lampu dihapus; arah visual dipatok pengguna lewat referensi majalah "HARD LINES".

## Direction contract

THESIS: Portal karya siswa sebagai majalah independen bertipe tegas — setiap kelompok adalah satu "edisi". Menolak dashboard SaaS bersudut bulat dan kartu pastel.

OWN-WORLD: Kertas krem #f1eee6, tinta hitam, garis 2.5px, sudut 0. Biru kobalt #1238e8 untuk sel aktif & panel; kuning asam #eef11a untuk panel aksen berbayangan keras 10px; merah #ef3a2f untuk CTA dan coretan spidol. Display Anton kapital kondensasi; label JetBrains Mono kapital berjarak lebar; isi Archivo; coretan Permanent Marker merah miring.

STORY: Pengunjung melihat masthead IOT LAB, foto prototype, dan langsung memilih kelas → kartu kelompok → portal "edisi" kelompok dengan foto, anggota, video, remote, cara pakai.

FIRST VIEWPORT: Header = baris sel bergaris (logo | tagline mono | BERANDA aktif biru | KARYA | CARA KERJA | MASUK) + kotak "KELAS IOT / MR. IQBAL". Kiri: "IOT / LAB" raksasa (≈ 1/4 lebar). Tengah: foto kit Arduino berlatar biru dengan coretan merah "SENSOR / IDE / NYALA / SELALU". Kanan: panel kuning berbayangan "PORTAL KARYA SISWA KELAS IOT", daftar mono, CTA merah "LIHAT KARYA →".

FORM: Brutalisme editorial majalah (dipatok pengguna; challenger dari roll diturunkan karena brief dipatok). Seed key 616e58ac. Interaksi khas: masthead turun seperti cetak timbul & panel kuning "dicap" (bayangan tumbuh 0→10px); kartu terangkat dengan bayangan keras saat hover.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
