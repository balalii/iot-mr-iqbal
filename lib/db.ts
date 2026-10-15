import "server-only"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import { PrismaClient } from "./generated/prisma/client"

// Harus sama dengan default di prisma.config.ts.
export const DATABASE_URL = process.env.DATABASE_URL ?? "file:./data/portal.db"

function create() {
  return new PrismaClient({ adapter: new PrismaLibSql({ url: DATABASE_URL }) })
}

// Satu klien per proses; disimpan di globalThis agar tidak dibuat ulang saat HMR.
const globalForDb = globalThis as unknown as { __iotPrisma?: PrismaClient }
export const db = globalForDb.__iotPrisma ?? create()
if (process.env.NODE_ENV !== "production") globalForDb.__iotPrisma = db

/** Format waktu UTC sama seperti CURRENT_TIMESTAMP SQLite: "YYYY-MM-DD HH:MM:SS". */
export function sqliteNow() {
  return new Date().toISOString().slice(0, 19).replace("T", " ")
}
