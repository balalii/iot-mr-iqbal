import path from "node:path"

// Folder data lokal: rahasia sesi, dan file unggahan bila R2 tidak diatur (lib/storage.ts).
export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data")
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads")
