"use server"

import bcrypt from "bcryptjs"
import { refresh } from "next/cache"
import { redirect } from "next/navigation"
import { requireTeacher } from "@/lib/auth"
import { db } from "@/lib/db"
import { slugify } from "@/lib/portal"
import { fail, text, type ActionResult } from "@/lib/validate"

async function uniqueSlug(model: "class" | "group", base: string, exceptId?: number) {
  const root = slugify(base) || "item"
  const taken = async (slug: string) => {
    const where = { slug, id: { not: exceptId ?? -1 } }
    return model === "class" ? db.class.findFirst({ where }) : db.group.findFirst({ where })
  }
  let slug = root
  for (let i = 2; await taken(slug); i++) slug = `${root}-${i}`
  return slug
}

async function checkUsername(username: string, exceptGroupId?: number) {
  if (!/^[a-z0-9._-]{3,32}$/i.test(username))
    throw new Error("Username 3–32 karakter: huruf, angka, titik, - atau _.")
  const hit = await db.user.findUnique({ where: { username }, select: { group_id: true } })
  if (hit && hit.group_id !== exceptGroupId) throw new Error(`Username "${username}" sudah dipakai.`)
}

function checkPassword(pw: string) {
  if (pw.length < 6) throw new Error("Password minimal 6 karakter.")
}

export async function createClass(name: string): Promise<ActionResult> {
  try {
    await requireTeacher()
    const n = text(name, 40)
    if (!n) throw new Error("Nama kelas wajib diisi.")
    const { _max } = await db.class.aggregate({ _max: { sort: true } })
    await db.class.create({ data: { name: n, slug: await uniqueSlug("class", n), sort: (_max.sort ?? -1) + 1 } })
    refresh()
    return { ok: true, message: `Kelas ${n} ditambahkan.` }
  } catch (err) {
    return fail(err)
  }
}

export async function renameClass(classId: number, name: string): Promise<ActionResult> {
  try {
    await requireTeacher()
    const n = text(name, 40)
    if (!n) throw new Error("Nama kelas wajib diisi.")
    await db.class.update({ where: { id: classId }, data: { name: n } })
    refresh()
    return { ok: true, message: "Nama kelas diperbarui." }
  } catch (err) {
    return fail(err)
  }
}

export async function deleteClass(classId: number): Promise<ActionResult> {
  try {
    await requireTeacher()
    // Kelompok, anggota, galeri, dan akun siswa ikut terhapus (onDelete: Cascade di skema).
    await db.class.delete({ where: { id: classId } })
    refresh()
    return { ok: true, message: "Kelas dihapus." }
  } catch (err) {
    return fail(err)
  }
}

export async function createGroup(input: {
  classId: number
  name: string
  number: number
  username: string
  password: string
}): Promise<ActionResult> {
  try {
    await requireTeacher()
    const cls = await db.class.findUnique({ where: { id: input.classId }, select: { name: true, slug: true } })
    if (!cls) throw new Error("Kelas tidak ditemukan.")
    const name = text(input.name, 60) || `Kelompok ${input.number}`
    const number = Math.max(1, Math.min(99, Math.floor(Number(input.number) || 1)))
    const username = text(input.username, 32).toLowerCase()
    await checkUsername(username)
    checkPassword(input.password)
    const hash = await bcrypt.hash(input.password, 10)

    // Kelompok & akun siswanya dibuat dalam satu query bersarang (atomik).
    await db.group.create({
      data: {
        class_id: input.classId,
        number,
        name,
        slug: await uniqueSlug("group", `${cls.slug}-${name}`),
        users: { create: { username, password_hash: hash, role: "student", name: `${name} · ${cls.name}` } },
      },
    })
    refresh()
    return { ok: true, message: `${name} dibuat. Bagikan username & password ke siswa.` }
  } catch (err) {
    return fail(err)
  }
}

export async function updateGroupMeta(
  groupId: number,
  input: { classId: number; name: string; number: number; username: string; teacher_note: string }
): Promise<ActionResult> {
  try {
    await requireTeacher()
    const name = text(input.name, 60)
    if (!name) throw new Error("Nama kelompok wajib diisi.")
    const username = text(input.username, 32).toLowerCase()
    await checkUsername(username, groupId)
    const cls = await db.class.findUnique({ where: { id: input.classId }, select: { name: true } })
    if (!cls) throw new Error("Kelas tidak ditemukan.")
    const number = Math.max(1, Math.min(99, Math.floor(Number(input.number) || 1)))
    await db.$transaction([
      db.group.update({
        where: { id: groupId },
        data: { class_id: input.classId, name, number, teacher_note: text(input.teacher_note, 1000) },
      }),
      db.user.updateMany({
        where: { group_id: groupId, role: "student" },
        data: { username, name: `${name} · ${cls.name}` },
      }),
    ])
    refresh()
    return { ok: true, message: "Data kelompok diperbarui." }
  } catch (err) {
    return fail(err)
  }
}

export async function resetGroupPassword(groupId: number, password: string): Promise<ActionResult> {
  try {
    await requireTeacher()
    checkPassword(password)
    const hash = await bcrypt.hash(password, 10)
    const { count } = await db.user.updateMany({
      where: { group_id: groupId, role: "student" },
      data: { password_hash: hash },
    })
    if (!count) throw new Error("Akun kelompok tidak ditemukan.")
    return { ok: true, message: "Password kelompok diganti." }
  } catch (err) {
    return fail(err)
  }
}

export async function deleteGroup(groupId: number): Promise<ActionResult> {
  try {
    await requireTeacher()
    await db.group.delete({ where: { id: groupId } })
  } catch (err) {
    return fail(err)
  }
  redirect("/guru")
}

export async function changeOwnPassword(current: string, next: string): Promise<ActionResult> {
  try {
    const me = await requireTeacher()
    const row = await db.user.findUniqueOrThrow({ where: { id: me.id }, select: { password_hash: true } })
    if (!(await bcrypt.compare(current, row.password_hash))) throw new Error("Password lama salah.")
    checkPassword(next)
    await db.user.update({ where: { id: me.id }, data: { password_hash: await bcrypt.hash(next, 10) } })
    return { ok: true, message: "Password kamu sudah diganti." }
  } catch (err) {
    return fail(err)
  }
}
