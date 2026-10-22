// Dipakai bersama oleh aplikasi dan prisma/seed.ts, jadi tanpa "server-only".
// Default hanya untuk Postgres lokal biasa; isi DATABASE_URL di .env.local (lihat README).
export const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/portal?schema=public"
