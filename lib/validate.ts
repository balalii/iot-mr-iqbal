import "server-only"

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string }

export function text(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : ""
}

/** Hanya izinkan http(s) atau file unggahan lokal — mencegah `javascript:` di href/src. */
export function safeUrl(v: unknown, { allowLocal = false } = {}): string {
  const s = text(v, 2000)
  if (!s) return ""
  if (allowLocal && /^\/api\/files\/[\w./-]+$/.test(s) && !s.includes("..")) return s
  try {
    const u = new URL(s)
    if (u.protocol === "http:" || u.protocol === "https:") return u.toString()
  } catch {}
  throw new Error(`Link tidak valid: ${s.slice(0, 60)}`)
}

export function fail(err: unknown): { ok: false; error: string } {
  // redirect()/notFound() dari Next harus tetap dilempar.
  if (err && typeof err === "object" && "digest" in err) throw err
  return { ok: false, error: err instanceof Error ? err.message : "Terjadi kesalahan." }
}
