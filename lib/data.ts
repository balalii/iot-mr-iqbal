import "server-only"
import { io } from "next/cache"
import { db } from "./db"
import type { Prisma } from "./generated/prisma/client"
import { mediaThumb } from "./portal"
import type { ClassRow, Group, GroupFull, GroupSummary, MediaItem, Member } from "./types"

// Setiap getter memanggil `await io()` lebih dulu agar Next.js tidak membekukan
// hasil query ke static shell saat build (build juga tidak butuh koneksi database).

const ORDER = [{ sort: "asc" }, { id: "asc" }] satisfies Prisma.MemberOrderByWithRelationInput[]

const GROUP_INCLUDE = {
  class: { select: { name: true, slug: true } },
  users: { where: { role: "student" }, select: { username: true }, take: 1 },
  members: { select: { id: true, name: true, role: true, photo_url: true }, orderBy: ORDER },
  media: { select: { id: true, kind: true, url: true, caption: true }, orderBy: ORDER },
} satisfies Prisma.GroupInclude

type GroupRecord = Prisma.GroupGetPayload<{ include: typeof GROUP_INCLUDE }>

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

// Data contoh memakai foto stok publik; tandai agar pengunjung tidak mengira itu siswa sungguhan.
const STOCK = /^https:\/\/(images\.unsplash\.com|randomuser\.me)\//
function isDemo(members: Member[], media: MediaItem[]) {
  return members.some((m) => STOCK.test(m.photo_url)) || media.some((m) => STOCK.test(m.url))
}

function toGroup(record: GroupRecord): GroupFull {
  const { class: cls, users, members, media, ...row } = record
  const group: Group = {
    ...row,
    class_name: cls.name,
    class_slug: cls.slug,
    updated_at: row.updated_at.toISOString(),
    components: parseJson<string[]>(row.components, []),
    usage_steps: parseJson<Group["usage_steps"]>(row.usage_steps, []),
  }
  return { ...group, members, media, username: users[0]?.username ?? null, demo: isDemo(members, media) }
}

export async function getClasses(): Promise<ClassRow[]> {
  await io()
  return db.class.findMany({ orderBy: [{ sort: "asc" }, { name: "asc" }] })
}

export async function getGroupSummaries(): Promise<GroupSummary[]> {
  await io()
  const records = await db.group.findMany({
    include: GROUP_INCLUDE,
    orderBy: [{ class: { sort: "asc" } }, { class: { name: "asc" } }, { number: "asc" }],
  })
  return records.map((record) => {
    const { media, ...g } = toGroup(record)
    return {
      ...g,
      cover: media.map(mediaThumb).find(Boolean) ?? null,
      media_count: media.length,
      video_count: media.filter((m) => m.kind !== "image").length,
    }
  })
}

export async function getGroupBySlug(slug: string): Promise<GroupFull | null> {
  await io()
  const record = await db.group.findUnique({ where: { slug }, include: GROUP_INCLUDE })
  return record ? toGroup(record) : null
}

export async function getGroupById(id: number): Promise<GroupFull | null> {
  await io()
  const record = await db.group.findUnique({ where: { id }, include: GROUP_INCLUDE })
  return record ? toGroup(record) : null
}
