import "server-only"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "./generated/prisma/client"
import { DATABASE_URL } from "./database-url"

function create() {
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) })
}

// Satu klien per proses; disimpan di globalThis agar tidak dibuat ulang saat HMR.
const globalForDb = globalThis as unknown as { __iotPrisma?: PrismaClient }
export const db = globalForDb.__iotPrisma ?? create()
if (process.env.NODE_ENV !== "production") globalForDb.__iotPrisma = db
