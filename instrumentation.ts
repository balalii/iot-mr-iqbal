// Dijalankan sekali saat server Next.js start: buat akun guru pertama di production
// kalau database masih kosong (development memakai `bun run setup`).
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.NODE_ENV === "production") {
    const { seedOnStart } = await import("./lib/seed-on-start")
    await seedOnStart()
  }
}
