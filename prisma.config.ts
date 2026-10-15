import { loadEnvConfig } from "@next/env"
import { defineConfig } from "prisma/config"

// Baca .env / .env.local dengan aturan yang sama seperti Next.js,
// supaya CLI Prisma dan aplikasi memakai database yang sama.
loadEnvConfig(process.cwd())

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "bun prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./data/portal.db",
  },
})
