import "server-only"
import { AwsClient } from "aws4fetch"
import fs from "node:fs/promises"
import path from "node:path"
import { UPLOAD_DIR } from "./paths"

// File unggahan disimpan di Cloudflare R2 bila R2_* diisi, selain itu di disk
// (data/uploads, disajikan lewat /api/files) untuk development.
const R2 = {
  accountId: process.env.R2_ACCOUNT_ID,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucket: process.env.R2_BUCKET,
  publicUrl: process.env.R2_PUBLIC_URL?.replace(/\/$/, ""),
}

const r2 =
  R2.accountId && R2.accessKeyId && R2.secretAccessKey && R2.bucket && R2.publicUrl
    ? new AwsClient({
        accessKeyId: R2.accessKeyId,
        secretAccessKey: R2.secretAccessKey,
        service: "s3",
        region: "auto",
      })
    : null

/** Simpan file unggahan dan kembalikan URL publiknya. `key` mis. "g3/abc123.mp4". */
export async function storeUpload(key: string, body: ArrayBuffer, contentType: string): Promise<string> {
  if (r2) {
    const objectKey = `uploads/${key}`
    const res = await r2.fetch(`https://${R2.accountId}.r2.cloudflarestorage.com/${R2.bucket}/${objectKey}`, {
      method: "PUT",
      body,
      headers: {
        "Content-Type": contentType,
        // Nama file acak dan tidak pernah ditimpa, jadi aman di-cache selamanya.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
    if (!res.ok) {
      console.error("R2 upload gagal", res.status, await res.text().catch(() => ""))
      throw new Error("Gagal menyimpan file ke penyimpanan.")
    }
    return `${R2.publicUrl}/${objectKey}`
  }

  const file = path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, key)
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, new Uint8Array(body))
  return `/api/files/${key}`
}
