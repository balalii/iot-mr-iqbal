"use client"

export type Uploaded = { url: string; kind: "image" | "video" }

/** Unggah satu file ke /api/upload dengan progres (XHR, karena fetch belum punya upload progress). */
export function uploadFile(groupId: number, file: File, onProgress?: (pct: number) => void): Promise<Uploaded> {
  return new Promise((resolve, reject) => {
    const form = new FormData()
    form.append("groupId", String(groupId))
    form.append("file", file)
    const xhr = new XMLHttpRequest()
    xhr.open("POST", "/api/upload")
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      let body: { url?: string; kind?: Uploaded["kind"]; error?: string } = {}
      try {
        body = JSON.parse(xhr.responseText)
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && body.url) resolve({ url: body.url, kind: body.kind ?? "image" })
      else reject(new Error(body.error || `Gagal mengunggah ${file.name}`))
    }
    xhr.onerror = () => reject(new Error("Koneksi terputus saat mengunggah."))
    xhr.send(form)
  })
}
