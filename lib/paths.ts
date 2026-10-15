import path from "node:path"

// Folder data lokal: file unggahan & rahasia sesi. Database diatur lewat DATABASE_URL.
export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data")
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads")
