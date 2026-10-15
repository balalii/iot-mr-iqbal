// Dijalankan oleh `prisma db seed` (lihat prisma.config.ts).
// Hanya mengisi data contoh bila database masih kosong, jadi aman dijalankan ulang.
import { PrismaLibSql } from "@prisma/adapter-libsql"
import { PrismaClient } from "../lib/generated/prisma/client"
import { seedDatabase } from "../lib/seed"

const url = process.env.DATABASE_URL ?? "file:./data/portal.db"
const db = new PrismaClient({ adapter: new PrismaLibSql({ url }) })

try {
  if ((await db.user.count()) > 0) {
    console.log("Database sudah berisi data, seed dilewati.")
  } else {
    await seedDatabase(db)
    console.log("Data contoh dibuat: akun guru, 3 kelas, 12 kelompok.")
  }
} finally {
  await db.$disconnect()
}
