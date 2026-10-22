import { nanoid } from "nanoid"
import { authorizeGroup } from "@/lib/auth"
import { storeUpload } from "@/lib/storage"

const LIMITS = { image: 8 * 1024 * 1024, video: 80 * 1024 * 1024 }
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
}

export async function POST(request: Request) {
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return Response.json({ error: "Data unggahan tidak valid." }, { status: 400 })
  }
  const groupId = Number(form.get("groupId"))
  const file = form.get("file")
  if (!Number.isInteger(groupId) || !(file instanceof File)) {
    return Response.json({ error: "File atau kelompok tidak ditemukan." }, { status: 400 })
  }

  try {
    await authorizeGroup(groupId)
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 403 })
  }

  const ext = EXT[file.type]
  if (!ext) {
    return Response.json(
      { error: "Format tidak didukung. Gunakan JPG, PNG, WEBP, GIF, MP4, WEBM, atau MOV." },
      { status: 415 }
    )
  }
  const kind = file.type.startsWith("video/") ? "video" : "image"
  if (file.size > LIMITS[kind]) {
    const mb = LIMITS[kind] / 1024 / 1024
    return Response.json({ error: `Ukuran ${kind === "video" ? "video" : "foto"} maksimal ${mb} MB.` }, { status: 413 })
  }

  try {
    const url = await storeUpload(`g${groupId}/${nanoid(12)}.${ext}`, await file.arrayBuffer(), file.type)
    return Response.json({ url, kind })
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 502 })
  }
}
