// Utilitas yang aman dipakai di server maupun client.
import type { GroupFull, GroupSummary, MediaItem } from "./types"

export function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  )
  return m ? m[1] : /^[\w-]{11}$/.test(url) ? url : null
}

export function mediaThumb(item: MediaItem): string | null {
  if (item.kind === "image") return item.url
  if (item.kind === "youtube") {
    const id = youtubeId(item.url)
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
  }
  return null
}

export type Check = { key: string; label: string; done: boolean }

type CompletenessInput = Pick<
  GroupSummary,
  "project_title" | "description" | "members" | "components" | "usage_steps" | "remote_url" | "media_count" | "video_count"
>

export function completeness(g: CompletenessInput) {
  const checks: Check[] = [
    { key: "info", label: "Judul & deskripsi proyek", done: !!g.project_title && g.description.length >= 30 },
    { key: "members", label: "Minimal 2 anggota", done: g.members.length >= 2 },
    { key: "photos", label: "Foto setiap anggota", done: g.members.length > 0 && g.members.every((m) => !!m.photo_url) },
    { key: "gallery", label: "Minimal 3 foto/video proyek", done: g.media_count >= 3 },
    { key: "video", label: "Minimal 1 video demo", done: g.video_count >= 1 },
    { key: "components", label: "Minimal 3 komponen", done: g.components.length >= 3 },
    { key: "guide", label: "Minimal 3 langkah penggunaan", done: g.usage_steps.length >= 3 },
    { key: "remote", label: "Link akses remote", done: !!g.remote_url },
  ]
  const done = checks.filter((c) => c.done).length
  return { checks, done, total: checks.length, percent: Math.round((done / checks.length) * 100) }
}

/** Ringkasan hitungan media untuk GroupFull agar bisa dipakai completeness(). */
export function withCounts(g: GroupFull) {
  return {
    ...g,
    media_count: g.media.length,
    video_count: g.media.filter((m) => m.kind !== "image").length,
  }
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("")
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
}

export function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
}
