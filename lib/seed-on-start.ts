import bcrypt from "bcryptjs"
import { randomBytes } from "node:crypto"
import { db } from "./db"

// Dipanggil sekali saat server production start (instrumentation.ts): buat akun guru
// pertama kalau database belum punya pengguna sama sekali. Data contoh (kelas, kelompok,
// galeri) tidak ikut dibuat di production; itu tugas `bun run setup` untuk development.
export async function seedOnStart() {
  try {
    if ((await db.user.count()) > 0) return
    const password = process.env.GURU_INITIAL_PASSWORD || randomBytes(9).toString("base64url")
    await db.user.create({
      data: { username: "guru", password_hash: await bcrypt.hash(password, 10), role: "teacher", name: "Mr. Iqbal" },
    })
    if (process.env.GURU_INITIAL_PASSWORD) {
      console.log("[seed] Akun guru dibuat — username: guru (password dari GURU_INITIAL_PASSWORD).")
    } else {
      console.log(`[seed] Akun guru dibuat — username: guru, password: ${password} (segera ganti di menu profil).`)
    }
  } catch (error) {
    console.error("[seed] Gagal membuat akun guru:", error)
  }
}
