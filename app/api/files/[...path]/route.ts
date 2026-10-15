import fs from "node:fs"
import path from "node:path"
import { Readable } from "node:stream"
import { UPLOAD_DIR } from "@/lib/paths"

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
}

// File unggahan disajikan lewat route ini (bukan /public) supaya tetap bisa
// diakses setelah `next build`, dan mendukung Range request untuk video.
export async function GET(request: Request, ctx: RouteContext<"/api/files/[...path]">) {
  const { path: parts } = await ctx.params
  const file = path.resolve(UPLOAD_DIR, ...parts)
  if (!file.startsWith(UPLOAD_DIR + path.sep)) return new Response("Not found", { status: 404 })

  let stat: fs.Stats
  try {
    stat = await fs.promises.stat(file)
    if (!stat.isFile()) throw new Error()
  } catch {
    return new Response("Not found", { status: 404 })
  }

  const type = TYPES[path.extname(file).slice(1).toLowerCase()] ?? "application/octet-stream"
  const headers = new Headers({
    "Content-Type": type,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  })

  const range = request.headers.get("range")
  const match = range?.match(/^bytes=(\d*)-(\d*)$/)
  if (match && (match[1] || match[2])) {
    let start: number
    let end: number
    if (match[1]) {
      start = Number(match[1])
      end = match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1
    } else {
      // suffix range: "bytes=-500" → 500 byte terakhir
      start = Math.max(0, stat.size - Number(match[2]))
      end = stat.size - 1
    }
    if (start > end || start >= stat.size) {
      headers.set("Content-Range", `bytes */${stat.size}`)
      return new Response(null, { status: 416, headers })
    }
    headers.set("Content-Range", `bytes ${start}-${end}/${stat.size}`)
    headers.set("Content-Length", String(end - start + 1))
    const stream = Readable.toWeb(fs.createReadStream(file, { start, end })) as ReadableStream
    return new Response(stream, { status: 206, headers })
  }

  headers.set("Content-Length", String(stat.size))
  const stream = Readable.toWeb(fs.createReadStream(file)) as ReadableStream
  return new Response(stream, { headers })
}
