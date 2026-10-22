// Dijalankan oleh `prisma db seed` (lihat prisma.config.ts).
// Hanya mengisi data contoh bila database masih kosong, jadi aman dijalankan ulang.
import { PrismaPg } from "@prisma/adapter-pg"
import { DATABASE_URL } from "../lib/database-url"
import { PrismaClient } from "../lib/generated/prisma/client"
import { seedDatabase } from "../lib/seed"

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) })

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
