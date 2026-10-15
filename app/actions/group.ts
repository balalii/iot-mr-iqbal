"use server"

import { refresh } from "next/cache"
import { authorizeGroup } from "@/lib/auth"
import { db, sqliteNow } from "@/lib/db"
import type { Prisma } from "@/lib/generated/prisma/client"
import { youtubeId } from "@/lib/portal"
import type { MediaItem, MediaKind, Member, UsageStep } from "@/lib/types"
import { fail, safeUrl, text, type ActionResult } from "@/lib/validate"

/** Ubah kolom kelompok sekaligus menandai waktu pembaruan. */
function updateGroup(groupId: number, data: Prisma.GroupUpdateInput) {
  return db.group.update({ where: { id: groupId }, data: { ...data, updated_at: sqliteNow() } })
}

export async function saveProjectInfo(
  groupId: number,
  input: { project_title: string; tagline: string; description: string; how_it_works: string; code_url: string }
): Promise<ActionResult> {
  try {
    await authorizeGroup(groupId)
    await updateGroup(groupId, {
      project_title: text(input.project_title, 120),
      tagline: text(input.tagline, 160),
      description: text(input.description, 4000),
      how_it_works: text(input.how_it_works, 4000),
      code_url: safeUrl(input.code_url),
    })
    refresh()
    return { ok: true, message: "Info proyek tersimpan." }
  } catch (err) {
    return fail(err)
  }
}

export async function saveMembers(groupId: number, members: Member[]): Promise<ActionResult> {
  try {
    await authorizeGroup(groupId)
    const clean = members
      .slice(0, 12)
      .map((m) => ({
        name: text(m.name, 80),
        role: text(m.role, 60),
        photo_url: safeUrl(m.photo_url, { allowLocal: true }),
      }))
      .filter((m) => m.name)
    await db.$transaction([
      db.member.deleteMany({ where: { group_id: groupId } }),
      db.member.createMany({ data: clean.map((m, i) => ({ ...m, group_id: groupId, sort: i })) }),
      updateGroup(groupId, {}),
    ])
    refresh()
    return { ok: true, message: `${clean.length} anggota tersimpan.` }
  } catch (err) {
    return fail(err)
  }
}

export async function saveMedia(groupId: number, items: MediaItem[]): Promise<ActionResult> {
  try {
    await authorizeGroup(groupId)
    const clean = items.slice(0, 30).map((m) => {
      const kind: MediaKind = m.kind === "video" || m.kind === "youtube" ? m.kind : "image"
      const url = safeUrl(m.url, { allowLocal: true })
      if (!url) throw new Error("Ada item galeri tanpa file/link.")
      if (kind === "youtube" && !youtubeId(url)) throw new Error("Link YouTube tidak dikenali.")
      return { kind, url, caption: text(m.caption, 200) }
    })
    await db.$transaction([
      db.media.deleteMany({ where: { group_id: groupId } }),
      db.media.createMany({ data: clean.map((m, i) => ({ ...m, group_id: groupId, sort: i })) }),
      updateGroup(groupId, {}),
    ])
    refresh()
    return { ok: true, message: `Galeri tersimpan (${clean.length} item).` }
  } catch (err) {
    return fail(err)
  }
}

export async function saveGuide(
  groupId: number,
  input: { components: string[]; usage_steps: UsageStep[] }
): Promise<ActionResult> {
  try {
    await authorizeGroup(groupId)
    const components = input.components.map((c) => text(c, 100)).filter(Boolean).slice(0, 30)
    const steps = input.usage_steps
      .map((s) => ({ title: text(s.title, 100), detail: text(s.detail, 600) }))
      .filter((s) => s.title || s.detail)
      .slice(0, 20)
    await updateGroup(groupId, { components: JSON.stringify(components), usage_steps: JSON.stringify(steps) })
    refresh()
    return { ok: true, message: "Komponen & cara penggunaan tersimpan." }
  } catch (err) {
    return fail(err)
  }
}

export async function saveRemote(
  groupId: number,
  input: { remote_url: string; remote_label: string; remote_note: string }
): Promise<ActionResult> {
  try {
    await authorizeGroup(groupId)
    await updateGroup(groupId, {
      remote_url: safeUrl(input.remote_url),
      remote_label: text(input.remote_label, 60),
      remote_note: text(input.remote_note, 400),
    })
    refresh()
    return { ok: true, message: "Akses remote tersimpan." }
  } catch (err) {
    return fail(err)
  }
}
